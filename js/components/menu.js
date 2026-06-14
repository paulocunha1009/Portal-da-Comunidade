export function iniciarMenu() {
  const botao = document.querySelector('.botao-menu');
  const menu = document.querySelector('#menu-principal');

  if (!botao || !menu) return;
  marcarPaginaAtual(menu);

  const fecharMenu = () => {
    botao.setAttribute('aria-expanded', 'false');
    menu.dataset.open = 'false';
    document.body.classList.remove('menu-aberto');
    fecharSubmenus(menu);
  };

  botao.addEventListener('click', () => {
    const aberto = botao.getAttribute('aria-expanded') === 'true';
    botao.setAttribute('aria-expanded', String(!aberto));
    menu.dataset.open = String(!aberto);
    document.body.classList.toggle('menu-aberto', !aberto);
  });

  menu.addEventListener('click', (evento) => {
    const botaoSubmenu = evento.target.closest('.menu__botao-submenu');

    if (botaoSubmenu) {
      const aberto = botaoSubmenu.getAttribute('aria-expanded') === 'true';
      fecharSubmenus(menu);
      botaoSubmenu.setAttribute('aria-expanded', String(!aberto));
      botaoSubmenu.closest('.menu__grupo')?.classList.toggle('menu__grupo--aberto', !aberto);
      return;
    }

    if (evento.target.closest('a')) fecharMenu();
  });

  window.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape') fecharMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 980) fecharMenu();
  });
}

function fecharSubmenus(menu) {
  menu.querySelectorAll('.menu__botao-submenu').forEach((botao) => {
    botao.setAttribute('aria-expanded', 'false');
  });

  menu.querySelectorAll('.menu__grupo--aberto').forEach((grupo) => {
    grupo.classList.remove('menu__grupo--aberto');
  });
}

function marcarPaginaAtual(menu) {
  const caminhoAtual = normalizarCaminho(window.location.pathname);
  const pageAtual = document.body.dataset.page;

  menu.querySelectorAll('a').forEach((link) => {
    const href = link.getAttribute('href');
    const pageLink = link.dataset.pageLink;
    const correspondePage = pageAtual && pageLink === pageAtual;
    const correspondeHref = href && caminhoAtual.endsWith(normalizarCaminho(href));

    if (correspondePage || correspondeHref) {
      link.setAttribute('aria-current', 'page');
      link.closest('.menu__grupo')?.classList.add('menu__grupo--ativo');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

function normalizarCaminho(caminho) {
  return decodeURIComponent(caminho)
    .replaceAll('\\', '/')
    .replace('../', '')
    .replace('./', '')
    .toLowerCase();
}
