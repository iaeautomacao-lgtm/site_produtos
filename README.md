# DDM AI Hub

Site de produtos DDM com hero em video, laboratorio visual de voz/chat e estrutura pronta para conectar Vapi.

## Arquivos principais

- `index.html`: estrutura da pagina
- `styles.css`: visual, responsividade e animacoes
- `app.js`: simulacao, chat visual e preparacao Vapi
- `assets/hero.mp4`: video de fundo
- `assets/logo-ddm.png`: logo DDM

## Configurar Vapi depois

No `app.js`, preencha somente a Public API Key e os assistants permitidos:

```js
const CONFIG = {
  vapi: {
    publicKey: "SUA_PUBLIC_KEY",
    assistants: {
      cobranca: "ASSISTANT_ID_COBRANCA",
      qualificacao: "ASSISTANT_ID_QUALIFICACAO",
      atendimento: "ASSISTANT_ID_ATENDIMENTO"
    }
  },
  sdkUrl: "https://esm.sh/@vapi-ai/web"
};
```

Nunca coloque Private API Key, OpenAI key, tokens de CRM, senhas ou credenciais de banco no frontend.

Na Vapi, restrinja a Public API Key ao dominio/origin do site e apenas aos assistants necessarios. Enquanto os campos estiverem vazios, o site usa a simulacao visual.
