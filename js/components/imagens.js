export function prepararImagens() {
  document.querySelectorAll('img[data-fallback-hidden]').forEach((imagem) => {
    imagem.addEventListener('error', () => {
      imagem.hidden = true;
    });
  });
}
