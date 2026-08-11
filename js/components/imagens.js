export function prepararImagens() {
  document.querySelectorAll('img[data-fallback-hidden]').forEach((imagem) => {
    const marcarCarregada = () => {
      imagem.closest('[data-image-placeholder]')?.classList.add('imagem-carregada');
    };

    if (imagem.complete && imagem.naturalWidth > 0) {
      marcarCarregada();
    } else {
      imagem.addEventListener('load', marcarCarregada, { once: true });
    }

    imagem.addEventListener('error', () => {
      imagem.closest('[data-image-placeholder]')?.classList.remove('imagem-carregada');
      imagem.hidden = true;
    });
  });
}
