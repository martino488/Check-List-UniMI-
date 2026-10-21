/* ==========================================================================
   Icone + template di esempio (contenuti generici / segnaposto)
   ========================================================================== */

(function () {
  const PATHS = {
    bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5 9-5z"/><path d="m3 13 9 5 9-5"/>',
    pen: '<path d="M4 20l4-1 11-11-3-3L5 16l-1 4z"/><path d="M14 6l3 3"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    download: '<path d="M12 4v11m0 0-4-4m4 4 4-4"/><path d="M5 20h14"/>',
    external: '<path d="M14 5h5v5"/><path d="M19 5 10 14"/><path d="M19 14v5H5V5h5"/>',
    file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z"/><path d="M14 3v5h5"/>',
    play: '<circle cx="12" cy="12" r="9"/><path d="m10 8.5 5 3.5-5 3.5z"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4-6"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5z"/><path d="M4 19a2 2 0 0 1 2-2h13"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    print: '<path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/>',
    reset: '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/>',
    expand: '<path d="m7 15 5 5 5-5M7 9l5-5 5 5"/>',
    collapse: '<path d="m7 20 5-5 5 5M7 4l5 5 5-5"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    note: '<path d="M4 4h16v12l-4 4H4z"/><path d="M16 20v-4h4M8 9h8M8 13h5"/>',
    radio: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3.5" fill="currentColor" stroke="none"/>',
    checks: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><path d="m5.3 7 1.3 1.3 2.4-2.6"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><path d="m5.3 17 1.3 1.3 2.4-2.6"/><path d="M14 7h7M14 17h7"/>',
    grid: '<rect x="3.5" y="4" width="17" height="16" rx="2"/><path d="M3.5 9.3h17M3.5 14.7h17M9.5 4v16"/>',
    x: '<path d="M7 7l10 10M17 7 7 17"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6.5 7l1 13h9l1-13"/>',
    text: '<path d="M4 6h16M4 12h16M4 18h10"/>'
  };

  function icon(name, cls) {
    return '<svg class="ic ' + (cls || "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (PATHS[name] || "") + "</svg>";
  }

  /* Silhouette generica al posto delle foto reali */
  function avatar(tone) {
    return (
      '<svg class="tpl-avatar" viewBox="0 0 200 200" aria-hidden="true">' +
      '<circle cx="100" cy="80" r="31" fill="' + tone + '"/>' +
      '<path d="M38 200c0-48 27-74 62-74s62 26 62 74z" fill="' + tone + '"/>' +
      "</svg>"
    );
  }

  const head = (eyebrow, title) =>
    '<p class="tpl-eyebrow">' + eyebrow + '</p><h3 class="tpl-heading">' + title + '</h3><hr class="tpl-divider">';

  /* ---------------- TEAM ---------------- */
  function team() {
    const people = [
      { tone: "#C3C6D4", role: "Coordinamento scientifico", ic: "bulb" },
      { tone: "#B5BFD8", role: "Ricerca e analisi dati", ic: "layers" },
      { tone: "#CBBFD5", role: "Comunicazione e divulgazione", ic: "pen" }
    ];
    return (
      '<div class="tpl">' +
      head("Il nostro team", "Titolo della sezione: una frase che presenta il gruppo di ricerca.") +
      '<div class="tpl-grid">' +
      people
        .map(
          (p) =>
            '<article class="tpl-card">' +
            '<div class="tpl-photo">' + avatar(p.tone) + '<span class="tpl-photo__label">Foto</span></div>' +
            '<div class="tpl-card__body"><h4>Nome Cognome</h4><p>Breve descrizione del profilo e dell’area di ricerca, in due o tre righe al massimo.</p></div>' +
            '<div class="tpl-card__foot">' + icon(p.ic) + "<span>" + p.role + "</span></div>" +
            "</article>"
        )
        .join("") +
      "</div></div>"
    );
  }

  /* ---------------- PUBBLICAZIONI ---------------- */
  function publication() {
    const rows = [
      { y: "2026", type: "Articolo in rivista", lang: "EN" },
      { y: "2025", type: "Capitolo di libro", lang: "IT" },
      { y: "2025", type: "Report di ricerca", lang: "EN" }
    ];
    return (
      '<div class="tpl">' +
      head("Pubblicazioni", "Le pubblicazioni scientifiche del progetto, consultabili per anno e tipologia.") +
      '<div class="tpl-filters">' +
      '<div class="tpl-search">' + icon("search") + "<span>Cerca per titolo, autore o parola chiave</span></div>" +
      '<div class="tpl-select">Anno ' + icon("chevron") + "</div>" +
      '<div class="tpl-chips"><span class="is-active">Tutte</span><span>Articoli</span><span>Capitoli</span><span>Report</span></div>' +
      "</div>" +
      '<div class="tpl-list">' +
      rows
        .map(
          (r) =>
            '<article class="tpl-pub">' +
            '<div class="tpl-pub__year">' + r.y + "</div>" +
            '<div class="tpl-pub__main">' +
            '<div class="tpl-tags"><span class="tpl-tag">' + r.type + '</span><span class="tpl-tag tpl-tag--lang">' + r.lang + "</span></div>" +
            "<h4>Titolo della pubblicazione scientifica, che può occupare una o due righe</h4>" +
            '<p class="tpl-pub__authors">Cognome N., Cognome N., Cognome N.</p>' +
            '<p class="tpl-pub__source">Nome della rivista o editore, Vol. 00, n. 0, pp. 00–00</p>' +
            "</div>" +
            '<div class="tpl-pub__actions"><span class="tpl-btn">DOI ' + icon("external") + '</span><span class="tpl-btn">PDF ' + icon("download") + "</span></div>" +
            "</article>"
        )
        .join("") +
      "</div></div>"
    );
  }

  /* ---------------- EVENTI ---------------- */
  function event() {
    const ev = [
      { d: "14", m: "Nov", type: "Convegno", place: "Sede o città dell’evento", time: "09:30 – 13:00" },
      { d: "02", m: "Dic", type: "Seminario", place: "Online – piattaforma", time: "15:00 – 16:30" },
      { d: "20", m: "Gen", type: "Workshop", place: "Aula / Dipartimento", time: "10:00 – 17:00" }
    ];
    return (
      '<div class="tpl">' +
      head("Eventi", "Convegni, seminari e incontri pubblici legati alle attività del progetto.") +
      '<div class="tpl-grid">' +
      ev
        .map(
          (e) =>
            '<article class="tpl-card tpl-event">' +
            '<div class="tpl-event__top"><div class="tpl-date"><strong>' + e.d + "</strong><span>" + e.m + '</span></div><span class="tpl-tag">' + e.type + "</span></div>" +
            '<div class="tpl-card__body"><h4>Titolo dell’evento</h4><p>Breve descrizione dei temi trattati e del pubblico a cui si rivolge.</p>' +
            '<ul class="tpl-meta"><li>' + icon("pin") + e.place + "</li><li>" + icon("clock") + e.time + "</li></ul></div>" +
            '<div class="tpl-card__foot tpl-card__foot--link"><span>Dettagli e iscrizione</span>' + icon("arrow") + "</div>" +
            "</article>"
        )
        .join("") +
      "</div></div>"
    );
  }

  /* ---------------- RISORSE ---------------- */
  function resource() {
    const res = [
      { kind: "PDF", ic: "file", meta: "PDF · 2,4 MB · IT", cta: "Scarica", cic: "download" },
      { kind: "Video", ic: "play", meta: "Video · 12 min · EN", cta: "Guarda", cic: "play" },
      { kind: "Link", ic: "link", meta: "Sito esterno · EN", cta: "Apri", cic: "external" }
    ];
    return (
      '<div class="tpl">' +
      head("Risorse", "Materiali, strumenti e documenti messi a disposizione dal progetto.") +
      '<div class="tpl-grid">' +
      res
        .map(
          (r) =>
            '<article class="tpl-card tpl-res">' +
            '<div class="tpl-card__body"><div class="tpl-res__icon">' + icon(r.ic) + "</div>" +
            '<span class="tpl-tag">' + r.kind + "</span><h4>Titolo della risorsa</h4><p>Descrizione sintetica del contenuto e del suo utilizzo.</p>" +
            '<p class="tpl-res__meta">' + r.meta + "</p></div>" +
            '<div class="tpl-card__foot tpl-card__foot--link"><span>' + r.cta + "</span>" + icon(r.cic) + "</div>" +
            "</article>"
        )
        .join("") +
      "</div></div>"
    );
  }

  window.SOCIAL_ICON = icon;

  window.SOCIAL_TEMPLATES = {
    team: {
      label: "Membro del team",
      icon: "users",
      url: "www.nome-progetto.it/team",
      render: team,
      fields: [
        "Nome e cognome",
        "Foto (formato verticale, sfondo chiaro)",
        "Ruolo nel progetto",
        "Breve biografia (2–3 righe)",
        "Ente / affiliazione",
        "Contatti e profili (email, ORCID, Google Scholar)",
        "Pubblicazioni e progetti collegati (facoltativo)"
      ]
    },
    publication: {
      label: "Pubblicazione",
      icon: "book",
      url: "www.nome-progetto.it/pubblicazioni",
      render: publication,
      fields: [
        "Titolo",
        "Autori",
        "Anno",
        "Tipologia (articolo, capitolo, report…)",
        "Rivista / editore, volume, pagine",
        "Abstract",
        "DOI o link esterno",
        "PDF (se disponibile)",
        "Lingua"
      ]
    },
    event: {
      label: "Evento",
      icon: "calendar",
      url: "www.nome-progetto.it/eventi",
      render: event,
      fields: [
        "Titolo",
        "Tipologia (convegno, seminario, workshop…)",
        "Data e orario",
        "Luogo o modalità online",
        "Descrizione",
        "Relatori",
        "Link di iscrizione",
        "Materiali post-evento (slide, video)"
      ]
    },
    resource: {
      label: "Risorsa",
      icon: "file",
      url: "www.nome-progetto.it/risorse",
      render: resource,
      fields: [
        "Titolo",
        "Tipologia (documento, video, dataset, link)",
        "Descrizione breve",
        "File o URL",
        "Formato e dimensione",
        "Lingua",
        "Data di pubblicazione"
      ]
    }
  };
})();
