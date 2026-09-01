# DDM AI Hub

Site de produtos DDM com hero em video, laboratorio visual de voz/chat e estrutura pronta para conectar Vapi.

## Arquivos principais

- `index.html`: estrutura da pagina
- `styles.css`: visual, responsividade e animacoes
- `app.js`: simulacao, chat visual, filtro de produtos e preparacao Vapi
- `produtos.data.js`: conteudo das paginas de produto (fonte unica)
- `build-produtos.mjs`: gera `produto-<slug>.html` a partir do arquivo acima
- `produto-*.html`: paginas geradas, uma por produto (nao editar a mao)
- `produto.js`: animacoes dos modulos "Veja a IA trabalhando"
- `produto.html`: redirect de compatibilidade para links antigos
- `assets/hero.mp4`: video de fundo
- `assets/logo-ddm.png`: logo DDM

## Paginas de produto

O conteudo fica em `produtos.data.js`. Depois de editar, regere as paginas:

```sh
node build-produtos.mjs
```

As paginas sao estaticas de proposito: o conteudo precisa estar no HTML para
crawlers, previas de link e leitores sem JS. Nao edite `produto-*.html` na mao,
porque o proximo build sobrescreve.

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
