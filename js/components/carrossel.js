export function iniciarCarrosseis() {
  document.querySelectorAll('[data-carousel] .rolo-fotos__trilha').forEach((trilha) => {
    if (trilha.dataset.preparado === 'true') return;

    const fotos = Array.from(trilha.children);
    fotos.forEach((foto) => trilha.appendChild(foto.cloneNode(true)));
    trilha.dataset.preparado = 'true';
  });
}
