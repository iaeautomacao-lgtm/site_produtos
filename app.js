const CONFIG = {
  vapi: {
    publicKey: "db5278ba-8878-43c9-8d14-be57efe66227",
    assistants: {
      cobranca: "4e980169-7e8b-44e4-bf08-edc6699b5c30",
      qualificacao: "4e980169-7e8b-44e4-bf08-edc6699b5c30",
      atendimento: "4e980169-7e8b-44e4-bf08-edc6699b5c30"
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
  message.querySelector("p").textContent = text;
  transcript.appendChild(message);
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
  $("#waveform")?.classList.toggle("running", value);
  $(".call-label").textContent = value ? "Encerrar chamada" : "Iniciar chamada";
  $("#voiceStatus").innerHTML = value
    ? "<i></i>Chamada em andamento"
    : "<i></i>Aguardando início";
  if (value) {
    startDuration();
  } else {
    stopDuration();
    setTranscriptStatus("Pronto");
  }
}

function startSimulation() {
  realCall = false;
  resetTranscript();
  setRunning(true);
  transcriptSets[selectedScenario].forEach(([role, text], index) => {
    timers.push(setTimeout(() => {
      setTranscriptStatus(role === "ai" ? "DDM AI respondendo" : "Você está falando", "status-speaking");
      addLine(role, text);
    }, 700 + index * 1300));
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
    setTranscriptStatus("Chamada ativa", "status-speaking");
    addLine("ai", "Chamada conectada. A conversa será acompanhada em tempo real aqui.");
  });

  client.on("call-end", () => {
    setRunning(false);
    realCall = false;
  });

  client.on("speech-start", () => {
    $("#callCore").classList.add("running");
    $("#waveform")?.classList.add("running");
    setTranscriptStatus("Áudio detectado", "status-speaking");
  });

  client.on("speech-end", () => {
    if (!running) return;
    $("#callCore").classList.remove("running");
    $("#waveform")?.classList.remove("running");
    setTranscriptStatus("Processando", "status-speaking");
  });

  client.on("message", (message) => {
    if (message?.type !== "transcript" || !message.transcript) return;
    if (message.transcriptType === "partial") return;
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

function addChatMessage(role, text, extraClass = "") {
  const messages = $("#chatMessages");
  if (!messages) return null;

  const message = document.createElement("div");
  const isUser = role === "user";
  message.className = `chat-message ${isUser ? "user" : "assistant"} ${extraClass}`.trim();
  message.innerHTML = isUser ? `
    <div class="message-content">
      <span class="message-author">VOCÊ</span>
      <div class="message-bubble"></div>
    </div>
  ` : `
    <div class="message-avatar">
      <img src="./assets/acordito.png" alt="">
    </div>
    <div class="message-content">
      <span class="message-author">ASSISTENTE DDM</span>
      <div class="message-bubble"></div>
    </div>
  `;
  message.querySelector(".message-bubble").textContent = text;
  messages.appendChild(message);
  messages.scrollTop = messages.scrollHeight;
  return message;
}

async function sendChatMessage(text) {
  const form = $("#chatForm");
  const input = form.querySelector("input");
  const submit = form.querySelector("button");

  addChatMessage("user", text);
  input.value = "";
  input.disabled = true;
  submit.disabled = true;

  const loading = addChatMessage("model", "Assistente DDM está analisando...", "loading");

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

    loading.querySelector(".message-bubble").textContent = data.reply;
    loading.classList.remove("loading");
    chatHistory.push({ role: "user", text });
    chatHistory.push({ role: "model", text: data.reply });
    chatHistory = chatHistory.slice(-10);
  } catch (error) {
    loading.querySelector(".message-bubble").textContent = error.message || "Não foi possível conectar ao assistente agora.";
    loading.classList.remove("loading");
    loading.classList.add("error");
  } finally {
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
