/**
 * Fallback global para imagens que não puderem ser carregadas.
 * Mantém a página limpa escondendo a figura completa ou o contêiner imediato.
 */
document.querySelectorAll('img').forEach(function (imagem) {
  function esconderImagem() {
    const bloco = imagem.closest('figure') || imagem.parentElement;
    if (bloco) bloco.hidden = true;
  }

  imagem.addEventListener('error', esconderImagem, { once: true });

  // Também cobre imagens que falharam antes de este script ser executado.
  if (imagem.complete && imagem.naturalWidth === 0) esconderImagem();
});
