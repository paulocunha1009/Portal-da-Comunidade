/**
 * Notícias ao vivo — Portal da Comunidade
 * Busca RSS via backend (Railway) — sem problema de CORS
 * Cache de 30 minutos no localStorage
 */
(function () {
  'use strict';

  var CACHE_KEY = 'portal_noticias_v2';
  var CACHE_MIN = 30;
  // Usa o mesmo endpoint configurado para a IA
  var BACKEND   = (window.PORTAL_AI_ENDPOINT || 'http://localhost:3001/api/assistente')
                    .replace('/api/assistente', '');

  // ── Utilitários ─────────────────────────────────────────────────────────────

  function formatarData(str) {
    if (!str) return '';
    var d = new Date(str + 'T12:00:00');
    if (isNaN(d)) return str;
    return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  // ── Renderização ─────────────────────────────────────────────────────────────

  function renderizar(noticias) {
    var container = document.querySelector('[data-render="noticias"]');
    if (!container) return;

    if (!noticias || !noticias.length) {
      container.innerHTML =
        '<p class="noticias-erro">Notícias temporariamente indisponíveis. Tente novamente em instantes.</p>';
      return;
    }

    container.innerHTML = noticias.map(function (n) {
      return [
        '<article class="card-noticia">',
        '  <div class="card-noticia__meta">',
        '    <span class="card-noticia__badge ' + n.classe + '">' + n.icone + ' ' + n.categoria + '</span>',
        '    <time datetime="' + n.data + '">' + formatarData(n.data) + '</time>',
        '  </div>',
        '  <h3 class="card-noticia__titulo">',
        '    <a href="' + n.link + '" target="_blank" rel="noopener noreferrer">' + n.titulo + '</a>',
        '  </h3>',
        '  <p class="card-noticia__resumo">' + n.resumo + '</p>',
        '</article>'
      ].join('');
    }).join('');
  }

  function renderizarSkeleton() {
    var container = document.querySelector('[data-render="noticias"]');
    if (!container) return;
    container.innerHTML = [1,2,3,4].map(function () {
      return [
        '<article class="card-noticia card-noticia--loading">',
        '  <div class="skeleton skeleton--badge"></div>',
        '  <div class="skeleton skeleton--titulo"></div>',
        '  <div class="skeleton skeleton--texto"></div>',
        '  <div class="skeleton skeleton--texto skeleton--curto"></div>',
        '</article>'
      ].join('');
    }).join('');
  }

  // ── Lógica principal ─────────────────────────────────────────────────────────

  function carregar() {
    // Tenta usar cache localStorage
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        var cache = JSON.parse(raw);
        if (Date.now() - cache.ts < CACHE_MIN * 60 * 1000 && cache.dados && cache.dados.length) {
          renderizar(cache.dados);
          return;
        }
      }
    } catch (e) { /* ignora */ }

    // Mostra skeleton enquanto carrega
    renderizarSkeleton();

    // Busca via backend (sem CORS)
    fetch(BACKEND + '/api/noticias')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var noticias = data.noticias || [];
        if (noticias.length) {
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), dados: noticias }));
          } catch (e) { /* ignora */ }
        }
        renderizar(noticias);
      })
      .catch(function () {
        renderizar([]);
      });
  }

  // Inicia após o DOM estar pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', carregar);
  } else {
    carregar();
  }

})();
