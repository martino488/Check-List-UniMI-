/* ==========================================================================
   SOCIAL – Checklist di progetto · contenuti
   --------------------------------------------------------------------------
   Ogni punto ("item") ha un esito finale: Da definire / Validato / Scartato.
   Dentro ogni punto i "fields" usano il tipo di risposta più adatto:

   choice  → scelta singola (una sola opzione valida)
   multi   → più risposte possibili (es. 3 su 4); "locked" = già incluso,
             "none" = opzione esclusiva tipo "nessuno"
   matrix  → una risposta per ogni riga (es. per Team, Pubblicazioni, Eventi)
   date    → data
   text    → testo libero
   links   → elenco di link di riferimento (aggiungibili)

   optional: true  → non conta nel completamento
   showIf(a)       → il campo compare solo se la condizione è vera
                     (a = tutte le risposte date)
   template        → collega la riga/opzione all'anteprima grafica
   ========================================================================== */

window.SOCIAL_DATA = {
  project: {
    code: "SOCIAL",
    title: "Social relations, digital technologies and wellbeing of older people",
    storageKey: "envision-social-checklist-v2"
  },

  sections: [
    /* ------------------------------------------------------------------ */
    {
      id: "contenuti",
      title: "Contenuti e organizzazione delle sezioni",
      items: [
        {
          n: 1,
          id: "materiale",
          title: "Materiale di esempio",
          question:
            "Sarebbe possibile ricevere alcuni contenuti di esempio, anche provvisori, relativi alle principali sezioni del sito (ad esempio una pubblicazione scientifica, un evento, un membro del team e una risorsa)? Ci aiuterebbero a comprendere meglio la tipologia di informazioni da gestire e a strutturare correttamente le diverse sezioni.",
          template: true,
          fields: [
            {
              id: "m-status",
              type: "matrix",
              label: "Stato del materiale per ciascuna sezione",
              help: "Per ogni contenuto indica a che punto è: una sezione può anche non servire.",
              options: [
                { v: "richiedere", label: "Da richiedere" },
                { v: "attesa", label: "In attesa" },
                { v: "ricevuto", label: "Ricevuto" },
                { v: "no", label: "Non necessario", muted: true }
              ],
              rows: [
                { id: "pub", label: "Pubblicazione scientifica", template: "publication" },
                { id: "event", label: "Evento", template: "event" },
                { id: "team", label: "Membro del team", template: "team" },
                { id: "res", label: "Risorsa", template: "resource" }
              ]
            },
            {
              id: "m-date",
              type: "date",
              label: "Data prevista di invio",
              optional: true,
              showIf: (a) => a["m-status"] && Object.values(a["m-status"]).some((v) => v === "richiedere" || v === "attesa")
            }
          ]
        },
        {
          n: 2,
          id: "dettaglio",
          title: "Pagine di dettaglio",
          question:
            "Per le sezioni dedicate al team, alle pubblicazioni e agli eventi, è prevista una pagina di dettaglio per ciascun elemento oppure è sufficiente presentarli all'interno di un elenco?",
          fields: [
            {
              id: "d-mode",
              type: "matrix",
              label: "Come presentare ogni elemento",
              help: "La scelta può essere diversa per ogni sezione.",
              options: [
                { v: "dettaglio", label: "Pagina di dettaglio" },
                { v: "espandibile", label: "Elenco espandibile" },
                { v: "elenco", label: "Solo elenco" }
              ],
              rows: [
                { id: "team", label: "Team" },
                { id: "pub", label: "Pubblicazioni" },
                { id: "event", label: "Eventi" }
              ],
              legend: "“Elenco espandibile”: i dettagli si aprono nella stessa pagina, senza una pagina dedicata."
            }
          ]
        },
        {
          n: 3,
          id: "collegamenti",
          title: "Collegamenti tra i contenuti",
          question:
            "È necessario prevedere collegamenti tra le diverse sezioni del sito? Ad esempio, nella pagina dedicata a un membro del team potrebbe essere utile mostrare anche le sue pubblicazioni scientifiche e i progetti di ricerca a cui partecipa.",
          fields: [
            {
              id: "c-need",
              type: "choice",
              layout: "inline",
              label: "Servono collegamenti tra le sezioni?",
              options: [
                { v: "si", label: "Sì" },
                { v: "no", label: "No, sezioni indipendenti" }
              ]
            },
            {
              id: "c-links",
              type: "multi",
              label: "Quali collegamenti prevedere",
              showIf: (a) => a["c-need"] === "si",
              options: [
                { v: "team-pub", label: "Membro del team → sue pubblicazioni" },
                { v: "team-proj", label: "Membro del team → progetti di ricerca" },
                { v: "event-team", label: "Evento → relatori del team" },
                { v: "pub-res", label: "Pubblicazione → risorse correlate" },
                { v: "proj-all", label: "Progetto → pubblicazioni ed eventi collegati" }
              ]
            },
            {
              id: "c-other",
              type: "text",
              label: "Altri collegamenti",
              placeholder: "Es. news → progetto di riferimento",
              optional: true,
              showIf: (a) => a["c-need"] === "si"
            }
          ]
        },
        {
          n: 4,
          id: "ricerca",
          title: "Ricerca e filtri",
          question:
            "Per la sezione delle pubblicazioni, oltre ai filtri per anno e tipologia, ritiene utile prevedere ulteriori criteri di selezione o una barra di ricerca per facilitare la consultazione dei contenuti?",
          fields: [
            {
              id: "r-filters",
              type: "multi",
              label: "Filtri per le pubblicazioni",
              help: "Anno e tipologia sono già previsti: scegli quali aggiungere.",
              options: [
                { v: "anno", label: "Anno", locked: true },
                { v: "tipo", label: "Tipologia", locked: true },
                { v: "autore", label: "Autore" },
                { v: "progetto", label: "Progetto di ricerca" },
                { v: "tema", label: "Tema / parola chiave" },
                { v: "lingua", label: "Lingua" },
                { v: "__none", label: "Bastano anno e tipologia", none: true }
              ]
            },
            {
              id: "r-search",
              type: "choice",
              label: "Barra di ricerca testuale",
              options: [
                { v: "pub", label: "Sì, nelle pubblicazioni", desc: "Ricerca per titolo, autore o parola chiave" },
                { v: "sito", label: "Sì, su tutto il sito", desc: "Un'unica ricerca su pagine, news, eventi e pubblicazioni" },
                { v: "no", label: "Non necessaria", desc: "I filtri sono sufficienti" }
              ]
            }
          ]
        }
      ]
    },

    /* ------------------------------------------------------------------ */
    {
      id: "lingue",
      title: "Gestione delle lingue",
      items: [
        {
          n: 5,
          id: "multilingua",
          title: "Contenuti multilingua",
          question:
            "Nella versione italiana della homepage dovranno essere visualizzate anche le news e le pubblicazioni disponibili esclusivamente in lingua inglese, oppure preferisce mantenere separati i contenuti in base alla lingua?",
          fields: [
            {
              id: "l-mode",
              type: "matrix",
              label: "Contenuti disponibili solo in inglese",
              help: "News e pubblicazioni possono seguire regole diverse.",
              options: [
                { v: "entrambe", label: "Visibili anche nella homepage IT" },
                { v: "separate", label: "Solo nella versione EN" }
              ],
              rows: [
                { id: "news", label: "News" },
                { id: "pub", label: "Pubblicazioni" }
              ]
            },
            {
              id: "l-badge",
              type: "choice",
              layout: "inline",
              label: "Indicare la lingua accanto ai contenuti in inglese?",
              showIf: (a) => a["l-mode"] && Object.values(a["l-mode"]).includes("entrambe"),
              options: [
                { v: "si", label: "Sì, con un'etichetta “EN”" },
                { v: "no", label: "No" }
              ]
            }
          ]
        }
      ]
    },

    /* ------------------------------------------------------------------ */
    {
      id: "gestione",
      title: "Gestione e aggiornamento del sito",
      items: [
        {
          n: 6,
          id: "autonomia",
          title: "Autonomia nella creazione delle pagine",
          question:
            "Desidera che gli amministratori del sito possano creare nuove pagine in completa autonomia, definendone liberamente struttura e impaginazione, oppure preferisce utilizzare modelli predefiniti, che garantiscano uniformità grafica e facilitino l'inserimento e l'aggiornamento delle informazioni? Dal documento ricevuto sembrerebbe prevista la prima possibilità, ma vorremmo avere una conferma.",
          fields: [
            {
              id: "a-mode",
              type: "choice",
              label: "Modalità di creazione delle pagine",
              options: [
                { v: "libera", label: "Creazione libera", desc: "Gli amministratori definiscono struttura e impaginazione di ogni nuova pagina. Massima flessibilità.", badge: "Indicata nel documento" },
                { v: "modelli", label: "Modelli predefiniti", desc: "Si parte da layout pronti e si inseriscono solo i contenuti. Grafica sempre uniforme." },
                { v: "ibrida", label: "Soluzione ibrida", desc: "Modelli per le sezioni strutturate (team, pubblicazioni, eventi) e blocchi componibili per le pagine libere." }
              ]
            },
            {
              id: "a-roles",
              type: "multi",
              label: "Profili di accesso necessari",
              optional: true,
              options: [
                { v: "admin", label: "Amministratore", desc: "Gestione completa" },
                { v: "editor", label: "Redattore", desc: "Crea e pubblica contenuti" },
                { v: "author", label: "Autore", desc: "Contenuti soggetti ad approvazione" }
              ]
            }
          ]
        }
      ]
    },

    /* ------------------------------------------------------------------ */
    {
      id: "grafica",
      title: "Grafica e identità visiva",
      items: [
        {
          n: 7,
          id: "indicazioni",
          title: "Indicazioni grafiche",
          question:
            "Sono già presenti linee guida, preferenze stilistiche o elementi di identità visiva da rispettare nella progettazione del sito?",
          fields: [
            {
              id: "g-exists",
              type: "choice",
              layout: "inline",
              label: "Esistono già indicazioni di identità visiva?",
              options: [
                { v: "complete", label: "Sì, linee guida complete" },
                { v: "parziali", label: "Solo alcuni elementi" },
                { v: "no", label: "No, nessuna" }
              ]
            },
            {
              id: "g-assets",
              type: "multi",
              label: "Materiali disponibili",
              showIf: (a) => a["g-exists"] === "complete" || a["g-exists"] === "parziali",
              options: [
                { v: "manuale", label: "Manuale di identità visiva" },
                { v: "logo", label: "Logo in formato vettoriale" },
                { v: "palette", label: "Palette colori" },
                { v: "font", label: "Font / tipografia" },
                { v: "foto", label: "Fotografie e immagini" },
                { v: "altri", label: "Materiali esistenti (presentazioni, documenti)" }
              ]
            },
            {
              id: "g-access",
              type: "choice",
              label: "Requisiti di accessibilità",
              help: "Particolarmente rilevante per un progetto rivolto a persone anziane.",
              options: [
                { v: "wcag", label: "WCAG 2.1 livello AA", desc: "Testi ingrandibili, contrasti elevati, navigazione da tastiera.", badge: "Consigliato" },
                { v: "ente", label: "Requisiti specifici dell'ente", desc: "Es. linee guida AgID per enti pubblici e università." },
                { v: "base", label: "Buone pratiche di base", desc: "Senza un livello di conformità formale." }
              ]
            }
          ]
        },
        {
          n: 8,
          id: "riferimenti",
          title: "Riferimenti e ispirazioni",
          question:
            "Ci sono siti web, progetti accademici o realtà di ricerca che considera validi riferimenti dal punto di vista grafico e funzionale? In alternativa, possiamo proporre noi una direzione stilistica coerente con gli obiettivi e i contenuti del progetto?",
          fields: [
            {
              id: "i-who",
              type: "choice",
              label: "Da dove partiamo",
              options: [
                { v: "cliente", label: "Riferimenti del cliente", desc: "Il cliente indica siti o progetti da cui partire." },
                { v: "envision", label: "Proposta di Envision", desc: "Proponiamo noi una direzione stilistica." },
                { v: "entrambi", label: "Entrambi", desc: "Riferimenti del cliente come base per la nostra proposta." }
              ]
            },
            {
              id: "i-links",
              type: "links",
              label: "Siti e progetti di riferimento",
              showIf: (a) => a["i-who"] === "cliente" || a["i-who"] === "entrambi",
              tags: [
                { v: "grafico", label: "Grafico" },
                { v: "funzionale", label: "Funzionale" },
                { v: "entrambi", label: "Grafico e funzionale" }
              ]
            }
          ]
        }
      ]
    }
  ]
};
