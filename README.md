# Portal da Comunidade | Ceará Científico

Portal educacional estático feito com HTML, CSS e JavaScript para GitHub Pages.

## Estrutura

```text
├── index.html
├── contato.html
├── pages/
│   ├── historia.html
│   ├── memoria.html
│   ├── agricola.html
│   ├── Plantação Nativa.html
│   └── Plantas Medicinais.html
├── css/
│   ├── estilo.css
│   └── responsivo.css
├── js/
│   ├── main.js
│   ├── components/
│   └── services/
├── data/
│   └── site.json
├── img/
│   ├── banner/
│   ├── galeria/
│   └── icones/
└── backend/
    └── exemplo-openai-proxy.js
```

## Como editar notícias, eventos e listas

Edite `data/site.json`.

Esse arquivo alimenta:
- notícias da página inicial
- eventos do mês
- dicas agrícolas
- cards de plantas nativas
- cards de plantas medicinais

## Como adicionar imagens

Os locais já estão prefixados no HTML. Basta salvar os arquivos nas pastas indicadas:

- `img/banner/banner-principal.jpg`
- `img/galeria/rolo-01.jpg`
- `img/galeria/rolo-02.jpg`
- `img/galeria/rolo-03.jpg`
- `img/galeria/rolo-04.jpg`
- `img/galeria/rolo-05.jpg`
- `img/galeria/historia-foto-antiga.jpg`
- `img/galeria/memoria-01.jpg`
- `img/galeria/memoria-02.jpg`
- `img/galeria/memoria-03.jpg`
- `img/galeria/agricola-01.jpg`

Enquanto as imagens não forem colocadas, o portal mostra caixas com o nome do arquivo esperado.

## Inteligência Artificial

O widget de IA já aparece no portal como protótipo. Para conectar IA real, não coloque chave de API no JavaScript do site.

Use um backend seguro como o exemplo em `backend/exemplo-openai-proxy.js`, publique em uma plataforma serverless e configure o endpoint conforme `js/config.example.js`.

Referência oficial usada: Responses API da OpenAI.
