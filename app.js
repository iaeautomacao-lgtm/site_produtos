const CONFIG = {
  vapi: {
    publicKey: "db5278ba-8878-43c9-8d14-be57efe66227",
    assistants: {
      cobranca: "93f19be7-eae6-458f-bcc8-d488fc4b183c",
      qualificacao: "c578cc71-9d04-4b21-ac59-fb8cb5262f5a",
      atendimento: "1c762672-d8e2-4f12-888d-64fc6e1dbe48"
    }
  },
  sdkUrl: "https://esm.sh/@vapi-ai/web"
};

const transcriptSets = {
  cobranca: [
    ["ai", "Olá, eu sou a Sofia da DDM. Posso te ajudar a encontrar uma opção de acordo hoje?"],
    ["user", "Sim, quero entender as possibilidades de pagamento."],
    ["ai", "Perfeito. Vou validar o contexto, apresentar as condições disponíveis e registrar o desfecho para a operação."]
  ],
  qualificacao: [
    ["ai", "Olá. Vou fazer algumas perguntas rápidas para entender o perfil da sua empresa."],
    ["user", "Temos uma operação com alto volume de atendimento."],
    ["ai", "Entendi. O melhor caminho é avaliar volume, canais atuais e pontos de automação com maior retorno."]
  ],
  atendimento: [
    ["ai", "Atendimento DDM. Me conte o que você precisa resolver."],
    ["user", "Quero acompanhar uma solicitacao em aberto."],
    ["ai", "Posso consultar o status, explicar a próxima etapa e direcionar para um especialista se necessário."]
  ]
};

let selectedScenario = "cobranca";
let running = false;
let realCall = false;
let vapiClient = null;
let timers = [];
let durationTimer = null;
let callStartedAt = null;
let chatScenario = "cobranca";
let chatHistory = [
  { role: "model", text: "Olá. Sou o assistente virtual da DDM. Posso demonstrar como nossas soluções de IA atuam em voz, atendimento, cobrança e automação." }
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function clearTimers() {
  timers.forEach((timer) => clearTimeout(timer));
  timers = [];
}

function formatDuration(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function setTranscriptStatus(text, className = "status-ready") {
  const status = $("#transcriptStatus");
  if (!status) return;
  status.className = className;
  status.textContent = text;
}

function startDuration() {
  const duration = $("#callDuration");
  if (!duration) return;
  clearInterval(durationTimer);
  callStartedAt = Date.now();
  duration.textContent = "00:00";
  durationTimer = setInterval(() => {
    duration.textContent = formatDuration(Date.now() - callStartedAt);
  }, 1000);
}

function stopDuration(reset = false) {
  clearInterval(durationTimer);
  durationTimer = null;
  if (reset) {
    callStartedAt = null;
    $("#callDuration").textContent = "00:00";
  }
}

function hasVapiConfig() {
  const key = CONFIG.vapi.publicKey.trim();
  const assistant = CONFIG.vapi.assistants[selectedScenario]?.trim();
  return Boolean(key && assistant);
}

function setIntegrationMode() {
  const configured = hasVapiConfig();
  $("#voiceMode").innerHTML = configured ? "<i></i> agente ao vivo" : "<i></i> agente DDM";
  $("#integrationNote").textContent = configured
    ? "A chamada será conduzida pelo agente DDM do cenário selecionado."
    : "Experimente a jornada de voz e veja como ela pode se adaptar ao seu processo.";
}

/* ------------------------------------------------------------
   Waveform ligado ao áudio da chamada.
   Em chamada real o nível vem do evento volume-level da Vapi; na
   simulação usamos um envelope sintético, e a barra deixa claro
   que ali não há áudio de verdade.
   ------------------------------------------------------------ */
const waveform = $("#waveform");
const waveBars = waveform ? $$("#waveform i") : [];
const waveHistory = new Array(waveBars.length).fill(0);
const clampUnit = (value) => Math.min(1, Math.max(0, value));

let waveTarget = 0;
let waveSmoothed = 0;
let waveFrame = null;
let waveSynthetic = false;

function paintWave() {
  waveSmoothed += (waveTarget - waveSmoothed) * 0.32;

  if (waveSynthetic) {
    /* envelope irregular para não parecer um metrônomo */
    const now = performance.now() / 1000;
    const noise = (Math.sin(now * 7.3) + Math.sin(now * 11.7)) / 2;
    waveTarget = clampUnit(0.45 + noise * 0.4);
  }

  waveHistory.push(waveSmoothed);
  waveHistory.shift();

  waveBars.forEach((bar, index) => {
    const level = waveHistory[index] || 0;
    bar.style.height = `${(10 + level * 32).toFixed(1)}px`;
    bar.style.opacity = (0.4 + level * 0.6).toFixed(2);
  });

  waveFrame = requestAnimationFrame(paintWave);
}

function startWave({ synthetic = false } = {}) {
  if (!waveBars.length) return;
  waveSynthetic = synthetic;
  waveform.classList.add("running");
  if (!waveFrame) waveFrame = requestAnimationFrame(paintWave);
}

function stopWave() {
  waveSynthetic = false;
  waveTarget = 0;
  if (waveFrame) {
    cancelAnimationFrame(waveFrame);
    waveFrame = null;
  }
  waveform?.classList.remove("running");
  waveHistory.fill(0);
  waveBars.forEach((bar) => {
    bar.style.height = "";
    bar.style.opacity = "";
  });
}

function setWaveLevel(level) {
  waveSynthetic = false;
  waveTarget = clampUnit(Number(level) || 0);
}

/* ------------------------------------------------------------
   Estado do agente: ouvindo → processando → respondendo.
   ------------------------------------------------------------ */
function setAgentState(state) {
  const steps = $$("#agentStates li");
  if (!steps.length) return;
  steps.forEach((step) => step.classList.toggle("is-active", step.dataset.state === state));
  $("#agentStates")?.classList.toggle("is-idle", !state);
}

/* ------------------------------------------------------------
   Transcrição surgindo progressivamente.
   ------------------------------------------------------------ */
const prefersStill = window.matchMedia("(prefers-reduced-motion: reduce)");

function typeInto(target, text, speed = 16) {
  if (prefersStill.matches) {
    target.textContent = text;
    return;
  }

  let index = 0;
  target.textContent = "";
  target.classList.add("is-typing");

  const step = () => {
    /* alguns caracteres por quadro para textos longos não arrastarem */
    index = Math.min(text.length, index + (text.length > 90 ? 3 : 2));
    target.textContent = text.slice(0, index);
    if (index < text.length) {
      timers.push(setTimeout(step, speed));
      return;
    }
    target.classList.remove("is-typing");
  };

  step();
}

function addLine(role, text) {
  const transcript = $("#transcript");
  const empty = transcript.querySelector(".transcript-empty");
  if (empty) empty.remove();

  const message = document.createElement("div");
  const isAi = role === "ai";
  const time = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date());

  message.className = `message ${isAi ? "message-ai" : "message-user"}`;
  message.innerHTML = `
    <div class="message-meta">
      <span>${isAi ? "DDM AI" : "VOCÊ"}</span>
      <time>${time}</time>
    </div>
    <p></p>
  `;
  transcript.appendChild(message);
  typeInto(message.querySelector("p"), text);
  transcript.scrollTop = transcript.scrollHeight;
}

function resetTranscript() {
  $("#transcript").innerHTML = `
    <div class="transcript-empty">
      <div class="empty-icon">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <h4>A conversa aparecerá aqui</h4>
      <p>Inicie a demonstração para acompanhar a transcrição da chamada em tempo real.</p>
      <div class="empty-features">
        <span>Voz em tempo real</span>
        <span>Identificação de interlocutor</span>
        <span>Atualização automática</span>
      </div>
    </div>
  `;
  setTranscriptStatus("Pronto");
  stopDuration(true);
}

function setRunning(value) {
  running = value;
  $("#callButton").classList.toggle("running", value);
  $("#callCore").classList.toggle("running", value);
  $(".call-label").textContent = value ? "Encerrar chamada" : "Iniciar chamada";
  $("#voiceStatus").innerHTML = value
    ? "<i></i>Chamada em andamento"
    : "<i></i>Aguardando início";
  if (value) {
    startDuration();
  } else {
    stopDuration();
    stopWave();
    setAgentState(null);
    setTranscriptStatus("Pronto");
  }
}

function startSimulation() {
  realCall = false;
  resetTranscript();
  setRunning(true);
  transcriptSets[selectedScenario].forEach(([role, text], index) => {
    const at = 700 + index * 1300;

    /* antes de cada fala, o agente aparece processando */
    timers.push(setTimeout(() => {
      setAgentState("thinking");
      stopWave();
    }, Math.max(0, at - 380)));

    timers.push(setTimeout(() => {
      const isAi = role === "ai";
      setAgentState(isAi ? "speaking" : "listening");
      setTranscriptStatus(isAi ? "DDM AI respondendo" : "Você está falando", "status-speaking");
      startWave({ synthetic: true });
      addLine(role, text);
    }, at));
  });
  timers.push(setTimeout(() => {
    setRunning(false);
    setTranscriptStatus("Concluido");
  }, 700 + transcriptSets[selectedScenario].length * 1300 + 600));
}

async function getVapiClient() {
  if (vapiClient) return vapiClient;

  const module = await import(CONFIG.sdkUrl);
  const Vapi = module.default;
  const client = new Vapi(CONFIG.vapi.publicKey.trim());

  client.on("call-start", () => {
    realCall = true;
    resetTranscript();
    setRunning(true);
    setAgentState("listening");
    startWave();
    setTranscriptStatus("Chamada ativa", "status-speaking");
    addLine("ai", "Chamada conectada. A conversa será acompanhada em tempo real aqui.");
  });

  client.on("call-end", () => {
    setRunning(false);
    realCall = false;
  });

  /* nível de áudio real da chamada alimentando o waveform */
  client.on("volume-level", (level) => {
    if (!running) return;
    startWave();
    setWaveLevel(level);
  });

  client.on("speech-start", () => {
    $("#callCore").classList.add("running");
    setAgentState("speaking");
    startWave();
    setTranscriptStatus("Áudio detectado", "status-speaking");
  });

  client.on("speech-end", () => {
    if (!running) return;
    $("#callCore").classList.remove("running");
    setAgentState("thinking");
    setWaveLevel(0);
    setTranscriptStatus("Processando", "status-speaking");
  });

  client.on("message", (message) => {
    if (message?.type !== "transcript" || !message.transcript) return;
    if (message.transcriptType === "partial") {
      if (message.role !== "assistant") setAgentState("listening");
      return;
    }
    addLine(message.role === "assistant" ? "ai" : "user", message.transcript);
  });

  client.on("error", (error) => {
    console.error("Vapi error:", error);
    setRunning(false);
    realCall = false;
    alert("Não foi possível iniciar a chamada agora. Verifique a permissão do microfone e tente novamente.");
  });

  vapiClient = client;
  return vapiClient;
}

async function startVapiCall() {
  realCall = true;
  resetTranscript();
  $("#voiceStatus").innerHTML = "<i></i>Conectando agente";
  try {
    const client = await getVapiClient();
    await client.start(CONFIG.vapi.assistants[selectedScenario].trim());
  } catch (error) {
    console.error(error);
    realCall = false;
    setRunning(false);
    alert("Não foi possível iniciar a experiência de voz agora. Tente novamente em instantes.");
  }
}

$$(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    $$(".tab").forEach((item) => item.classList.toggle("active", item === tab));
    $$(".lab-panel").forEach((panel) => {
      panel.classList.toggle("active", panel.id === `panel-${tab.dataset.panel}`);
    });

    // O vídeo só começa quando a aba fica visível: painel oculto bloqueia o autoplay.
    const video = $("#acorditoVideo");
    if (!video) return;
    if (tab.dataset.panel === "chat") {
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        video.play().catch(() => {});
      }
    } else {
      video.pause();
    }
  });
});

$$(".scenario").forEach((button) => {
  button.addEventListener("click", () => {
    if (running) return;
    selectedScenario = button.dataset.scenario;
    $$(".scenario").forEach((item) => item.classList.toggle("active", item === button));
    resetTranscript();
    setIntegrationMode();
  });
});

$("#callButton").addEventListener("click", async () => {
  if (running) {
    clearTimers();
    if (realCall && vapiClient) vapiClient.stop();
    setRunning(false);
    setTranscriptStatus("Encerrado");
    realCall = false;
    return;
  }

  if (hasVapiConfig()) {
    await startVapiCall();
    return;
  }

  startSimulation();
});

const ACORDITO_STATES = {
  idle: "PRONTO PARA CONVERSAR",
  thinking: "ACORDITO ESTÁ PENSANDO...",
  responding: "ACORDITO ESTÁ RESPONDENDO"
};

function setAcorditoState(state) {
  const stage = $("#acorditoStage");
  const label = $("#acorditoStatus");
  if (!stage || !label) return;

  stage.dataset.state = state;
  label.innerHTML = "<span></span>";
  label.append(ACORDITO_STATES[state] || ACORDITO_STATES.idle);

  // Idle mais lento pra leitura calma; acelera quando esta pensando.
  const video = $("#acorditoVideo");
  if (video) video.playbackRate = state === "thinking" ? 1.5 : 0.65;
}

// Bolha sem autor quando o Acordito emenda a fala anterior.
function addChatMessage(role, text, extraClass = "") {
  const messages = $("#chatMessages");
  if (!messages) return null;

  const isUser = role === "user";
  const previous = messages.lastElementChild;
  const grouped = !isUser && previous?.classList.contains("assistant") && !previous.classList.contains("loading");

  const message = document.createElement("div");
  message.className = [
    "chat-message",
    isUser ? "user" : "assistant",
    grouped ? "is-grouped" : "",
    extraClass
  ].filter(Boolean).join(" ");

  const author = isUser ? "VOCÊ" : "ACORDITO";
  message.innerHTML = `
    <div class="message-content">
      ${grouped ? "" : `<span class="message-author">${author}</span>`}
      <div class="message-bubble"></div>
    </div>
  `;
  message.querySelector(".message-bubble").textContent = text;
  messages.appendChild(message);
  messages.scrollTop = messages.scrollHeight;
  updateChatGhost();
  return message;
}

// A marca d'agua do painel some assim que a conversa passa das falas de abertura.
function updateChatGhost() {
  const body = $("#chatBody");
  const messages = $("#chatMessages");
  if (!body || !messages) return;
  body.classList.toggle("has-conversation", messages.children.length > 2);
}

// Resposta longa vira 2-3 bolhas curtas: parágrafo primeiro, frase como plano B.
function splitReply(text) {
  const clean = String(text).trim();
  let parts = clean.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean);

  if (parts.length < 2) {
    const sentences = clean.split(/(?<=[.!?])\s+/).filter(Boolean);
    if (sentences.length > 2) {
      const size = Math.ceil(sentences.length / Math.min(3, Math.ceil(sentences.length / 2)));
      parts = [];
      for (let i = 0; i < sentences.length; i += size) {
        parts.push(sentences.slice(i, i + size).join(" "));
      }
    } else {
      parts = [clean];
    }
  }

  if (parts.length > 3) {
    parts = [parts[0], parts[1], parts.slice(2).join(" ")];
  }
  return parts;
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function sendChatMessage(text) {
  const form = $("#chatForm");
  const input = form.querySelector("input");
  const submit = form.querySelector("button");

  addChatMessage("user", text);
  input.value = "";
  input.disabled = true;
  submit.disabled = true;

  const loading = addChatMessage("model", "", "loading");
  loading.querySelector(".message-bubble").innerHTML = "<i></i><i></i><i></i>";
  $(".chat-window")?.classList.add("is-thinking");
  setAcorditoState("thinking");

  try {
    const response = await fetch("./chat.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scenario: chatScenario,
        message: text,
        history: chatHistory
      })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.reply) {
      throw new Error(data.error || "Não foi possível responder agora.");
    }

    loading.remove();
    $(".chat-window")?.classList.remove("is-thinking");
    setAcorditoState("responding");

    const parts = splitReply(data.reply);
    for (let i = 0; i < parts.length; i += 1) {
      if (i > 0) await wait(520);
      addChatMessage("model", parts[i]);
    }

    chatHistory.push({ role: "user", text });
    chatHistory.push({ role: "model", text: data.reply });
    chatHistory = chatHistory.slice(-10);
  } catch (error) {
    loading.remove();
    addChatMessage("model", error.message || "Não foi possível conectar ao assistente agora.", "error");
  } finally {
    $(".chat-window")?.classList.remove("is-thinking");
    setAcorditoState("idle");
    input.disabled = false;
    submit.disabled = false;
    input.focus();
  }
}

$$(".suggestion-chip").forEach((button) => {
  button.addEventListener("click", () => {
    chatScenario = button.dataset.chatMode || "atendimento";
    const prompt = button.dataset.chatPrompt;
    if (prompt) sendChatMessage(prompt);
  });
});

$("#chatForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const input = event.currentTarget.querySelector("input");
  const text = input.value.trim();
  if (!text) return;

  sendChatMessage(text);
});

$$("[data-interest]").forEach((link) => {
  link.addEventListener("click", () => {
    const interest = link.dataset.interest;
    if (!interest) return;

    $$('input[name="interesse[]"]').forEach((option) => {
      option.checked = option.value === interest || option.checked;
    });
  });
});

const initialInterest = new URLSearchParams(window.location.search).get("interest");
if (initialInterest) {
  $$('input[name="interesse[]"]').forEach((option) => {
    option.checked = option.value === initialInterest;
  });
}

$("#contactForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const feedback = $("#formFeedback");
  const submit = form.querySelector('button[type="submit"]');
  const originalText = submit.innerHTML;

  feedback.className = "form-feedback";
  feedback.textContent = "Enviando mensagem...";
  submit.disabled = true;
  submit.innerHTML = "Enviando...";

  try {
    const response = await fetch("./contato.php", {
      method: "POST",
      body: new FormData(form)
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.ok) {
      throw new Error(data.error || "Nao foi possivel enviar agora.");
    }

    feedback.classList.add("success");
    feedback.textContent = data.message || "Mensagem enviada. Nosso time comercial entrara em contato.";
    form.reset();
  } catch (error) {
    feedback.classList.add("error");
    feedback.textContent = error.message || "Nao foi possivel enviar agora. Tente pelo WhatsApp comercial.";
  } finally {
    submit.disabled = false;
    submit.innerHTML = originalText;
  }
});

setIntegrationMode();

/* ------------------------------------------------------------
   Glow laranja acompanhando o scroll nas seções escuras.
   ------------------------------------------------------------ */
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const glowLayer = $(".scroll-glow");
const glowZones = $$("[data-glow]");
let glowQueued = false;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function updateGlow() {
  glowQueued = false;
  const viewport = window.innerHeight || 1;
  let intensity = 0;
  let center = 0.5;

  glowZones.forEach((zone) => {
    const box = zone.getBoundingClientRect();
    const visible = Math.min(box.bottom, viewport) - Math.max(box.top, 0);
    if (visible <= 0 || box.height <= 0) return;

    const coverage = clamp(visible / viewport, 0, 1);
    if (coverage <= intensity) return;

    intensity = coverage;
    const progress = clamp((viewport * 0.5 - box.top) / box.height, 0, 1);
    center = 0.2 + progress * 0.6;
  });

  glowLayer.style.setProperty("--glow-a", (intensity * 0.62).toFixed(3));
  glowLayer.style.setProperty("--glow-y", `${(center * 100).toFixed(2)}%`);
}

function requestGlow() {
  if (glowQueued) return;
  glowQueued = true;
  requestAnimationFrame(updateGlow);
}

if (glowLayer && glowZones.length && !reduceMotion.matches) {
  window.addEventListener("scroll", requestGlow, { passive: true });
  window.addEventListener("resize", requestGlow, { passive: true });
  updateGlow();
} else if (glowLayer) {
  glowLayer.remove();
}

/* ------------------------------------------------------------
   Filtro de categorias da vitrine de produtos.
   ------------------------------------------------------------ */
const productGrid = $("#productGrid");
const productFilters = $$(".product-filter");
const productCount = $("#productCount");
const LEAVE_MS = 260;

function applyProductFilter(filter) {
  if (!productGrid) return;

  const cards = $$("#productGrid .product-card");
  const instant = reduceMotion.matches;
  let shown = 0;

  cards.forEach((card) => {
    const categories = (card.dataset.categories || "").split(" ");
    const matches = filter === "todos" || categories.includes(filter);

    card.classList.remove("is-entering");

    if (matches) {
      const wasHidden = card.hidden;
      card.classList.remove("is-leaving");
      card.hidden = false;
      card.style.setProperty("--enter-delay", `${shown * 45}ms`);
      shown += 1;

      if (wasHidden && !instant) {
        requestAnimationFrame(() => card.classList.add("is-entering"));
      }
      return;
    }

    if (card.hidden) return;

    if (instant) {
      card.hidden = true;
      return;
    }

    card.classList.add("is-leaving");
    setTimeout(() => {
      if (card.classList.contains("is-leaving")) card.hidden = true;
    }, LEAVE_MS);
  });

  productGrid.classList.toggle("is-filtered", filter !== "todos");

  if (productCount) {
    productCount.textContent =
      shown === cards.length ? `${cards.length} soluções` : `${shown} de ${cards.length} soluções`;
  }
}

productFilters.forEach((button) => {
  button.addEventListener("click", () => {
    productFilters.forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    applyProductFilter(button.dataset.filter);
  });
});
