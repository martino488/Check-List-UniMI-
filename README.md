# SOCIAL – Checklist di progetto

Checklist interattiva delle domande di progetto per **SOCIAL – Social relations, digital technologies and wellbeing of older people**, a cura di Envision – Think Digital.

Sito statico (HTML/CSS/JS, nessuna build): 8 punti in 4 aree. Ogni punto raccoglie le risposte del cliente con il tipo di controllo più adatto e si chiude con un esito: **Validato** oppure **Scartato**. Risposte, esiti e note vengono salvati nel browser (localStorage).

Tipi di risposta (`js/data.js`):

| tipo | uso |
|---|---|
| `choice` | scelta singola tra alternative (es. modalità di creazione delle pagine) |
| `multi` | più risposte possibili (es. 3 filtri su 4); `locked` = già incluso, `none` = opzione esclusiva |
| `matrix` | una risposta per ogni riga (es. dettaglio/elenco per Team, Pubblicazioni, Eventi) |
| `date`, `text` | data o testo libero |
| `links` | elenco di link di riferimento, aggiungibili |

`showIf` mostra un campo solo quando serve (es. "Quali collegamenti" compare solo se si risponde Sì); `optional` lo esclude dal conteggio.

## Struttura

```
index.html          pagina
css/style.css       stili
js/data.js          contenuti della checklist (sezioni, punti, mini checkbox)
js/templates.js     icone + template di esempio (team, pubblicazione, evento, risorsa)
js/app.js           logica (spunte, filtri, note, export, anteprima)
assets/             logo Envision e favicon
netlify.toml        configurazione Netlify
```

## Modificare i contenuti

Tutti i testi e i tipi di risposta sono in `js/data.js`. Per collegare una riga di una `matrix` all'anteprima grafica aggiungi `template: "team" | "publication" | "event" | "resource"`; per mostrare il riquadro "Anteprima template" in un punto aggiungi `template: true`.

## Pubblicazione

**GitHub + Netlify**
```bash
git init && git add . && git commit -m "SOCIAL checklist"
git branch -M main
git remote add origin git@github.com:<account>/social-checklist.git
git push -u origin main
```
Su Netlify: *Add new site → Import an existing project → GitHub*, scegli il repository. Build command vuoto, publish directory `.`.

**Netlify Drop (senza GitHub)**: trascina la cartella su https://app.netlify.com/drop.

## In locale

Apri `index.html` nel browser, oppure `npx serve .`
