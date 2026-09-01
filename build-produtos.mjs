/* Gera uma página estática por produto a partir de produtos.data.js.
 *
 *   node build-produtos.mjs
 *
 * Cada produto vira produto-<slug>.html com o conteúdo já no HTML — sem isso,
 * crawlers, prévias de link e leitores sem JS veem sempre o mesmo produto.
 * Rode este script sempre que editar produtos.data.js.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const dataSource = readFileSync(join(here, "produtos.data.js"), "utf8");
const sandbox = {};
new Function("globalThis", "module", `${dataSource}`).call(sandbox, sandbox, undefined);
const { DDM_PRODUCTS: products, DDM_PRODUCT_ORDER: order } = sandbox;

const ASSET_VERSION = "20260901m";

const esc = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const contactUrl = (product) =>
  `./index.html?interest=${encodeURIComponent(product.interest)}#contato`;

/* ---------- módulos "Veja a IA trabalhando" ---------- */

const waveBars = (count) => Array.from({ length: count }, () => "<i></i>").join("");

const showcaseBuilders = {
  transcript(showcase) {
    const lines = showcase.lines
      .map(
        ([role, text], index) => `
            <div class="sc-line sc-line--${role}" data-sc-step="${index}">
              <span>${role === "ai" ? "DDM AI" : "Cliente"}</span>
              <p>${esc(text)}</p>
            </div>`
      )
      .join("");

    const panel = showcase.panel
      .map(([term, value]) => `<div><dt>${esc(term)}</dt><dd>${esc(value)}</dd></div>`)
      .join("\n              ");

    return `
        <div class="sc sc--transcript" data-sc="transcript">
          <div class="sc-transcript">${lines}
          </div>
          <aside class="sc-side">
            <h3>Estado da chamada</h3>
            <dl class="sc-readout">
              ${panel}
            </dl>
            <div class="sc-wave" aria-hidden="true">${waveBars(16)}</div>
          </aside>
        </div>`;
  },

  campaign(showcase) {
    const states = showcase.states;
    const rows = showcase.lines
      .map(
        (label, index) => `
            <li class="sc-line-row" data-sc-step="${index}" data-sc-phase="${index % states.length}">
              <b>${esc(label)}</b>
              <span class="sc-state" data-sc-state>${esc(states[index % states.length])}</span>
              <i class="sc-progress"><em></em></i>
            </li>`
      )
      .join("");

    return `
        <div class="sc sc--campaign" data-sc="campaign" data-sc-states="${esc(states.join("|"))}">
          <ul class="sc-lines">${rows}
          </ul>
          <p class="sc-legend">${states.map((state) => `<span>${esc(state)}</span>`).join("")}</p>
        </div>`;
  },

  score(showcase) {
    const criteria = showcase.criteria
      .map(
        ([label, status], index) => `
              <li class="sc-criterion sc-criterion--${status}" data-sc-step="${index}">
                <span>${esc(label)}</span>
                <b>${status === "ok" ? "Aderente" : "Atenção"}</b>
              </li>`
      )
      .join("");

    const snippets = showcase.snippets
      .map(
        (text, index) => `
              <li data-sc-step="${index}">${esc(text)}</li>`
      )
      .join("");

    return `
        <div class="sc sc--score" data-sc="score">
          <div class="sc-dial">
            <svg viewBox="0 0 120 120" aria-hidden="true">
              <circle class="sc-dial-track" cx="60" cy="60" r="52"></circle>
              <circle class="sc-dial-value" cx="60" cy="60" r="52" pathLength="100"></circle>
            </svg>
            <b>86</b>
            <span>Score da conversa</span>
          </div>
          <div class="sc-score-body">
            <div class="sc-wave sc-wave--wide" aria-hidden="true">${waveBars(28)}</div>
            <ul class="sc-criteria">${criteria}
            </ul>
            <h3>Trechos que sustentam a nota</h3>
            <ul class="sc-snippets">${snippets}
            </ul>
          </div>
        </div>`;
  },

  gallery(showcase) {
    const tiles = showcase.formats
      .map(
        ([name, size], index) => `
            <figure class="sc-tile" data-sc-step="${index}">
              <div class="sc-tile-art sc-tile-art--${index + 1}" aria-hidden="true"></div>
              <figcaption><b>${esc(name)}</b><span>${esc(size)}</span></figcaption>
            </figure>`
      )
      .join("");

    return `
        <div class="sc sc--gallery" data-sc="gallery">
          <p class="sc-prompt"><span>BRIEFING</span>${esc(showcase.prompt)}</p>
          <div class="sc-tiles">${tiles}
          </div>
        </div>`;
  },

  carousel(showcase) {
    const slides = showcase.views
      .map(
        ([name, text, art], index) => `
            <article class="sc-slide${index === 0 ? " is-active" : ""}" data-sc-step="${index}">
              <div class="sc-art sc-art--${art}" aria-hidden="true">
                <i></i><i></i><i></i><i></i>
              </div>
              <b>${esc(name)}</b>
              <span>${esc(text)}</span>
            </article>`
      )
      .join("");

    const dots = showcase.views
      .map(
        (view, index) =>
          `<button type="button" class="sc-dot${index === 0 ? " is-active" : ""}" data-sc-dot="${index}" aria-label="Ver ${esc(view[0])}"></button>`
      )
      .join("");

    return `
        <div class="sc sc--carousel" data-sc="carousel">
          <div class="sc-slides">${slides}
          </div>
          <div class="sc-dots">${dots}</div>
        </div>`;
  },

  leads(showcase) {
    const head = showcase.columns.map((column) => `<th>${esc(column)}</th>`).join("");
    const rows = showcase.rows
      .map(
        (row, rowIndex) => `
              <tr data-sc-step="${rowIndex}">
                ${row
                  .map(
                    (cell, cellIndex) =>
                      `<td${cellIndex === 0 ? "" : ' class="sc-fill"'}>${esc(cell)}</td>`
                  )
                  .join("")}
              </tr>`
      )
      .join("");

    return `
        <div class="sc sc--leads" data-sc="leads">
          <table class="sc-table">
            <thead><tr>${head}</tr></thead>
            <tbody>${rows}
            </tbody>
          </table>
        </div>`;
  },

  queue(showcase) {
    const columns = showcase.columns
      .map(
        (column, index) => `
            <section class="sc-column" data-sc-column="${index}">
              <header>${esc(column)}</header>
              <ul></ul>
            </section>`
      )
      .join("");

    const tickets = showcase.tickets
      .map(
        ([name, subject]) =>
          `<li class="sc-ticket" data-name="${esc(name)}" data-subject="${esc(subject)}"><b>${esc(name)}</b><span>${esc(subject)}</span></li>`
      )
      .join("\n            ");

    return `
        <div class="sc sc--queue" data-sc="queue">
          <div class="sc-columns">${columns}
          </div>
          <template data-sc-tickets>
            ${tickets}
          </template>
          <noscript>
            <ul class="sc-ticket-list">${tickets}</ul>
          </noscript>
        </div>`;
  },

  mail(showcase) {
    const classification = showcase.classification
      .map(([term, value]) => `<div><dt>${esc(term)}</dt><dd>${esc(value)}</dd></div>`)
      .join("\n                ");

    return `
        <div class="sc sc--mail" data-sc="mail">
          <article class="sc-stage" data-sc-step="0">
            <span class="sc-stage-tag">E-mail recebido</span>
            <b>${esc(showcase.email.subject)}</b>
            <small>${esc(showcase.email.from)}</small>
            <p>${esc(showcase.email.body)}</p>
          </article>
          <i class="sc-arrow" aria-hidden="true">→</i>
          <article class="sc-stage" data-sc-step="1">
            <span class="sc-stage-tag">Classificação</span>
            <dl class="sc-readout">
                ${classification}
            </dl>
          </article>
          <i class="sc-arrow" aria-hidden="true">→</i>
          <article class="sc-stage sc-stage--reply" data-sc-step="2">
            <span class="sc-stage-tag">Resposta sugerida</span>
            <p>${esc(showcase.reply)}</p>
          </article>
        </div>`;
  },

  negotiation(showcase) {
    const steps = showcase.steps
      .map(
        ([number, title, text], index) => `
            <li class="sc-step" data-sc-step="${index}">
              <b>${esc(number)}</b>
              <div>
                <strong>${esc(title)}</strong>
                <span>${esc(text)}</span>
              </div>
            </li>`
      )
      .join("");

    const readout = showcase.readout
      .map(([term, value]) => `<div><dt>${esc(term)}</dt><dd>${esc(value)}</dd></div>`)
      .join("\n              ");

    return `
        <div class="sc sc--negotiation" data-sc="negotiation">
          <ol class="sc-steps">${steps}
          </ol>
          <aside class="sc-side">
            <h3>Desfecho da chamada</h3>
            <dl class="sc-readout">
              ${readout}
            </dl>
            <div class="sc-wave" aria-hidden="true">${waveBars(16)}</div>
          </aside>
        </div>`;
  },

  modules(showcase) {
    const items = showcase.modules
      .map(
        ([name, text], index) => `
            <li data-sc-step="${index}">
              <b>${esc(name)}</b>
              <span>${esc(text)}</span>
            </li>`
      )
      .join("");

    return `
        <div class="sc sc--modules" data-sc="modules">
          <ul class="sc-modules">${items}
          </ul>
        </div>`;
  }
};

function renderShowcase(product) {
  const build = showcaseBuilders[product.showcase.type];
  if (!build) throw new Error(`Showcase sem builder: ${product.showcase.type}`);
  return build(product.showcase, product);
}

/* ---------- página ---------- */

function page(product) {
  const solves = product.solves
    .map(
      ([number, title, text]) => `
            <article>
              <span>${esc(number)}</span>
              <h3>${esc(title)}</h3>
              <p>${esc(text)}</p>
            </article>`
    )
    .join("");

  const flow = product.flow
    .map(
      (step, index) =>
        `<span>${esc(step)}</span>${index < product.flow.length - 1 ? '<i class="flow-link" aria-hidden="true"></i>' : ""}`
    )
    .join("\n            ");

  const captions = product.panelCaptions
    .map((caption) => `<li>${esc(caption)}</li>`)
    .join("\n              ");

  const url = contactUrl(product);

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#0e0e10">
  <title>${esc(product.title)} | Grupo DDM</title>
  <meta name="description" content="${esc(product.metaDescription)}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(product.title)} | Grupo DDM">
  <meta property="og:description" content="${esc(product.metaDescription)}">
  <meta property="og:image" content="${esc(product.cover || product.image)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="./styles.css?v=${ASSET_VERSION}">
</head>
<body class="product-detail-page" data-produto="${esc(product.slug)}">
  <div class="cursor-glow" aria-hidden="true"></div>

  <header class="site-header">
    <a class="brand" href="./index.html#top" aria-label="Grupo DDM">
      <img src="./assets/logo-ddm.png" alt="Grupo DDM">
    </a>
    <nav aria-label="Navegação principal">
      <a href="./index.html#lab">Nossos agentes</a>
      <a href="./index.html#produtos">Produtos</a>
      <a href="./index.html#contato">Contato</a>
    </nav>
    <a class="header-cta" href="./index.html#contato">Falar com especialista</a>
  </header>

  <main>
    <section class="product-hero" data-dark>
      <a class="back-link" href="./index.html#produtos">← Voltar ao ecossistema</a>

      <div class="product-hero-grid">
        <div class="product-copy">
          <span class="product-tag">${esc(product.tag)}</span>
          <h1>${esc(product.title)}</h1>
          <p class="product-headline">${esc(product.headline[0])}<br>${esc(product.headline[1])}</p>
          <p class="product-lead">${esc(product.lead)}</p>
          <div class="detail-actions">
            <a class="button primary" href="${esc(product.primaryCta.href)}">${esc(product.primaryCta.label)} ↗</a>
            <a class="button secondary" href="${esc(url)}">Falar com especialista</a>
          </div>
        </div>

        <div class="detail-showcase" data-parallax="-24" data-tilt="6">
          <div class="product-glow"></div>
          <div class="browser-mockup">
            <div class="browser-top">
              <i></i><i></i><i></i>
              <span>${esc(product.title)}</span>
            </div>
            <img src="${esc(product.image)}" alt="Interface do ${esc(product.title)}">
          </div>
          <div class="hero-wave" aria-hidden="true">${waveBars(34)}</div>
        </div>
      </div>
    </section>

    <section class="detail-band detail-band--light" id="recursos">
      <div class="detail-inner detail-split">
        <div class="detail-split-head">
          <span>O QUE ELE RESOLVE</span>
          <h2>${esc(product.solvesTitle)}</h2>
        </div>
        <div class="detail-split-body benefit-grid benefit-grid--stack">${solves}
        </div>
      </div>
    </section>

    <section class="detail-band detail-band--dark detail-showcase-section" id="demonstracao" data-dark>
      <div class="detail-inner">
        <div class="detail-section-head">
          <span>${esc(product.showcase.kicker)}</span>
          <h2>${esc(product.showcase.title)}</h2>
        </div>
${renderShowcase(product)}
        <p class="sc-note">${esc(product.showcase.note)}</p>
      </div>
    </section>

    <section class="detail-band detail-band--light detail-flow-section">
      <div class="detail-inner">
        <div class="detail-section-head">
          <span>COMO FUNCIONA</span>
          <h2>Como o ${esc(product.title)} entra na rotina.</h2>
        </div>
        <div class="detail-flow">
            ${flow}
        </div>
      </div>
    </section>

    <section class="detail-band detail-band--dark detail-panel-section" data-dark>
      <div class="detail-inner detail-split detail-split--wide">
        <div class="detail-split-head">
          <span>PAINEL DA OPERAÇÃO</span>
          <h2>${esc(product.panelTitle)}</h2>
          <p>${esc(product.panelText)}</p>
          <ul class="detail-panel-list">
              ${captions}
          </ul>
        </div>
        <div class="detail-split-body">
          <div class="browser-mockup browser-mockup--wide">
            <div class="browser-top">
              <i></i><i></i><i></i>
              <span>${esc(product.title)}</span>
            </div>
            <div class="browser-viewport" data-inner-scroll>
              <img src="${esc(product.image)}" alt="Painel do ${esc(product.title)}" loading="lazy">
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="detail-final" data-dark>
      <div class="detail-final-inner">
        <span>${esc(product.fit)}</span>
        <h2>${esc(product.ctaTitle)}</h2>
        <div class="detail-final-actions">
          <a class="button primary" href="${esc(url)}">Falar com especialista ↗</a>
          <a class="button secondary" href="./index.html#produtos">Ver todos os produtos</a>
        </div>
      </div>
    </section>
  </main>

  <footer>
    <img class="footer-logo" src="./assets/logo-ddm.png" alt="Grupo DDM">
    <p>DDM AI Hub - produtos de IA, automação e inteligência operacional.</p>
  </footer>

  <script src="./interactions.js?v=${ASSET_VERSION}"></script>
  <script src="./produto.js?v=${ASSET_VERSION}"></script>
</body>
</html>
`;
}

let written = 0;
for (const slug of order) {
  const product = products[slug];
  if (!product) throw new Error(`Produto ausente em produtos.data.js: ${slug}`);
  writeFileSync(join(here, `produto-${slug}.html`), page(product), "utf8");
  written += 1;
}
console.log(`${written} páginas geradas.`);
