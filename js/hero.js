(function () {
  const slides  = Array.from(document.querySelectorAll('.hero-slide'));
  const ZOOM_MS = 4000;
  const FADE_MS = 2000;
  const OVERLAP = 600;

  let current = 0;
  let timer   = null;
  let busy    = false;

  function resetSlide(slide) {
    slide.style.transition = 'none';
    slide.classList.remove('hero-slide--zoomed');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        slide.style.transition = '';
      });
    });
  }

  function scheduleAdvance(fromIndex) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(function () {
      goTo((fromIndex + 1) % slides.length);
    }, ZOOM_MS - OVERLAP);
  }

  function goTo(nextIndex) {
    if (busy) return;
    busy = true;

    const outSlide = slides[current];
    const inSlide  = slides[nextIndex];

    inSlide.classList.add('hero-slide--active');
    requestAnimationFrame(function () {
      inSlide.classList.add('hero-slide--zoomed');
    });

    outSlide.classList.remove('hero-slide--active');
    current = nextIndex;
    scheduleAdvance(current);

    // Release lock after overlap so rapid clicks feel responsive
    setTimeout(function () { busy = false; }, OVERLAP);
    setTimeout(function () { resetSlide(outSlide); }, FADE_MS);
  }

  // ─── Init first slide ────────────────────────────────────────
  if (slides.length > 0) {
    slides[0].classList.add('hero-slide--active');
    requestAnimationFrame(function () {
      slides[0].classList.add('hero-slide--zoomed');
    });
    scheduleAdvance(0);
  }

  // ─── Prev / Next ─────────────────────────────────────────────
  const prevBtn = document.querySelector('.hero-nav--prev');
  const nextBtn = document.querySelector('.hero-nav--next');

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', function () {
      if (timer) clearTimeout(timer);
      goTo((current - 1 + slides.length) % slides.length);
    });

    nextBtn.addEventListener('click', function () {
      if (timer) clearTimeout(timer);
      goTo((current + 1) % slides.length);
    });
  }
})();
