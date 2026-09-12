# Decisões da implantação da API na Vercel

Registro das decisões tomadas com a equipe em 12 de setembro de 2026.

1. O frontend permanece no GitHub Pages e o backend será implantado na Vercel.
2. Foi criado um terceiro projeto Vercel, inicialmente chamado `portal-comunidade-api` e posteriormente padronizado como `fabcampo-api`, sem alterar os dois projetos existentes.
3. O portal público utiliza `https://fabcampo-api.vercel.app` como backend, mantendo os recursos locais de contingência.
4. O provedor inicial de IA será o Google Gemini, usando primeiro a chave já existente.
5. Catálogo, Expedição e Assistente terão contingência local automática.
6. Upstash Redis será usado para controle persistente; outra solução poderá substituí-lo se necessário.
7. A capacidade esperada é de até 40 pessoas simultâneas.
8. Limites iniciais: 30/min por IP, 10/min global e 200/dia global.
9. O modelo inicial será `gemini-2.5-flash-lite`, configurável pelo painel.
10. O primeiro teste usará o domínio gratuito `*.vercel.app`; `api.fabcampo.com.br` fica para depois.
11. Frontend e backend permanecem no mesmo repositório, com `backend` como raiz do projeto Vercel.
12. A Vercel publicará a API pelo branch `main`; o GitHub Pages continua em `master` por enquanto.
13. Assistente, atividades, notícias e health check serão migrados juntos.
14. As notícias locais de `data/site.json` permanecem como contingência.
15. Conversas não serão armazenadas e o assistente não solicitará dados pessoais.
16. O assistente terá escopo educacional e proteções para saúde e conteúdo impróprio.
17. O portal só será conectado à nova API depois dos testes, backup e autorização final.
18. Nenhuma evolução poderá gerar cobrança sem nova decisão da equipe.

## Estado desta etapa

A API foi validada com Gemini e Upstash antes da troca. Após a autorização final, `js/config.js` passou a apontar para `https://fabcampo-api.vercel.app/api/assistente`.
