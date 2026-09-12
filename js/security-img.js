document.querySelectorAll('img').forEach(function (img) {
  img.addEventListener('error', function () {
    var bloco = img.closest('figure') || img.parentElement;
    if (bloco) bloco.hidden = true;
  }, { once: true });

  if (img.complete && img.naturalWidth === 0) {
    img.dispatchEvent(new Event('error'));
  }
});
