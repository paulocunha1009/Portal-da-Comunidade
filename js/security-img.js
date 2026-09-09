document.querySelectorAll('img').forEach(function (img) {
    img.addEventListener('error', function () {
        var bloco = img.closest('figure') || img.parentElement;
        bloco.style.display = 'none';
    });
});


