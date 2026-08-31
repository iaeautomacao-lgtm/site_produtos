const productDetails = {
  callia: {
    tag: "VOZ · IA",
    title: "Call IA",
    lead: "Agentes de voz com IA para cobrança, vendas, atendimento e operações ativas ou receptivas, com condução natural e registro operacional.",
    image: "./assets/DDM CALL IA.png",
    benefitsTitle: "Voz inteligente para operações de alto volume.",
    benefits: [
      ["01", "Converse", "Conduza chamadas com abordagem natural e aderente ao objetivo da operação."],
      ["02", "Registre", "Transforme cada chamada em desfecho, histórico e dado operacional."],
      ["03", "Escalone", "Execute campanhas ativas ou receptivas com consistência e disponibilidade."]
    ],
    flow: ["Cenário", "Conversa", "Desfecho", "Indicadores"],
    fit: "Cobrança · Atendimento · Vendas · SAC",
    interest: "DDM Call IA"
  },
  qualiddm: {
    tag: "MONITORIA COM IA",
    title: "QualiDDM",
    lead: "Monitoria e auditoria de voz e chat com IA para qualidade, compliance e inteligência operacional em escala.",
    image: "./assets/QUALIDDM.jpeg",
    benefitsTitle: "Qualidade analisada com mais velocidade e profundidade.",
    benefits: [
      ["01", "Audite", "Avalie conversas com critérios consistentes e rastreáveis."],
      ["02", "Pontue", "Identifique padrões, riscos, oportunidades e aderência ao processo."],
      ["03", "Evolua", "Transforme atendimento em plano de melhoria e inteligência operacional."]
    ],
    flow: ["Conversa", "Análise", "Score", "Plano de ação"],
    fit: "Qualidade · Compliance · Atendimento · Operação",
    interest: "QualiDDM"
  },
  creator: {
    tag: "CRIAÇÃO DE IMAGENS · IA",
    title: "Creator",
    lead: "Criação de imagens com IA para campanhas, comunicação e produção visual alinhada à identidade da marca.",
    image: "./assets/DDM CREATOR.png",
    benefitsTitle: "Produção visual com velocidade e consistência.",
    benefits: [
      ["01", "Crie", "Produza imagens e variações para campanhas em poucos minutos."],
      ["02", "Padronize", "Mantenha a identidade visual com orientação de marca."],
      ["03", "Escalone", "Acelere a produção para canais, peças e públicos diferentes."]
    ],
    flow: ["Briefing", "Geração", "Ajustes", "Aprovação"],
    fit: "Marketing · Social Media · Comercial · Campanhas",
    interest: "DDM Creator"
  },
  dashboard: {
    tag: "DADOS & DASHBOARDS",
    title: "Dashboard Creator",
    lead: "Transforme dados e planilhas em dashboards, KPIs e análises executivas orientadas ao negócio.",
    image: "./assets/DASHBOARD CREATOR.jpeg",
    benefitsTitle: "Dados mais claros para decisões mais rápidas.",
    benefits: [
      ["01", "Organize", "Conecte informações dispersas em uma visão executiva."],
      ["02", "Visualize", "Acompanhe KPIs com dashboards claros e objetivos."],
      ["03", "Decida", "Transforme planilhas e dados em leitura de negócio."]
    ],
    flow: ["Dados", "Modelo", "Dashboard", "Insight"],
    fit: "Gestão · Financeiro · Operação · Diretoria",
    interest: "DDM Dashboard Creator"
  },
  leads: {
    tag: "COMERCIAL",
    title: "Extrator de Leads",
    lead: "Encontre, qualifique e enriqueça leads para acelerar a prospecção e aumentar a eficiência comercial.",
    image: "./assets/EXTRATOR DE LEADS.jpeg",
    benefitsTitle: "Prospecção com mais foco e menos trabalho manual.",
    benefits: [
      ["01", "Encontre", "Mapeie oportunidades com critérios comerciais definidos."],
      ["02", "Qualifique", "Organize leads por perfil, segmento e potencial."],
      ["03", "Acelere", "Apoie o time comercial com bases mais úteis e acionáveis."]
    ],
    flow: ["Busca", "Enriquecimento", "Qualificação", "Lista comercial"],
    fit: "Comercial · SDR · Marketing · Prospecção",
    interest: "DDM Extrator de Leads"
  },
  crm: {
    tag: "ATENDIMENTO",
    title: "Omni CRM",
    lead: "Centralize atendimento, WhatsApp, equipes, automações e gestão operacional em uma única plataforma.",
    image: "./assets/OMNI CRM DDM.png",
    benefitsTitle: "Atendimento centralizado para equipes e canais.",
    benefits: [
      ["01", "Centralize", "Una conversas, histórico e filas em uma única operação."],
      ["02", "Automatize", "Reduza tarefas repetitivas com fluxos e regras."],
      ["03", "Gerencie", "Acompanhe equipe, SLA, status e produtividade."]
    ],
    flow: ["Canal", "Fila", "Atendimento", "Gestão"],
    fit: "Atendimento · WhatsApp · Equipes · Operação",
    interest: "DDM CRM"
  },
  mail: {
    tag: "AUTOMAÇÃO DE E-MAIL",
    title: "Mail IA",
    lead: "Automatize atendimento e backoffice por e-mail com IA, conhecimento corporativo e controle operacional.",
    image: "./assets/DDM BACKOFFICE.jpeg",
    benefitsTitle: "E-mails tratados com contexto e padrão operacional.",
    benefits: [
      ["01", "Classifique", "Organize demandas por assunto, prioridade e área responsável."],
      ["02", "Responda", "Apoie respostas com base em conhecimento corporativo."],
      ["03", "Controle", "Dê visibilidade ao volume, prazos e gargalos do backoffice."]
    ],
    flow: ["Entrada", "Classificação", "Resposta", "Controle"],
    fit: "Backoffice · Atendimento · Operação · E-mail",
    interest: "DDM Mail IA"
  },
  labs: {
    tag: "HUB CORPORATIVO DE IA",
    title: "DDM Labs",
    lead: "Plataforma integrada que centraliza agentes de IA, fluxos automatizados, dashboards analíticos e ferramentas digitais em um ecossistema único.",
    image: "./assets/DDM LABS.png",
    benefitsTitle: "IA estratégica e automação corporativa em um só ecossistema.",
    benefits: [
      ["01", "Centralize", "Acesso unificado a agentes inteligentes, automações e painéis analíticos em um só ambiente corporativo."],
      ["02", "Aplique", "Ferramentas práticas para reduzir trabalho braçal, padronizar execuções e elevar a eficiência das equipes."],
      ["03", "Escale", "Arquitetura modular que se adapta às regras de negócio e se integra aos processos existentes."]
    ],
    flow: ["Agentes", "Automação", "Dashboards", "Decisão"],
    fit: "Operação · Backoffice · Gestão · Times estratégicos",
    interest: "DDM Labs"
  },
  whatsapp: {
    tag: "VOZ EM ESCALA",
    title: "Call IA WhatsApp",
    lead: "Agente de voz com IA para chamadas via WhatsApp em escala, com personalização, campanhas e acompanhamento operacional.",
    image: "./assets/DDM CALL IA WHATSAPP.png",
    benefitsTitle: "Campanhas de voz pelo WhatsApp com acompanhamento.",
    benefits: [
      ["01", "Dispare", "Execute campanhas de voz diretamente pelo WhatsApp."],
      ["02", "Personalize", "Adapte abordagem, regras e objetivo por público."],
      ["03", "Acompanhe", "Monitore conversas, status e resultados em tempo real."]
    ],
    flow: ["Campanha", "WhatsApp", "Chamada", "Resultado"],
    fit: "Cobrança · Vendas · Campanhas · Relacionamento",
    interest: "DDM Call IA WhatsApp"
  }
};

const params = new URLSearchParams(window.location.search);
const key = params.get("produto") || "callia";
const detail = productDetails[key] || productDetails.callia;

document.title = `${detail.title} | DDM AI Hub`;

const setText = (id, text) => {
  const element = document.getElementById(id);
  if (element) element.textContent = text;
};

const setImage = (id, src, alt) => {
  const image = document.getElementById(id);
  if (!image) return;
  image.src = src;
  image.alt = alt;
};

setText("detailTag", detail.tag);
setText("detailTitle", detail.title);
setText("detailLead", detail.lead);
setText("detailBrowser", detail.title);
setText("benefitTitle", detail.benefitsTitle);
setText("flowTitle", `Como o ${detail.title} entra na rotina.`);
setText("operationFit", detail.fit);
setText("finalTitle", `Quer ver o ${detail.title} na prática?`);

setImage("detailImage", detail.image, `Interface do ${detail.title}`);

const benefitGrid = document.getElementById("benefitGrid");
benefitGrid.innerHTML = "";
detail.benefits.forEach(([number, title, text]) => {
  const card = document.createElement("article");
  card.innerHTML = `<span>${number}</span><h3>${title}</h3><p>${text}</p>`;
  benefitGrid.appendChild(card);
});

const flow = document.getElementById("detailFlow");
flow.innerHTML = "";
detail.flow.forEach((item, index) => {
  const step = document.createElement("span");
  step.textContent = item;
  flow.appendChild(step);
  if (index < detail.flow.length - 1) {
    const arrow = document.createElement("i");
    arrow.textContent = "→";
    flow.appendChild(arrow);
  }
});

const contactUrl = `./index.html?interest=${encodeURIComponent(detail.interest)}#contato`;
document.getElementById("detailDemo").href = contactUrl;
document.getElementById("finalContact").href = contactUrl;
