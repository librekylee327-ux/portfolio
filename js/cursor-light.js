(function () {
  var overlay = document.getElementById('cursorLight');
  if (!overlay) return;
  if (window.matchMedia('(hover: none)').matches) return;

  var ticking = false;
  var mx = -9999;
  var my = -9999;

  document.addEventListener('mousemove', function (e) {
    mx = e.clientX;
    my = e.clientY;
    if (!ticking) {
      requestAnimationFrame(function () {
        overlay.style.setProperty('--mx', mx + 'px');
        overlay.style.setProperty('--my', my + 'px');
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  document.addEventListener('mouseleave', function () {
    overlay.classList.remove('is-active');
  });

  document.addEventListener('mouseenter', function () {
    overlay.classList.add('is-active');
  });
})();
