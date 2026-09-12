# Implantação de teste na Vercel

Este procedimento cria a API de teste sem alterar o endereço usado pelo portal público.

## Decisões registradas

- frontend permanece no GitHub Pages;
- projeto Vercel: `fabcampo-api`;
- repositório: `paulocunha1009/fabcampo`;
- diretório raiz na Vercel: `backend`;
- branch de produção da API: `main`;
- modelo inicial: `gemini-2.5-flash-lite`;
- planos gratuitos, sem aumento automático pago;
- Upstash Redis para limites persistentes;
- conversas não são armazenadas;
- o portal só muda de API depois de aprovação final.

## 1. Importar o projeto

1. Na Vercel, escolha **Add New > Project**.
2. Importe `paulocunha1009/fabcampo`.
3. Use o nome `fabcampo-api`.
4. Configure **Root Directory** como `backend`.
5. Configure **Production Branch** como `main`.
6. Não altere os dois projetos Vercel já existentes.

## 2. Criar o banco gratuito Upstash

Crie ou conecte um banco Redis gratuito pelo Marketplace/Integrações da Vercel. Com o prefixo usado neste projeto, a integração cria:

```text
UPSTASH_REDIS_REST_KV_REST_API_URL
UPSTASH_REDIS_REST_KV_REST_API_TOKEN
```

O backend também aceita os nomes padrão `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN`.

Não copie esses valores para o GitHub, documentos ou mensagens.

## 3. Variáveis de ambiente

Cadastre nos ambientes Production e Preview:

```text
GEMINI_API_KEY=<cadastrar diretamente no painel>
GEMINI_MODEL=gemini-2.5-flash-lite
MAX_TOKENS=1000
RATE_LIMIT_PER_IP_MIN=30
RATE_LIMIT_GLOBAL_MIN=10
RATE_LIMIT_GLOBAL_DAY=200
RATE_LIMIT_PREFIX=campo-digital
RATE_LIMIT_SALT=<texto aleatório longo e privado>
REQUIRE_PERSISTENT_RATE_LIMIT=true
ALLOWED_ORIGINS=https://fabcampo.com.br,https://www.fabcampo.com.br
```

Não habilite upgrade automático ou plano pago.

## 4. Testes antes de conectar o portal

- `/health` responde `200`, com `ok: true`, `aiConfigured: true` e `limiter: "upstash"`;
- origem não autorizada é bloqueada;
- `/api/assistente` responde em português;
- `/api/atividade` devolve texto baseado no material enviado;
- `/api/noticias` devolve uma lista ou uma lista vazia válida;
- nenhuma chave aparece no navegador ou no repositório;
- a 11ª solicitação no mesmo minuto recebe `429`;
- o portal usa atividades locais quando a API retorna `429` ou `503`.

## 5. Troca futura, somente após aprovação

Depois dos testes e de um novo backup, altere apenas `js/config.js` para o endereço de teste aprovado. O domínio `api.fabcampo.com.br` fica para uma etapa posterior e não é necessário para operar gratuitamente.

## Reversão

Enquanto `js/config.js` não for alterado, a nova API não afeta o site. Depois da conexão, basta restaurar a URL anterior nesse arquivo e publicar novamente os branches `main` e `master`.
