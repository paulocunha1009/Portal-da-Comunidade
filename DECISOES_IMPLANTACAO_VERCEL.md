# Decisões da implantação da API na Vercel

Registro das decisões tomadas com a equipe em 12 de setembro de 2026.

1. O frontend permanece no GitHub Pages e o backend será implantado na Vercel.
2. Foi criado um terceiro projeto Vercel, inicialmente chamado `portal-comunidade-api` e posteriormente padronizado como `fabcampo-api`, sem alterar os dois projetos existentes.
3. O provedor inicial de IA será o Google Gemini, usando primeiro a chave já existente.
4. Catálogo, Expedição e Assistente terão contingência local automática.
5. Upstash Redis será usado para controle persistente; outra solução poderá substituí-lo se necessário.
6. A capacidade esperada é de até 40 pessoas simultâneas.
7. Limites iniciais: 30/min por IP, 10/min global e 200/dia global.
8. O modelo inicial será `gemini-2.5-flash-lite`, configurável pelo painel.
9. O primeiro teste usará o domínio gratuito `*.vercel.app`; `api.fabcampo.com.br` fica para depois.
10. Frontend e backend permanecem no mesmo repositório, com `backend` como raiz do projeto Vercel.
11. A Vercel publicará a API pelo branch `main`; o GitHub Pages continua em `master` por enquanto.
12. Assistente, atividades, notícias e health check serão migrados juntos.
13. As notícias locais de `data/site.json` permanecem como contingência.
14. Conversas não serão armazenadas e o assistente não solicitará dados pessoais.
15. O assistente terá escopo educacional e proteções para saúde e conteúdo impróprio.
16. O portal só será conectado à nova API depois dos testes, backup e autorização final.
17. Nenhuma evolução poderá gerar cobrança sem nova decisão da equipe.

## Estado desta etapa

A Sprint 1 prepara o código e a documentação. O endereço em `js/config.js` não será trocado nesta etapa, portanto o portal publicado não será afetado pela API de teste.
