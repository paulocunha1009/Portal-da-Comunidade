const caminhoDados = new URL('../../data/site.json', import.meta.url);

export async function carregarConteudo() {
  try {
    const resposta = await fetch(caminhoDados);
    if (!resposta.ok) throw new Error('Conteúdo não encontrado.');

    const dados = await resposta.json();
    renderizarNoticias(dados.noticias ?? []);
    renderizarEventos(dados.eventos ?? []);
    renderizarLista('[data-render="dicas-agricolas"]', dados.dicasAgricolas ?? []);
    renderizarCardsDados('[data-render="plantas-nativas"]', dados.plantasNativas ?? []);
    renderizarCardsDados('[data-render="plantas-medicinais"]', dados.plantasMedicinais ?? []);
  } catch (erro) {
    console.warn('Não foi possível carregar data/site.json:', erro);
  }
}

function renderizarNoticias(noticias) {
  const destino = document.querySelector('[data-render="noticias"]');
  if (!destino) return;

  destino.innerHTML = noticias.map((noticia) => `
    <article>
      <time datetime="${noticia.data}">${formatarData(noticia.data)}</time>
      <h3>${escapar(noticia.titulo)}</h3>
      <p>${escapar(noticia.resumo)}</p>
    </article>
  `).join('');
}

function renderizarEventos(eventos) {
  const destino = document.querySelector('[data-render="eventos"]');
  if (!destino) return;

  destino.innerHTML = eventos.map((evento) => `
    <div class="evento">
      <strong>${escapar(evento.nome)}</strong>
      <time datetime="${evento.data}">${formatarData(evento.data)}</time>
      <p>${escapar(evento.descricao)}</p>
    </div>
  `).join('');
}

function renderizarLista(seletor, itens) {
  const destino = document.querySelector(seletor);
  if (!destino || !itens.length) return;
  destino.innerHTML = itens.map((item) => `<li>${escapar(item)}</li>`).join('');
}

function renderizarCardsDados(seletor, itens) {
  const destino = document.querySelector(seletor);
  if (!destino) return;

  destino.innerHTML = itens.map((item) => `
    <article>
      <h3>${escapar(item.nome)}</h3>
      <p>${escapar(item.descricao)}</p>
    </article>
  `).join('');
}

function formatarData(dataISO) {
  const data = new Date(`${dataISO}T12:00:00`);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(data);
}

function escapar(texto) {
  return String(texto)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
