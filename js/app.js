/* ==========================================================================
   SOCIAL – Checklist di progetto · logica
   ========================================================================== */

(function () {
  const DATA = window.SOCIAL_DATA;
  const TPL = window.SOCIAL_TEMPLATES;
  const icon = window.SOCIAL_ICON;
  const KEY = DATA.project.storageKey;

  /* ---------- Stato (salvato nel browser) ---------- */
  const storage = {
    load() { try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { return null; } },
    save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} },
    clear() { try { localStorage.removeItem(KEY); } catch (e) {} }
  };
  const saved = storage.load() || {};
  const state = {
    answers: saved.answers || {},
    decision: saved.decision || {},
    notes: saved.notes || {},
    open: saved.open || {}
  };
  let filter = "all";
  let saveTimer;
  const persist = () => { clearTimeout(saveTimer); saveTimer = setTimeout(() => storage.save(state), 150); };

  /* ---------- Helper ---------- */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const allItems = () => DATA.sections.flatMap((s) => s.items);
  const itemById = (id) => allItems().find((i) => i.id === id);
  const fieldById = (id) => { for (const it of allItems()) { const f = it.fields.find((x) => x.id === id); if (f) return { it, f }; } return {}; };

  const TYPE = {
    choice: { label: "Scelta singola", ic: "radio" },
    multi: { label: "Più risposte possibili", ic: "checks" },
    matrix: { label: "Una risposta per riga", ic: "grid" },
    date: { label: "Data", ic: "calendar" },
    text: { label: "Testo libero", ic: "text" },
    links: { label: "Elenco di link", ic: "link" }
  };

  const STATUS = {
    todo: "Da definire",
    progress: "In corso",
    ready: "Pronto da validare",
    validated: "Validato",
    discarded: "Scartato"
  };

  /* ---------- Logica risposte ---------- */
  const isVisible = (f) => !f.showIf || !!f.showIf(state.answers);

  function isAnswered(f) {
    const v = state.answers[f.id];
    switch (f.type) {
      case "choice": return !!v;
      case "multi": return Array.isArray(v) && v.length > 0;
      case "matrix": return !!v && f.rows.every((r) => v[r.id]);
      case "date":
      case "text": return !!v && String(v).trim() !== "";
      case "links": return Array.isArray(v) && v.some((l) => l.url && l.url.trim());
    }
    return false;
  }

  function progress(it) {
    const req = it.fields.filter((f) => isVisible(f) && !f.optional);
    return { done: req.filter(isAnswered).length, total: req.length };
  }

  function status(it) {
    const d = state.decision[it.id];
    if (d === "ok") return "validated";
    if (d === "ko") return "discarded";
    const p = progress(it);
    if (p.done === 0) return "todo";
    return p.done === p.total ? "ready" : "progress";
  }

  /* ---------- Render: campi ---------- */
  function chip(type) {
    const t = TYPE[type];
    return '<span class="tchip tchip--' + type + '">' + icon(t.ic) + "<span>" + t.label + "</span></span>";
  }

  function choiceHTML(f) {
    const v = state.answers[f.id];
    const cls = f.layout === "inline" ? "choices choices--inline" : "choices choices--cards";
    return (
      '<div class="' + cls + '" role="radiogroup" aria-label="' + esc(f.label) + '">' +
      f.options.map((o) =>
        '<label class="choice">' +
        '<input type="radio" name="' + f.id + '" value="' + o.v + '" data-f="' + f.id + '"' + (v === o.v ? " checked" : "") + ">" +
        '<span class="choice__mark" aria-hidden="true"></span>' +
        '<span class="choice__body"><span class="choice__label">' + esc(o.label) +
        (o.badge ? '<span class="badge">' + esc(o.badge) + "</span>" : "") + "</span>" +
        (o.desc ? '<span class="choice__desc">' + esc(o.desc) + "</span>" : "") +
        "</span></label>"
      ).join("") +
      "</div>"
    );
  }

  function multiHTML(f) {
    const v = state.answers[f.id] || [];
    return (
      '<div class="multi" data-multi="' + f.id + '">' +
      f.options.map((o) => {
        const checked = o.locked || v.includes(o.v);
        return (
          '<label class="opt' + (o.locked ? " is-locked" : "") + (o.none ? " opt--none" : "") + (checked ? " is-checked" : "") + '">' +
          '<input type="checkbox" data-f="' + f.id + '" value="' + o.v + '"' + (checked ? " checked" : "") + (o.locked ? " disabled" : "") + ">" +
          '<span class="check__box" aria-hidden="true">' + icon(o.none ? "x" : "check") + "</span>" +
          '<span class="opt__body"><span class="opt__label">' + esc(o.label) +
          (o.locked ? '<span class="opt__tag">Già previsto</span>' : "") + "</span>" +
          (o.desc ? '<span class="opt__desc">' + esc(o.desc) + "</span>" : "") +
          "</span></label>"
        );
      }).join("") +
      '</div><p class="multi__count" data-mcount="' + f.id + '"></p>'
    );
  }

  function matrixHTML(f) {
    const v = state.answers[f.id] || {};
    return (
      '<div class="matrix">' +
      f.rows.map((r) =>
        '<div class="matrix__row' + (v[r.id] ? " is-set" : "") + '" data-mrow="' + f.id + "__" + r.id + '">' +
        '<div class="matrix__label"><span>' + esc(r.label) + "</span>" +
        (r.template ? '<button type="button" class="link-btn" data-template="' + r.template + '">' + icon("eye") + "<span>Vedi esempio</span></button>" : "") +
        "</div>" +
        '<div class="seg" role="radiogroup" aria-label="' + esc(r.label) + '">' +
        f.options.map((o) =>
          '<label class="seg__opt' + (o.muted ? " seg__opt--muted" : "") + '">' +
          '<input type="radio" name="' + f.id + "__" + r.id + '" value="' + o.v + '" data-f="' + f.id + '" data-row="' + r.id + '"' + (v[r.id] === o.v ? " checked" : "") + ">" +
          "<span>" + esc(o.label) + "</span></label>"
        ).join("") +
        "</div></div>"
      ).join("") +
      "</div>"
    );
  }

  function linkRowHTML(f, l, i) {
    return (
      '<div class="link-row">' +
      '<input type="url" class="input" inputmode="url" placeholder="https://…" aria-label="Indirizzo del riferimento ' + (i + 1) + '" data-link="' + f.id + '" data-idx="' + i + '" data-k="url" value="' + esc(l.url) + '">' +
      '<select class="input" aria-label="Tipo di riferimento" data-link="' + f.id + '" data-idx="' + i + '" data-k="tag">' +
      '<option value="">Tipo di riferimento</option>' +
      f.tags.map((t) => '<option value="' + t.v + '"' + (l.tag === t.v ? " selected" : "") + ">" + esc(t.label) + "</option>").join("") +
      "</select>" +
      '<button type="button" class="icon-btn" data-dellink="' + f.id + '" data-idx="' + i + '" aria-label="Rimuovi riferimento">' + icon("trash") + "</button>" +
      "</div>"
    );
  }
  function linksHTML(f) {
    const list = Array.isArray(state.answers[f.id]) && state.answers[f.id].length ? state.answers[f.id] : [{ url: "", tag: "" }];
    return (
      '<div class="links" data-links="' + f.id + '">' + list.map((l, i) => linkRowHTML(f, l, i)).join("") + "</div>" +
      '<button type="button" class="btn btn--add" data-addlink="' + f.id + '">' + icon("plus") + "<span>Aggiungi riferimento</span></button>"
    );
  }

  function fieldHTML(f) {
    let body = "";
    if (f.type === "choice") body = choiceHTML(f);
    else if (f.type === "multi") body = multiHTML(f);
    else if (f.type === "matrix") body = matrixHTML(f);
    else if (f.type === "date") body = '<input type="date" class="input input--date" data-f="' + f.id + '" value="' + esc(state.answers[f.id]) + '" aria-label="' + esc(f.label) + '">';
    else if (f.type === "text") body = '<input type="text" class="input" data-f="' + f.id + '" value="' + esc(state.answers[f.id]) + '" placeholder="' + esc(f.placeholder || "") + '" aria-label="' + esc(f.label) + '">';
    else if (f.type === "links") body = linksHTML(f);

    return (
      '<div class="field field--' + f.type + (f.showIf ? " field--cond" : "") + '" data-field="' + f.id + '"' + (isVisible(f) ? "" : " hidden") + ">" +
      '<div class="field__head"><span class="field__label">' + esc(f.label) +
      (f.optional ? '<span class="field__opt">facoltativo</span>' : "") + "</span>" + chip(f.type) + "</div>" +
      (f.help ? '<p class="field__help">' + esc(f.help) + "</p>" : "") +
      body +
      (f.legend ? '<p class="field__legend">' + esc(f.legend) + "</p>" : "") +
      "</div>"
    );
  }

  /* ---------- Render: punti ---------- */
  function templateCTA() {
    const tabs = Object.keys(TPL)
      .map((k) => '<button type="button" class="tcta__chip" data-template="' + k + '">' + icon(TPL[k].icon) + "<span>" + TPL[k].label + "</span></button>")
      .join("");
    return (
      '<div class="tcta">' +
      '<div class="tcta__thumb" aria-hidden="true"><span class="tcta__line tcta__line--s"></span><span class="tcta__line"></span><span class="tcta__cards"><i></i><i></i><i></i></span></div>' +
      '<div class="tcta__text"><p class="tcta__eyebrow">Anteprima template</p>' +
      "<h4>Come potrebbero apparire i contenuti di esempio</h4>" +
      "<p>Modelli generici con testi e immagini segnaposto, utili per mostrare al cliente quali informazioni servono per ogni sezione.</p>" +
      '<div class="tcta__chips">' + tabs + "</div></div></div>"
    );
  }

  const RING_C = 2 * Math.PI * 11;
  function ringHTML(id) {
    return (
      '<span class="ring" data-ring="' + id + '" aria-hidden="true">' +
      '<svg viewBox="0 0 28 28"><circle class="ring__bg" cx="14" cy="14" r="11"/>' +
      '<circle class="ring__fg" cx="14" cy="14" r="11" stroke-dasharray="' + RING_C.toFixed(2) + '" stroke-dashoffset="' + RING_C.toFixed(2) + '"/></svg>' +
      '<span class="ring__ok">' + icon("check") + '</span><span class="ring__ko">' + icon("x") + "</span></span>"
    );
  }

  function itemHTML(it) {
    const open = state.open[it.id] !== undefined ? state.open[it.id] : it.n === 1;
    return (
      '<article class="item' + (open ? " is-open" : "") + '" data-item="' + it.id + '">' +
      '<div class="item__head">' +
      '<button type="button" class="item__toggle" data-toggle="' + it.id + '" aria-expanded="' + open + '" aria-controls="body-' + it.id + '">' +
      ringHTML(it.id) +
      '<span class="item__num">' + String(it.n).padStart(2, "0") + "</span>" +
      '<span class="item__titles"><span class="item__title">' + esc(it.title) + "</span>" +
      '<span class="item__q">' + esc(it.question) + "</span></span>" +
      '<span class="item__meta"><span class="pill" data-pill="' + it.id + '"></span>' +
      '<span class="item__count" data-icount="' + it.id + '"></span></span>' +
      '<span class="item__chev">' + icon("chevron") + "</span>" +
      "</button></div>" +
      '<div class="item__body" id="body-' + it.id + '"><div class="item__clip"><div class="item__inner">' +
      '<div class="fields-list">' + it.fields.map(fieldHTML).join("") + "</div>" +
      (it.template ? templateCTA() : "") +
      '<div class="notes"><label for="note-' + it.id + '">' + icon("note") + '<span data-notelabel="' + it.id + '">Note / risposta del cliente</span></label>' +
      '<textarea id="note-' + it.id + '" data-note="' + it.id + '" rows="2" placeholder="Annota qui dettagli, dubbi o decisioni…">' + esc(state.notes[it.id]) + "</textarea></div>" +
      '<div class="decision">' +
      '<div class="decision__text"><span class="decision__label">Esito del punto</span><span class="decision__hint" data-dhint="' + it.id + '"></span></div>' +
      '<div class="decision__btns" role="group" aria-label="Esito del punto ' + it.n + '">' +
      '<button type="button" class="dbtn dbtn--ok" data-decide="ok" data-for="' + it.id + '" aria-pressed="false">' + icon("check") + "<span>Valida</span></button>" +
      '<button type="button" class="dbtn dbtn--ko" data-decide="ko" data-for="' + it.id + '" aria-pressed="false">' + icon("x") + "<span>Scarta</span></button>" +
      "</div></div>" +
      "</div></div></div></article>"
    );
  }

  function render() {
    $("#sections").innerHTML = DATA.sections.map((sec, i) =>
      '<section class="group" data-section="' + sec.id + '" aria-labelledby="h-' + sec.id + '">' +
      '<header class="group__head"><span class="group__idx">' + String(i + 1).padStart(2, "0") + "</span>" +
      '<h2 class="group__title" id="h-' + sec.id + '">' + esc(sec.title) + "</h2>" +
      '<span class="group__count" data-gcount="' + sec.id + '"></span></header>' +
      '<div class="group__items">' + sec.items.map(itemHTML).join("") + "</div></section>"
    ).join("");
    allItems().forEach(updateItem);
    updateTotals();
    applyFilter();
    syncExpandBtn();
  }

  /* ---------- Aggiornamenti mirati ---------- */
  function updateItem(it) {
    const el = $('[data-item="' + it.id + '"]');
    if (!el) return;
    const st = status(it);
    const p = progress(it);
    el.dataset.status = st;

    // visibilità campi condizionali
    it.fields.forEach((f) => {
      const fe = $('[data-field="' + f.id + '"]', el);
      const vis = isVisible(f);
      if (fe.hidden === vis) {
        fe.hidden = !vis;
        if (vis) { fe.classList.add("is-revealed"); setTimeout(() => fe.classList.remove("is-revealed"), 400); }
      }
      if (f.type === "multi") {
        const v = state.answers[f.id] || [];
        const pick = f.options.filter((o) => !o.locked && !o.none);
        const n = v.filter((x) => x !== "__none").length;
        const c = $('[data-mcount="' + f.id + '"]', el);
        c.textContent = v.includes("__none") ? "Nessuna aggiunta" : n ? n + " di " + pick.length + " selezionat" + (n === 1 ? "o" : "i") : "Seleziona tutte le opzioni che servono";
        c.classList.toggle("is-set", v.length > 0);
        $$(".opt", fe).forEach((o) => o.classList.toggle("is-checked", $("input", o).checked));
      }
      if (f.type === "matrix") {
        const v = state.answers[f.id] || {};
        f.rows.forEach((r) => {
          const row = $('[data-mrow="' + f.id + "__" + r.id + '"]', el);
          row.classList.toggle("is-set", !!v[r.id]);
          row.classList.toggle("is-skip", v[r.id] === "no");
        });
      }
      fe.classList.toggle("is-answered", isAnswered(f));
    });

    // anello di avanzamento
    const ring = $('[data-ring="' + it.id + '"]', el);
    const frac = p.total ? p.done / p.total : 0;
    $(".ring__fg", ring).setAttribute("stroke-dashoffset", (RING_C * (1 - frac)).toFixed(2));
    ring.dataset.state = st;

    const pill = $('[data-pill="' + it.id + '"]', el);
    pill.textContent = STATUS[st];
    pill.className = "pill pill--" + st;
    $('[data-icount="' + it.id + '"]', el).textContent = p.done + "/" + p.total + " risposte";

    // esito
    const d = state.decision[it.id];
    $$("[data-decide]", el).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.decide === d)));
    const missing = p.total - p.done;
    $('[data-dhint="' + it.id + '"]', el).textContent =
      d === "ok" ? "Punto validato" + (missing ? " (con " + missing + " rispost" + (missing === 1 ? "a" : "e") + " ancora aperte)" : "") :
      d === "ko" ? "Punto scartato: non verrà sviluppato. Indica il motivo nelle note." :
      missing ? "Manca" + (missing === 1 ? " 1 risposta" : "no " + missing + " risposte") + ": puoi comunque validare o scartare il punto." :
      "Tutte le risposte sono state date: puoi validare il punto.";
    $('[data-notelabel="' + it.id + '"]', el).textContent = d === "ko" ? "Motivo dello scarto" : "Note / risposta del cliente";
  }

  function updateTotals() {
    const items = allItems();
    const n = items.length;
    const ok = items.filter((it) => state.decision[it.id] === "ok").length;
    const ko = items.filter((it) => state.decision[it.id] === "ko").length;
    const active = items.filter((it) => state.decision[it.id] !== "ko");
    const ans = active.reduce((a, it) => a + progress(it).done, 0);
    const req = active.reduce((a, it) => a + progress(it).total, 0);
    const closedPct = Math.round(((ok + ko) / n) * 100);

    $("#statOk").textContent = ok;
    $("#statKo").textContent = ko;
    $("#statOpen").textContent = n - ok - ko;
    $("#statAns").textContent = ans + "/" + req;
    $("#barOk").style.width = (ok / n) * 100 + "%";
    $("#barKo").style.width = (ko / n) * 100 + "%";
    $("#overallProgress").setAttribute("aria-valuenow", closedPct);
    $("#overallPct").textContent = closedPct + "% dei punti chiusi";
    $("#topCount").textContent = closedPct + "%";
    $("#topBar").style.width = closedPct + "%";

    DATA.sections.forEach((sec) => {
      const closed = sec.items.filter((it) => state.decision[it.id]).length;
      const el = $('[data-gcount="' + sec.id + '"]');
      el.textContent = closed + "/" + sec.items.length + (sec.items.length === 1 ? " punto chiuso" : " punti chiusi");
      el.classList.toggle("is-done", closed === sec.items.length);
    });
  }

  function refresh(it) {
    updateItem(it);
    updateTotals();
    persist();
    if (filter !== "all") setTimeout(applyFilter, 400);
  }

  function applyFilter() {
    $$(".item").forEach((el) => {
      const st = el.dataset.status;
      el.hidden = !(
        filter === "all" ||
        (filter === "open" && ["todo", "progress", "ready"].includes(st)) ||
        filter === st
      );
    });
    $$(".group").forEach((g) => { g.hidden = $$(".item", g).every((i) => i.hidden); });
    $("#emptyState").hidden = $$(".item").some((i) => !i.hidden);
    $$("[data-filter]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.filter === filter)));
  }

  function setOpen(id, open) {
    const el = $('[data-item="' + id + '"]');
    el.classList.toggle("is-open", open);
    $('[data-toggle="' + id + '"]', el).setAttribute("aria-expanded", String(open));
    state.open[id] = open;
  }

  /* ---------- Eventi sui campi ---------- */
  const root = $("#sections");

  // Click su un radio già selezionato = deseleziona
  root.addEventListener("click", (e) => {
    const r = e.target;
    if (!(r.matches && r.matches('input[type="radio"][data-f]'))) return;
    const { f, it } = fieldById(r.dataset.f);
    if (f.type === "matrix") {
      const v = state.answers[f.id] || {};
      if (v[r.dataset.row] === r.value) {
        r.checked = false;
        delete v[r.dataset.row];
        state.answers[f.id] = v;
        refresh(it);
      }
    } else if (state.answers[f.id] === r.value) {
      r.checked = false;
      delete state.answers[f.id];
      refresh(it);
    }
  });

  root.addEventListener("change", (e) => {
    const t = e.target;
    if (!t.dataset || !t.dataset.f) return;
    const { f, it } = fieldById(t.dataset.f);
    if (!f) return;

    if (f.type === "choice" && t.checked) {
      state.answers[f.id] = t.value;
    } else if (f.type === "matrix" && t.checked) {
      const v = state.answers[f.id] || {};
      v[t.dataset.row] = t.value;
      state.answers[f.id] = v;
    } else if (f.type === "multi") {
      const box = t.closest(".multi");
      if (t.checked && t.value === "__none") {
        $$("input:not([disabled])", box).forEach((x) => { if (x !== t) x.checked = false; });
      } else if (t.checked) {
        const none = $('input[value="__none"]', box);
        if (none) none.checked = false;
      }
      state.answers[f.id] = $$("input:not([disabled])", box).filter((x) => x.checked).map((x) => x.value);
    } else if (f.type === "date") {
      state.answers[f.id] = t.value;
    } else return;
    refresh(it);
  });

  root.addEventListener("input", (e) => {
    const t = e.target;
    if (t.matches("[data-note]")) {
      state.notes[t.dataset.note] = t.value;
      persist();
      return;
    }
    if (t.matches('[data-f][type="text"]')) {
      const { f, it } = fieldById(t.dataset.f);
      state.answers[f.id] = t.value;
      refresh(it);
      return;
    }
    if (t.matches("[data-link]")) {
      const { f, it } = fieldById(t.dataset.link);
      const list = collectLinks(f.id);
      state.answers[f.id] = list;
      refresh(it);
    }
  });
  root.addEventListener("change", (e) => {
    if (e.target.matches && e.target.matches("select[data-link]")) {
      const { f, it } = fieldById(e.target.dataset.link);
      state.answers[f.id] = collectLinks(f.id);
      refresh(it);
    }
  });

  function collectLinks(fid) {
    return $$('[data-links="' + fid + '"] .link-row').map((row) => ({
      url: $('[data-k="url"]', row).value,
      tag: $('[data-k="tag"]', row).value
    }));
  }
  function rerenderLinks(f, focusLast) {
    const box = $('[data-links="' + f.id + '"]');
    const list = state.answers[f.id] && state.answers[f.id].length ? state.answers[f.id] : [{ url: "", tag: "" }];
    box.innerHTML = list.map((l, i) => linkRowHTML(f, l, i)).join("");
    if (focusLast) $$('[data-k="url"]', box).pop().focus();
  }

  root.addEventListener("click", (e) => {
    const tog = e.target.closest("[data-toggle]");
    if (tog) {
      setOpen(tog.dataset.toggle, !tog.closest(".item").classList.contains("is-open"));
      persist();
      syncExpandBtn();
      return;
    }
    const dec = e.target.closest("[data-decide]");
    if (dec) {
      const id = dec.dataset.for;
      if (state.decision[id] === dec.dataset.decide) delete state.decision[id];
      else state.decision[id] = dec.dataset.decide;
      refresh(itemById(id));
      if (state.decision[id]) toast(state.decision[id] === "ok" ? "Punto validato" : "Punto scartato");
      return;
    }
    const add = e.target.closest("[data-addlink]");
    if (add) {
      const { f } = fieldById(add.dataset.addlink);
      const list = collectLinks(f.id);
      list.push({ url: "", tag: "" });
      state.answers[f.id] = list;
      rerenderLinks(f, true);
      return;
    }
    const del = e.target.closest("[data-dellink]");
    if (del) {
      const { f, it } = fieldById(del.dataset.dellink);
      const list = collectLinks(f.id);
      list.splice(Number(del.dataset.idx), 1);
      state.answers[f.id] = list;
      rerenderLinks(f);
      refresh(it);
      return;
    }
    const tp = e.target.closest("[data-template]");
    if (tp) {
      e.preventDefault();
      openModal(tp.dataset.template, tp);
    }
  });

  /* ---------- Toolbar ---------- */
  $$("[data-filter]").forEach((b) => b.addEventListener("click", () => { filter = b.dataset.filter; applyFilter(); }));

  const anyClosed = () => $$(".item").some((el) => !el.classList.contains("is-open"));
  function syncExpandBtn() {
    const c = anyClosed();
    $("#btnExpand").innerHTML = icon(c ? "expand" : "collapse") + "<span>" + (c ? "Espandi tutto" : "Comprimi tutto") + "</span>";
  }
  $("#btnExpand").addEventListener("click", () => {
    const c = anyClosed();
    allItems().forEach((it) => setOpen(it.id, c));
    persist();
    syncExpandBtn();
  });

  $("#btnExport").addEventListener("click", () => {
    const blob = new Blob([buildMarkdown()], { type: "text/markdown;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "SOCIAL-checklist-" + new Date().toISOString().slice(0, 10) + ".md";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    toast("Riepilogo esportato");
  });

  $("#btnPrint").addEventListener("click", () => window.print());

  $("#btnReset").addEventListener("click", () => {
    if (!confirm("Vuoi azzerare tutte le risposte, gli esiti e le note? L’operazione non può essere annullata.")) return;
    state.answers = {}; state.decision = {}; state.notes = {}; state.open = {};
    storage.clear();
    render();
    toast("Checklist azzerata");
  });

  /* ---------- Export ---------- */
  function answerText(f) {
    const v = state.answers[f.id];
    const lbl = (val) => (f.options.find((o) => o.v === val) || {}).label || val;
    switch (f.type) {
      case "choice": return v ? lbl(v) : "—";
      case "multi": {
        const locked = f.options.filter((o) => o.locked).map((o) => o.label + " (già previsto)");
        const sel = (v || []).map(lbl);
        const all = locked.concat(sel);
        return all.length ? all.join(", ") : "—";
      }
      case "matrix":
        return "\n" + f.rows.map((r) => "  - " + r.label + ": " + (v && v[r.id] ? lbl(v[r.id]) : "—")).join("\n");
      case "date": return v ? new Date(v + "T00:00").toLocaleDateString("it-IT") : "—";
      case "text": return v && v.trim() ? v.trim() : "—";
      case "links": {
        const l = (v || []).filter((x) => x.url && x.url.trim());
        if (!l.length) return "—";
        return "\n" + l.map((x) => "  - " + x.url.trim() + (x.tag ? " (" + (f.tags.find((t) => t.v === x.tag) || {}).label + ")" : "")).join("\n");
      }
    }
    return "—";
  }

  function buildMarkdown() {
    const date = new Date().toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" });
    let out = "# " + DATA.project.code + " – " + DATA.project.title + "\n\n";
    out += "Checklist di progetto · Envision – Think Digital · " + date + "\n\n";
    DATA.sections.forEach((sec) => {
      out += "## " + sec.title.toUpperCase() + "\n\n";
      sec.items.forEach((it) => {
        out += "### " + it.n + ". " + it.title + " — " + STATUS[status(it)] + "\n\n";
        out += "> " + it.question + "\n\n";
        it.fields.filter(isVisible).forEach((f) => {
          out += "- **" + f.label + ":** " + answerText(f) + "\n";
        });
        const note = (state.notes[it.id] || "").trim();
        out += "\n**" + (state.decision[it.id] === "ko" ? "Motivo dello scarto" : "Note") + ":** " + (note ? note.replace(/\n/g, "  \n") : "—") + "\n\n";
      });
    });
    return out;
  }

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("is-visible"), 2000);
  }

  /* ---------- Modale template ---------- */
  const modal = $("#tplModal");
  let lastFocus = null;
  let current = null;

  $("#tplTabs").innerHTML = Object.keys(TPL).map((k) =>
    '<button type="button" role="tab" class="tab" id="tab-' + k + '" data-tab="' + k + '" aria-controls="tplView">' +
    icon(TPL[k].icon) + "<span>" + TPL[k].label + "</span></button>"
  ).join("");

  function showTemplate(key) {
    const t = TPL[key];
    if (!t) return;
    current = key;
    $$(".tab", modal).forEach((b) => {
      const on = b.dataset.tab === key;
      b.setAttribute("aria-selected", String(on));
      b.tabIndex = on ? 0 : -1;
    });
    $("#tplUrl").textContent = t.url;
    $("#tplView").innerHTML = t.render();
    $("#tplView").scrollTop = 0;
    $("#tplFields").innerHTML = t.fields.map((f) => "<li>" + icon("check") + "<span>" + esc(f) + "</span></li>").join("");
    $("#tplFieldsTitle").textContent = "Campi da fornire · " + t.label;
  }

  function openModal(key, trigger) {
    lastFocus = trigger || document.activeElement;
    showTemplate(key);
    modal.hidden = false;
    document.body.classList.add("no-scroll");
    requestAnimationFrame(() => modal.classList.add("is-open"));
    $(".modal__close", modal).focus();
  }
  function closeModal() {
    modal.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    setTimeout(() => { modal.hidden = true; }, 200);
    if (lastFocus) lastFocus.focus();
  }

  modal.addEventListener("click", (e) => {
    if (e.target.closest("[data-close]")) closeModal();
    const tab = e.target.closest("[data-tab]");
    if (tab) showTemplate(tab.dataset.tab);
  });
  $("#tplTabs").addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const keys = Object.keys(TPL);
    const i = (keys.indexOf(current) + (e.key === "ArrowRight" ? 1 : -1) + keys.length) % keys.length;
    showTemplate(keys[i]);
    $("#tab-" + keys[i]).focus();
  });
  document.addEventListener("keydown", (e) => {
    if (modal.hidden) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "Tab") {
      const f = $$('button, [href], input, textarea, [tabindex]:not([tabindex="-1"])', modal).filter((x) => !x.disabled && x.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* Stampa: apri tutto, poi ripristina */
  let openBeforePrint = null;
  window.addEventListener("beforeprint", () => {
    openBeforePrint = $$(".item").map((el) => [el, el.classList.contains("is-open")]);
    $$(".item").forEach((el) => el.classList.add("is-open"));
  });
  window.addEventListener("afterprint", () => {
    if (openBeforePrint) openBeforePrint.forEach(([el, o]) => el.classList.toggle("is-open", o));
  });

  /* ---------- Avvio ---------- */
  $("#year").textContent = new Date().getFullYear();
  render();
})();
