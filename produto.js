/* Animações dos módulos "Veja a IA trabalhando".
   O conteúdo já vem no HTML (gerado por build-produtos.mjs); aqui só damos
   movimento a ele. Sem JS a página continua completa e legível. */

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

/* Marca que o JS assumiu: só então os módulos partem do estado escondido.
   Sem JS a página continua inteira e legível. */
document.documentElement.classList.add("js-anim");

/* Roda `start` quando o bloco entra na tela e devolve um cancelador ao sair,
   para nenhuma animação ficar girando fora de vista. */
function whenVisible(element, start, fallback) {
  if (!element) return;

  if (typeof IntersectionObserver !== "function") {
    if (fallback) fallback();
    return;
  }

  let stop = null;
  /* O observer entrega um primeiro retorno logo ao observar, mesmo com o
     elemento fora da tela — é isso que confirma que ele está funcionando. */
  let reported = false;

  const observer = new IntersectionObserver(
    (entries) => {
      reported = true;
      entries.forEach((entry) => {
        if (entry.isIntersecting && !stop) {
          stop = start() || (() => {});
        } else if (!entry.isIntersecting && stop) {
          stop();
          stop = null;
        }
      });
    },
    { threshold: 0.25 }
  );
  observer.observe(element);

  /* Rede de segurança: se o observer nunca reportar nada, o conteúdo aparece
     mesmo assim. Nenhuma seção pode ficar invisível por causa da animação. */
  setTimeout(() => {
    if (!reported && fallback) fallback();
  }, 4000);
}

/* Sequência que percorre os passos e recomeça depois de uma pausa. */
function sequence(steps, { interval, hold = 1600, onStep, onReset }) {
  let index = 0;
  let timer = null;

  const tick = () => {
    if (index < steps) {
      onStep(index);
      index += 1;
      timer = setTimeout(tick, interval);
      return;
    }
    index = 0;
    timer = setTimeout(() => {
      if (onReset) onReset();
      tick();
    }, hold);
  };

  tick();
  return () => clearTimeout(timer);
}

const setOn = (element, on) => element.classList.toggle("is-on", on);

/* ---------- transcrição (Call IA) ---------- */
function initTranscript(root) {
  const lines = $$("[data-sc-step]", root);
  if (!lines.length) return;

  if (reduceMotion.matches) {
    lines.forEach((line) => setOn(line, true));
    return;
  }

  whenVisible(
    root,
    () =>
      sequence(lines.length, {
        interval: 1100,
        hold: 2600,
        onStep: (index) => setOn(lines[index], true),
        onReset: () => lines.forEach((line) => setOn(line, false))
      }),
    () => lines.forEach((line) => setOn(line, true))
  );
}

/* ---------- campanha (Call IA WhatsApp) ---------- */
function initCampaign(root) {
  const states = (root.dataset.scStates || "").split("|").filter(Boolean);
  const rows = $$(".sc-line-row", root);
  if (!states.length || !rows.length) return;

  if (reduceMotion.matches) return;

  whenVisible(root, () => {
    const timers = rows.map((row, rowIndex) => {
      const label = $("[data-sc-state]", row);
      let step = Number(row.dataset.scPhase || rowIndex % states.length);

      const advance = () => {
        step = (step + 1) % states.length;
        label.textContent = states[step];
        row.dataset.scPhase = String(step);
      };

      advance();
      return setInterval(advance, 1500 + rowIndex * 260);
    });

    return () => timers.forEach(clearInterval);
  });
}

/* ---------- score (QualiDDM) ---------- */
function initScore(root) {
  const dial = $(".sc-dial-value", root);
  const steps = $$("[data-sc-step]", root);

  if (reduceMotion.matches) {
    if (dial) dial.style.setProperty("--dash", "86");
    steps.forEach((step) => setOn(step, true));
    return;
  }

  whenVisible(
    root,
    () => {
      if (dial) dial.style.setProperty("--dash", "86");
      return sequence(steps.length, {
        interval: 420,
        hold: 3000,
        onStep: (index) => setOn(steps[index], true),
        onReset: () => steps.forEach((step) => setOn(step, false))
      });
    },
    () => {
      if (dial) dial.style.setProperty("--dash", "86");
      steps.forEach((step) => setOn(step, true));
    }
  );
}

/* ---------- galeria de formatos (Creator) ---------- */
function initGallery(root) {
  const tiles = $$("[data-sc-step]", root);
  if (!tiles.length) return;

  if (reduceMotion.matches) {
    tiles.forEach((tile) => setOn(tile, true));
    return;
  }

  whenVisible(
    root,
    () =>
      sequence(tiles.length, {
        interval: 620,
        hold: 3200,
        onStep: (index) => setOn(tiles[index], true),
        onReset: () => tiles.forEach((tile) => setOn(tile, false))
      }),
    () => tiles.forEach((tile) => setOn(tile, true))
  );
}

/* ---------- carrossel de visões (Dashboard Creator) ---------- */
function initCarousel(root) {
  const slides = $$(".sc-slide", root);
  const dots = $$(".sc-dot", root);
  if (!slides.length) return;

  let current = 0;
  let timer = null;

  const show = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, position) => slide.classList.toggle("is-active", position === current));
    dots.forEach((dot, position) => dot.classList.toggle("is-active", position === current));
  };

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      show(index);
      clearInterval(timer);
      timer = null;
    });
  });

  if (reduceMotion.matches) return;

  whenVisible(root, () => {
    timer = setInterval(() => show(current + 1), 3200);
    return () => clearInterval(timer);
  });
}

/* ---------- leads enriquecidos (Extrator) ---------- */
function initLeads(root) {
  const rows = $$("tbody tr", root);
  if (!rows.length) return;

  const cellsOf = (row) => $$(".sc-fill", row);

  if (reduceMotion.matches) {
    rows.forEach((row) => {
      setOn(row, true);
      cellsOf(row).forEach((cell) => setOn(cell, true));
    });
    return;
  }

  whenVisible(root, () => {
    const total = rows.reduce((sum, row) => sum + 1 + cellsOf(row).length, 0);

    return sequence(total, {
      interval: 220,
      hold: 2800,
      onStep: (index) => {
        let cursor = index;
        for (const row of rows) {
          const cells = cellsOf(row);
          if (cursor === 0) {
            setOn(row, true);
            return;
          }
          if (cursor <= cells.length) {
            setOn(cells[cursor - 1], true);
            return;
          }
          cursor -= cells.length + 1;
        }
      },
      onReset: () =>
        rows.forEach((row) => {
          setOn(row, false);
          cellsOf(row).forEach((cell) => setOn(cell, false));
        })
    });
  }, () =>
    rows.forEach((row) => {
      setOn(row, true);
      cellsOf(row).forEach((cell) => setOn(cell, true));
    })
  );
}

/* ---------- filas de atendimento (Omni CRM) ---------- */
function initQueue(root) {
  const columns = $$("[data-sc-column] ul", root);
  const template = $("[data-sc-tickets]", root);
  if (columns.length < 2 || !template) return;

  const source = Array.from(template.content.querySelectorAll(".sc-ticket"));
  if (!source.length) return;

  const seed = () => {
    columns.forEach((column) => (column.innerHTML = ""));
    source.forEach((ticket, index) => {
      columns[index % columns.length].appendChild(ticket.cloneNode(true));
    });
  };

  seed();
  if (reduceMotion.matches) return;

  whenVisible(root, () => {
    let queued = 0;

    const advance = () => {
      /* Do fim para o começo: resolvido → atendimento → entrada. */
      for (let index = columns.length - 1; index > 0; index -= 1) {
        const from = columns[index - 1];
        const to = columns[index];
        const ticket = from.lastElementChild;
        if (!ticket) continue;

        ticket.classList.add("is-moving");
        setTimeout(() => {
          to.prepend(ticket);
          ticket.classList.remove("is-moving");
          ticket.classList.add("is-arriving");
          setTimeout(() => ticket.classList.remove("is-arriving"), 400);
        }, 220);
      }

      const last = columns[columns.length - 1];
      while (last.children.length > 3) last.lastElementChild.remove();

      /* Repõe a entrada para a fila nunca esvaziar. */
      const incoming = source[queued % source.length].cloneNode(true);
      queued += 1;
      incoming.classList.add("is-arriving");
      columns[0].prepend(incoming);
      setTimeout(() => incoming.classList.remove("is-arriving"), 400);
      while (columns[0].children.length > 3) columns[0].lastElementChild.remove();
    };

    const timer = setInterval(advance, 2200);
    return () => clearInterval(timer);
  });
}

/* ---------- e-mail classificado (Mail IA) ---------- */
function initMail(root) {
  const stages = $$("[data-sc-step]", root);
  if (!stages.length) return;

  if (reduceMotion.matches) {
    stages.forEach((stage) => setOn(stage, true));
    return;
  }

  whenVisible(
    root,
    () =>
      sequence(stages.length, {
        interval: 1100,
        hold: 2400,
        onStep: (index) => setOn(stages[index], true),
        onReset: () => stages.forEach((stage) => setOn(stage, false))
      }),
    () => stages.forEach((stage) => setOn(stage, true))
  );
}

/* ---------- módulos do hub (DDM Labs) ---------- */
function initModules(root) {
  const items = $$("[data-sc-step]", root);
  if (!items.length) return;

  if (reduceMotion.matches) {
    items.forEach((item) => setOn(item, true));
    return;
  }

  whenVisible(
    root,
    () =>
      sequence(items.length, {
        interval: 380,
        hold: 2600,
        onStep: (index) => setOn(items[index], true),
        onReset: () => items.forEach((item) => setOn(item, false))
      }),
    () => items.forEach((item) => setOn(item, true))
  );
}

const showcaseInits = {
  transcript: initTranscript,
  negotiation: initModules,
  campaign: initCampaign,
  score: initScore,
  gallery: initGallery,
  carousel: initCarousel,
  leads: initLeads,
  queue: initQueue,
  mail: initMail,
  modules: initModules
};

const showcase = $("[data-sc]");
if (showcase) {
  const init = showcaseInits[showcase.dataset.sc];
  if (init) init(showcase);
}

/* Revela as seções conforme entram na tela. */
const revealTargets = $$(".benefit-grid article, .detail-flow span, .detail-split-body > .browser-mockup");
const canObserve = typeof IntersectionObserver === "function";
if (revealTargets.length && canObserve && !reduceMotion.matches) {
  let revealerReported = false;
  const revealer = new IntersectionObserver(
    (entries, observer) => {
      revealerReported = true;
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.2 }
  );
  revealTargets.forEach((target, index) => {
    target.style.setProperty("--reveal-delay", `${(index % 5) * 70}ms`);
    revealer.observe(target);
  });
  setTimeout(() => {
    if (revealerReported) return;
    revealTargets.forEach((target) => target.classList.add("is-revealed"));
  }, 4000);
} else {
  revealTargets.forEach((target) => target.classList.add("is-revealed"));
}
