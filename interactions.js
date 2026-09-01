/* Camada de interação compartilhada entre a home e as páginas de produto:
   parallax, inclinação 3D, brilho do cursor e contadores.
   Tudo é progressivo — sem JS, ou com "reduzir movimento", a página fica
   parada e completa. */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(pointer: fine)");
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  /* ---------------------------------------------------------
     Parallax: desloca o elemento conforme ele cruza a viewport.
     --parallax-speed controla a intensidade (px no percurso todo).
     --------------------------------------------------------- */
  const parallaxItems = Array.from(document.querySelectorAll("[data-parallax]"));
  let parallaxQueued = false;

  function updateParallax() {
    parallaxQueued = false;
    const viewport = window.innerHeight || 1;

    parallaxItems.forEach((item) => {
      const box = item.getBoundingClientRect();
      if (box.bottom < -200 || box.top > viewport + 200) return;

      const center = box.top + box.height / 2;
      /* -1 (acima da tela) … 0 (centro) … 1 (abaixo) */
      const progress = clamp((center - viewport / 2) / viewport, -1, 1);
      const speed = Number(item.dataset.parallax) || 18;
      item.style.setProperty("--parallax-y", `${(progress * speed).toFixed(2)}px`);
    });
  }

  function requestParallax() {
    if (parallaxQueued) return;
    parallaxQueued = true;
    requestAnimationFrame(updateParallax);
  }

  if (parallaxItems.length && !reduceMotion.matches) {
    updateParallax();
    window.addEventListener("scroll", requestParallax, { passive: true });
    window.addEventListener("resize", requestParallax, { passive: true });
  }

  /* ---------------------------------------------------------
     Inclinação 3D: o ponteiro sobre o cartão inclina a imagem.
     Os ângulos saem como variáveis para não brigar com as
     transformações que o CSS já aplica no hover.
     --------------------------------------------------------- */
  const tiltCards = Array.from(document.querySelectorAll("[data-tilt]"));

  if (tiltCards.length && finePointer.matches && !reduceMotion.matches) {
    tiltCards.forEach((card) => {
      const limit = Number(card.dataset.tilt) || 6;

      card.addEventListener("pointermove", (event) => {
        const box = card.getBoundingClientRect();
        const x = (event.clientX - box.left) / box.width - 0.5;
        const y = (event.clientY - box.top) / box.height - 0.5;
        card.style.setProperty("--ry", `${(x * limit).toFixed(2)}deg`);
        card.style.setProperty("--rx", `${(-y * limit).toFixed(2)}deg`);
      });

      const reset = () => {
        card.style.setProperty("--ry", "0deg");
        card.style.setProperty("--rx", "0deg");
      };
      card.addEventListener("pointerleave", reset);
      card.addEventListener("blur", reset, true);
    });
  }

  /* ---------------------------------------------------------
     Brilho do cursor: só acende sobre as áreas escuras.
     --------------------------------------------------------- */
  const cursorGlow = document.querySelector(".cursor-glow");

  if (cursorGlow && finePointer.matches && !reduceMotion.matches) {
    let glowQueued = false;
    let pointerX = 0;
    let pointerY = 0;
    let overDark = false;

    const paint = () => {
      glowQueued = false;
      cursorGlow.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
      cursorGlow.classList.toggle("is-on", overDark);
    };

    document.addEventListener(
      "pointermove",
      (event) => {
        pointerX = event.clientX;
        pointerY = event.clientY;
        overDark = Boolean(event.target.closest && event.target.closest("[data-dark]"));
        if (glowQueued) return;
        glowQueued = true;
        requestAnimationFrame(paint);
      },
      { passive: true }
    );

    document.addEventListener("pointerleave", () => cursorGlow.classList.remove("is-on"));
  } else if (cursorGlow) {
    cursorGlow.remove();
  }

  /* ---------------------------------------------------------
     Contadores: o número sobe quando entra na viewport.
     --------------------------------------------------------- */
  const counters = Array.from(document.querySelectorAll("[data-count]"));

  function runCounter(element) {
    const target = Number(element.dataset.count);
    if (!Number.isFinite(target)) return;

    const prefix = element.dataset.countPrefix || "";
    const suffix = element.dataset.countSuffix || "";
    const duration = 1100;
    const started = performance.now();

    const step = (now) => {
      const progress = clamp((now - started) / duration, 0, 1);
      /* desacelera no fim */
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = `${prefix}${Math.round(target * eased)}${suffix}`;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }

  if (counters.length) {
    if (reduceMotion.matches || typeof IntersectionObserver !== "function") {
      counters.forEach((element) => {
        const prefix = element.dataset.countPrefix || "";
        const suffix = element.dataset.countSuffix || "";
        element.textContent = `${prefix}${element.dataset.count}${suffix}`;
      });
    } else {
      const observer = new IntersectionObserver(
        (entries, self) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            runCounter(entry.target);
            self.unobserve(entry.target);
          });
        },
        { threshold: 0.6 }
      );
      counters.forEach((element) => observer.observe(element));
    }
  }

  /* ---------------------------------------------------------
     Scroll interno dos mockups: a captura desliza dentro do
     browser frame conforme a seção passa pela tela.
     --------------------------------------------------------- */
  const scrollShots = Array.from(document.querySelectorAll("[data-inner-scroll]"));
  let shotQueued = false;

  function updateShots() {
    shotQueued = false;
    const viewport = window.innerHeight || 1;

    scrollShots.forEach((frame) => {
      const image = frame.querySelector("img");
      if (!image) return;

      const box = frame.getBoundingClientRect();
      if (box.bottom < 0 || box.top > viewport) return;

      const travel = image.offsetHeight - frame.clientHeight;
      if (travel <= 0) return;

      /* 0 quando o frame entra por baixo, 1 quando sai por cima */
      const progress = clamp((viewport - box.top) / (viewport + box.height), 0, 1);
      image.style.transform = `translate3d(0, ${(-progress * travel).toFixed(1)}px, 0)`;
    });
  }

  function requestShots() {
    if (shotQueued) return;
    shotQueued = true;
    requestAnimationFrame(updateShots);
  }

  if (scrollShots.length && !reduceMotion.matches) {
    updateShots();
    window.addEventListener("scroll", requestShots, { passive: true });
    window.addEventListener("resize", requestShots, { passive: true });
    window.addEventListener("load", updateShots);
  }
})();
