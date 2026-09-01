/* Fonte única de conteúdo dos produtos.
   Consumida no navegador por produto.js e no Node por build-produtos.mjs.
   Ao editar aqui, rode `node build-produtos.mjs` para regerar as páginas. */
(function (root) {
  const products = {
    callia: {
      slug: "callia",
      tag: "VOZ · IA",
      title: "Call IA",
      headline: ["Agentes de voz que conversam,", "negociam e executam."],
      lead: "Agentes de voz com IA para cobrança, vendas, atendimento e operações ativas ou receptivas, com condução natural e registro operacional.",
      metaDescription:
        "Call IA: agentes de voz com IA para cobrança, vendas e atendimento, com condução natural da conversa e registro operacional de cada chamada.",
      image: "./assets/DDM CALL IA.png",
      primaryCta: { label: "Testar agora", href: "./index.html#lab" },
      solvesTitle: "Da conversa ao resultado operacional.",
      solves: [
        ["01", "Cobrança", "Negociação automatizada em escala, com condições e desfecho registrados."],
        ["02", "Atendimento", "Conversas naturais e contextualizadas, sem árvore de opções."],
        ["03", "Vendas", "Qualificação e conversão de oportunidades na própria chamada."]
      ],
      showcase: {
        type: "transcript",
        kicker: "VEJA A IA TRABALHANDO",
        title: "Uma chamada de cobrança, do alô ao acordo.",
        note: "Trecho ilustrativo de uma jornada de cobrança conduzida pelo agente.",
        lines: [
          ["ai", "Olá, eu sou a Sofia da DDM. Posso te ajudar a encontrar uma opção de acordo hoje?"],
          ["user", "Pode sim, quero entender as possibilidades de pagamento."],
          ["ai", "Consigo apresentar condições à vista ou parceladas. Qual formato encaixa melhor?"],
          ["user", "Parcelado, se der para começar no mês que vem."],
          ["ai", "Registrado. Vou enviar o acordo por WhatsApp e deixar o desfecho anotado no CRM."]
        ],
        panel: [
          ["Cenário", "Cobrança"],
          ["Etapa", "Proposta de acordo"],
          ["Próxima ação", "Enviar acordo por WhatsApp"],
          ["Registro", "Desfecho gravado no CRM"]
        ]
      },
      flow: ["Contato", "Conversa", "Regra", "Ação", "Resultado"],
      panelTitle: "O painel de quem opera.",
      panelText:
        "Acompanhamento da operação em tempo real: chamadas ativas, funil de conversão do disparo, resultados da fila e saúde do discador.",
      panelCaptions: [
        "Taxa de alô e conversão por campanha",
        "Funil do disparo até o acordo fechado",
        "Saúde da operação e pacing do discador"
      ],
      fit: "Cobrança · Atendimento · Vendas · SAC",
      interest: "DDM Call IA",
      ctaTitle: "Quer colocar agentes de voz na sua operação?"
    },

    whatsapp: {
      slug: "whatsapp",
      tag: "VOZ EM ESCALA",
      title: "Call IA WhatsApp",
      headline: ["Milhares de conversas.", "Uma operação."],
      lead: "Agente de voz com IA para chamadas via WhatsApp em escala, com personalização por público, campanhas e acompanhamento operacional.",
      metaDescription:
        "Call IA WhatsApp: campanhas de voz com IA pelo WhatsApp, com personalização por público, disparo em escala e acompanhamento das chamadas em tempo real.",
      image: "./assets/DDM CALL IA WHATSAPP.png",
      primaryCta: { label: "Testar agora", href: "./index.html#lab" },
      solvesTitle: "Voz no canal que o cliente já usa.",
      solves: [
        ["01", "Alcance", "Chamada de voz pelo WhatsApp, sem depender de telefonia tradicional."],
        ["02", "Campanha", "Públicos, roteiros e regras diferentes rodando ao mesmo tempo."],
        ["03", "Controle", "Status de cada linha e desfecho de cada conversa em tempo real."]
      ],
      showcase: {
        type: "campaign",
        kicker: "VEJA A IA TRABALHANDO",
        title: "Uma campanha disparando em várias linhas.",
        note: "Simulação de linhas simultâneas: os status avançam como em uma campanha real.",
        lines: [
          "Linha 01",
          "Linha 02",
          "Linha 03",
          "Linha 04",
          "Linha 05",
          "Linha 06"
        ],
        states: ["Na fila", "Chamando", "Em conversa", "Concluída"]
      },
      flow: ["Público", "Campanha", "Chamada", "Conversa", "Desfecho"],
      panelTitle: "O painel da campanha.",
      panelText:
        "Linhas WavoIP, status por dispositivo, volume de chamadas e acompanhamento de cada conversa em andamento.",
      panelCaptions: [
        "Linhas ativas, inativas e em chamada",
        "Status e número por dispositivo",
        "Controle de disparo e pausa da campanha"
      ],
      fit: "Cobrança · Vendas · Campanhas · Relacionamento",
      interest: "DDM Call IA WhatsApp",
      ctaTitle: "Quer rodar campanhas de voz pelo WhatsApp?"
    },

    lembretes: {
      slug: "lembretes",
      tag: "VOZ · RECUPERAÇÃO DE CRÉDITO",
      title: "Agente de Lembretes",
      headline: ["Lembrar, negociar e confirmar —", "em cada linha da base."],
      lead: "Agente de voz com IA para cobrança preventiva e recuperação de crédito: conduz a negociação, confirma a previsão de pagamento, agenda retorno e dispara o comprovante na sequência.",
      metaDescription:
        "Agente de Lembretes: IA de voz para cobrança preventiva e recuperação de crédito, com negociação, confirmação de pagamento, disparo de comprovante e painel de conversão em tempo real.",
      image: "./assets/agente de lembrete.png",
      cover: "./assets/agente de lembrete - capa.jpeg",
      primaryCta: { label: "Solicitar demonstração", href: "./index.html#contato" },
      solvesTitle: "Da régua de cobrança ao acordo confirmado.",
      solves: [
        ["01", "Negociação e acordo", "Apresenta o débito, calcula opções de desconto, confirma a data de pagamento e direciona o envio da linha digitável ou chave Pix."],
        ["02", "Painel de recuperação", "Volume de chamadas, contato com a pessoa certa (CPC), acordos formalizados, não atendimento e status das campanhas em tempo real."],
        ["03", "Multicanal e comprovantes", "SMS com link de pagamento logo após a chamada e integração por API/Webhook para atualizar ERP, CRM ou sistema financeiro."]
      ],
      showcase: {
        type: "negotiation",
        kicker: "VEJA A IA TRABALHANDO",
        title: "Uma ligação de cobrança que termina em acordo.",
        note: "Sequência ilustrativa de uma chamada de recuperação — as regras de desconto, retentativa e canal são configuradas por operação.",
        steps: [
          ["01", "Apresenta o débito", "Identifica-se, confirma a pessoa certa e expõe o valor em aberto."],
          ["02", "Calcula a condição", "Aplica a régua de desconto autorizada para a faixa de atraso."],
          ["03", "Confirma a data", "Registra a previsão de pagamento e agenda retorno se necessário."],
          ["04", "Dispara o comprovante", "Envia linha digitável ou Pix por SMS e atualiza o sistema financeiro."]
        ],
        readout: [
          ["Base", "Lote por faixa de atraso"],
          ["Canal", "Voz + SMS"],
          ["Desfecho", "Acordo formalizado"],
          ["Retorno", "Webhook para o ERP"]
        ]
      },
      flow: ["Base", "Chamada", "Negociação", "Comprovante", "Integração"],
      panelTitle: "O painel da recuperação.",
      panelText:
        "Campanhas, leads carregados, ligações com IA e SMS enviados em um só lugar, com o andamento de cada lote e o resultado de contato linha a linha.",
      panelCaptions: [
        "Campanhas ativas e progresso por lote",
        "Ligações atendidas, não atendidas e SMS",
        "Simulação de retorno para testar a régua"
      ],
      fit: "Cobrança · Recuperação de crédito · Financeiro · Backoffice",
      interest: "DDM Agente de Lembretes",
      ctaTitle: "Quer reduzir a inadimplência com voz automatizada?"
    },

    qualiddm: {
      slug: "qualiddm",
      tag: "MONITORIA COM IA",
      title: "QualiDDM",
      headline: ["Monitoria de todas as conversas,", "não de uma amostra."],
      lead: "Monitoria e auditoria de voz e chat com IA para qualidade, compliance e inteligência operacional em escala.",
      metaDescription:
        "QualiDDM: monitoria e auditoria de voz e chat com IA, com critérios consistentes, score por conversa e plano de melhoria para a operação.",
      image: "./assets/QUALIDDM.jpeg",
      primaryCta: { label: "Solicitar demonstração", href: "./index.html#contato" },
      solvesTitle: "Qualidade avaliada com critério e escala.",
      solves: [
        ["01", "Audite", "Avalie conversas com critérios consistentes e rastreáveis."],
        ["02", "Pontue", "Identifique padrões, riscos e aderência ao processo."],
        ["03", "Evolua", "Transforme a avaliação em plano de melhoria para o time."]
      ],
      showcase: {
        type: "score",
        kicker: "VEJA A IA TRABALHANDO",
        title: "Cada conversa vira critério, trecho e nota.",
        note: "Exemplo de leitura de uma conversa avaliada — critérios e trechos são configuráveis por operação.",
        criteria: [
          ["Saudação e identificação", "ok"],
          ["Confirmação de segurança", "ok"],
          ["Clareza da condição oferecida", "alerta"],
          ["Registro do desfecho", "ok"]
        ],
        snippets: [
          "\"Bom dia, aqui é da central de atendimento da DDM.\"",
          "\"Você confirma os dois primeiros dígitos do seu documento?\"",
          "\"A condição vale até o vencimento desta segunda-feira.\""
        ]
      },
      flow: ["Conversa", "Transcrição", "Critério", "Score", "Plano de ação"],
      panelTitle: "O painel de qualidade.",
      panelText:
        "Distribuição de notas, aderência por critério e evolução do time ao longo do período monitorado.",
      panelCaptions: [
        "Score por operador e por critério",
        "Trechos que sustentam cada avaliação",
        "Evolução da qualidade no período"
      ],
      fit: "Qualidade · Compliance · Atendimento · Operação",
      interest: "QualiDDM",
      ctaTitle: "Quer monitorar 100% das suas conversas?"
    },

    creator: {
      slug: "creator",
      tag: "CRIAÇÃO DE IMAGENS · IA",
      title: "Creator",
      headline: ["Peças no padrão da marca,", "sem fila de criação."],
      lead: "Criação de imagens com IA para campanhas, comunicação e produção visual alinhada à identidade da marca.",
      metaDescription:
        "Creator: geração de imagens com IA para campanhas e comunicação, com variações por formato e consistência com a identidade da marca.",
      image: "./assets/DDM CREATOR.png",
      primaryCta: { label: "Solicitar demonstração", href: "./index.html#contato" },
      solvesTitle: "Produção visual com velocidade e consistência.",
      solves: [
        ["01", "Crie", "Produza imagens e variações para campanhas em poucos minutos."],
        ["02", "Padronize", "Mantenha a identidade visual com orientação de marca."],
        ["03", "Escalone", "Acelere a produção para canais, peças e públicos diferentes."]
      ],
      showcase: {
        type: "gallery",
        kicker: "VEJA A IA TRABALHANDO",
        title: "Um briefing, vários formatos.",
        note: "Diagrama dos formatos gerados a partir de um mesmo briefing — as peças reais saem no padrão da sua marca.",
        prompt: "Campanha de renegociação · tom acolhedor · identidade DDM",
        formats: [
          ["Feed", "1080 × 1080"],
          ["Story", "1080 × 1920"],
          ["Banner", "1200 × 400"],
          ["Thumb", "640 × 360"]
        ]
      },
      flow: ["Briefing", "Geração", "Variações", "Ajustes", "Aprovação"],
      panelTitle: "O ambiente de criação.",
      panelText:
        "Briefing, referências de marca e variações lado a lado para escolher e ajustar antes de publicar.",
      panelCaptions: [
        "Briefing e referências de identidade",
        "Variações geradas para comparação",
        "Ajuste e exportação por formato"
      ],
      fit: "Marketing · Social Media · Comercial · Campanhas",
      interest: "DDM Creator",
      ctaTitle: "Quer acelerar a produção visual da sua marca?"
    },

    dashboard: {
      slug: "dashboard",
      tag: "DADOS & DASHBOARDS",
      title: "Dashboard Creator",
      headline: ["Da planilha crua", "ao painel executivo."],
      lead: "Transforme dados e planilhas em dashboards, KPIs e análises executivas orientadas ao negócio.",
      metaDescription:
        "Dashboard Creator: transforme planilhas e bases dispersas em dashboards, KPIs e leitura executiva orientada ao negócio.",
      image: "./assets/DASHBOARD CREATOR.jpeg",
      primaryCta: { label: "Solicitar demonstração", href: "./index.html#contato" },
      solvesTitle: "Dados mais claros para decisões mais rápidas.",
      solves: [
        ["01", "Organize", "Conecte informações dispersas em uma visão executiva."],
        ["02", "Visualize", "Acompanhe KPIs com painéis claros e objetivos."],
        ["03", "Decida", "Transforme planilhas e bases em leitura de negócio."]
      ],
      showcase: {
        type: "carousel",
        kicker: "VEJA A IA TRABALHANDO",
        title: "A mesma base, várias leituras.",
        note: "Esquema das visões geradas sobre a mesma base — o layout final acompanha os indicadores da sua operação.",
        views: [
          ["Visão executiva", "KPIs do período e comparativo com a meta", "kpi"],
          ["Funil", "Etapas da operação e onde o volume se perde", "funnel"],
          ["Comparativo", "Desempenho por campanha, time ou canal", "bars"],
          ["Evolução", "Série temporal do indicador principal", "line"]
        ]
      },
      flow: ["Dados", "Modelo", "Visão", "Dashboard", "Insight"],
      panelTitle: "O painel entregue.",
      panelText:
        "Indicadores consolidados, comparativos e recortes por período prontos para a reunião de gestão.",
      panelCaptions: [
        "KPIs consolidados do período",
        "Comparativos por campanha e canal",
        "Recortes prontos para apresentação"
      ],
      fit: "Gestão · Financeiro · Operação · Diretoria",
      interest: "DDM Dashboard Creator",
      ctaTitle: "Quer transformar suas planilhas em decisão?"
    },

    leads: {
      slug: "leads",
      tag: "COMERCIAL",
      title: "Extrator de Leads",
      headline: ["Lista qualificada,", "pronta para o time atacar."],
      lead: "Encontre, qualifique e enriqueça leads para acelerar a prospecção e aumentar a eficiência comercial.",
      metaDescription:
        "Extrator de Leads: encontre, qualifique e enriqueça leads com critérios comerciais para acelerar a prospecção do time.",
      image: "./assets/EXTRATOR DE LEADS.jpeg",
      primaryCta: { label: "Solicitar demonstração", href: "./index.html#contato" },
      solvesTitle: "Prospecção com mais foco e menos trabalho manual.",
      solves: [
        ["01", "Encontre", "Mapeie oportunidades com critérios comerciais definidos."],
        ["02", "Qualifique", "Organize leads por perfil, segmento e potencial."],
        ["03", "Acelere", "Entregue ao comercial bases úteis e acionáveis."]
      ],
      showcase: {
        type: "leads",
        kicker: "VEJA A IA TRABALHANDO",
        title: "Uma linha crua virando lead qualificado.",
        note: "Demonstração do enriquecimento campo a campo — os dados exibidos são fictícios.",
        columns: ["Empresa", "Segmento", "Porte", "Contato", "Score"],
        rows: [
          ["Transportes Aurora", "Logística", "Médio", "Diretoria comercial", "Alto"],
          ["Clínica Bem Viver", "Saúde", "Pequeno", "Gestão de atendimento", "Médio"],
          ["Móveis Castelo", "Varejo", "Médio", "Financeiro", "Alto"],
          ["Escola Horizonte", "Educação", "Pequeno", "Secretaria", "Médio"]
        ]
      },
      flow: ["Busca", "Extração", "Enriquecimento", "Qualificação", "Lista comercial"],
      panelTitle: "A base entregue ao comercial.",
      panelText:
        "Leads organizados por segmento, porte e potencial, com os campos que o time precisa para abordar.",
      panelCaptions: [
        "Filtros por segmento, porte e região",
        "Campos enriquecidos por lead",
        "Exportação direta para o time comercial"
      ],
      fit: "Comercial · SDR · Marketing · Prospecção",
      interest: "DDM Extrator de Leads",
      ctaTitle: "Quer entregar listas prontas para o seu comercial?"
    },

    crm: {
      slug: "crm",
      tag: "ATENDIMENTO",
      title: "Omni CRM",
      headline: ["Um só lugar", "para atendimento e gestão."],
      lead: "Centralize atendimento, WhatsApp, equipes, automações e gestão operacional em uma única plataforma.",
      metaDescription:
        "Omni CRM: centralize atendimento, WhatsApp, filas, equipes e automações em uma única plataforma com gestão de SLA e produtividade.",
      image: "./assets/OMNI CRM DDM.png",
      primaryCta: { label: "Solicitar demonstração", href: "./index.html#contato" },
      solvesTitle: "Atendimento centralizado para equipes e canais.",
      solves: [
        ["01", "Centralize", "Una conversas, histórico e filas em uma única operação."],
        ["02", "Automatize", "Reduza tarefas repetitivas com fluxos e regras."],
        ["03", "Gerencie", "Acompanhe equipe, SLA, status e produtividade."]
      ],
      showcase: {
        type: "queue",
        kicker: "VEJA A IA TRABALHANDO",
        title: "Conversas entrando e caminhando pela fila.",
        note: "Simulação do fluxo entre filas — os nomes e assuntos são fictícios.",
        columns: ["Entrada", "Em atendimento", "Resolvido"],
        tickets: [
          ["Marina R.", "Segunda via de boleto"],
          ["Carlos A.", "Negociação de débito"],
          ["Júlia P.", "Status do pedido"],
          ["Rafael M.", "Troca de titularidade"],
          ["Bianca L.", "Dúvida sobre contrato"]
        ]
      },
      flow: ["Canal", "Fila", "Atendimento", "Automação", "Gestão"],
      panelTitle: "O painel da operação de atendimento.",
      panelText:
        "Conversas por canal, distribuição entre equipes, SLA e produtividade em uma leitura só.",
      panelCaptions: [
        "Conversas por canal e por fila",
        "Distribuição e carga por equipe",
        "SLA, status e produtividade"
      ],
      fit: "Atendimento · WhatsApp · Equipes · Operação",
      interest: "DDM CRM",
      ctaTitle: "Quer centralizar o atendimento da sua operação?"
    },

    mail: {
      slug: "mail",
      tag: "AUTOMAÇÃO DE E-MAIL",
      title: "Mail IA",
      headline: ["Caixa de entrada", "que se resolve sozinha."],
      lead: "Automatize atendimento e backoffice por e-mail com IA, conhecimento corporativo e controle operacional.",
      metaDescription:
        "Mail IA: classificação e resposta automática de e-mails com IA e conhecimento corporativo, com controle de volume, prazos e gargalos.",
      image: "./assets/DDM BACKOFFICE.jpeg",
      primaryCta: { label: "Solicitar demonstração", href: "./index.html#contato" },
      solvesTitle: "E-mails tratados com contexto e padrão operacional.",
      solves: [
        ["01", "Classifique", "Organize demandas por assunto, prioridade e área responsável."],
        ["02", "Responda", "Apoie respostas com base no conhecimento corporativo."],
        ["03", "Controle", "Dê visibilidade ao volume, prazos e gargalos do backoffice."]
      ],
      showcase: {
        type: "mail",
        kicker: "VEJA A IA TRABALHANDO",
        title: "Do e-mail recebido à resposta pronta.",
        note: "Exemplo do caminho percorrido por uma mensagem — o conteúdo é fictício.",
        email: {
          from: "financeiro@clienteexemplo.com.br",
          subject: "Boleto de agosto não chegou",
          body: "Bom dia, não recebi o boleto deste mês e o vencimento é sexta. Conseguem reenviar?"
        },
        classification: [
          ["Assunto", "Segunda via de boleto"],
          ["Prioridade", "Alta — vence em 3 dias"],
          ["Área", "Financeiro"]
        ],
        reply:
          "Bom dia! Reenviei o boleto de agosto para este e-mail e mantive o vencimento de sexta-feira. Qualquer coisa, é só responder por aqui."
      },
      flow: ["Entrada", "Classificação", "Conhecimento", "Resposta", "Controle"],
      panelTitle: "O painel do backoffice.",
      panelText:
        "Volume por assunto, prazos em risco e gargalos por área, com o histórico de cada tratativa.",
      panelCaptions: [
        "Volume por assunto e por área",
        "Prazos em risco e reincidências",
        "Histórico completo da tratativa"
      ],
      fit: "Backoffice · Atendimento · Operação · E-mail",
      interest: "DDM Mail IA",
      ctaTitle: "Quer automatizar o e-mail do seu backoffice?"
    },

    labs: {
      slug: "labs",
      tag: "HUB CORPORATIVO DE IA",
      title: "DDM Labs",
      headline: ["Todos os agentes", "sob um mesmo acesso."],
      lead: "Plataforma integrada que centraliza agentes de IA, fluxos automatizados, dashboards analíticos e ferramentas digitais em um ecossistema único.",
      metaDescription:
        "DDM Labs: hub corporativo que centraliza agentes de IA, automações, dashboards e ferramentas digitais em um único ambiente.",
      image: "./assets/DDM LABS.png",
      primaryCta: { label: "Solicitar demonstração", href: "./index.html#contato" },
      solvesTitle: "IA e automação corporativa em um só ecossistema.",
      solves: [
        ["01", "Centralize", "Acesso unificado a agentes, automações e painéis analíticos."],
        ["02", "Aplique", "Ferramentas práticas para padronizar execuções e reduzir trabalho braçal."],
        ["03", "Escale", "Arquitetura modular que se integra aos processos existentes."]
      ],
      showcase: {
        type: "modules",
        kicker: "VEJA A IA TRABALHANDO",
        title: "Um hub, vários módulos acionáveis.",
        note: "Módulos ativados a partir de um mesmo acesso corporativo.",
        modules: [
          ["Agentes de voz", "Chamadas ativas e receptivas"],
          ["Automações", "Fluxos e regras de negócio"],
          ["Dashboards", "Indicadores da operação"],
          ["Monitoria", "Qualidade e compliance"],
          ["Criação", "Peças e conteúdo com IA"],
          ["Backoffice", "E-mail e tarefas internas"]
        ]
      },
      flow: ["Acesso", "Módulo", "Automação", "Dashboard", "Decisão"],
      panelTitle: "O hub por dentro.",
      panelText:
        "Cada módulo com seu próprio ambiente, sob um acesso corporativo único e governança central.",
      panelCaptions: [
        "Acesso e permissões por módulo",
        "Agentes e automações disponíveis",
        "Painéis analíticos integrados"
      ],
      fit: "Operação · Backoffice · Gestão · Times estratégicos",
      interest: "DDM Labs",
      ctaTitle: "Quer reunir a IA da sua empresa em um só lugar?"
    }
  };

  const order = [
    "callia",
    "whatsapp",
    "lembretes",
    "qualiddm",
    "creator",
    "dashboard",
    "leads",
    "crm",
    "mail",
    "labs"
  ];

  if (typeof module === "object" && module.exports) {
    module.exports = { products, order };
  } else {
    root.DDM_PRODUCTS = products;
    root.DDM_PRODUCT_ORDER = order;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
