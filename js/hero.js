(function () {
  const slides  = Array.from(document.querySelectorAll('.hero-slide'));
  const ZOOM_MS = 4000;
  const FADE_MS = 2000;
  const OVERLAP = 600;

  let current = 0;
  let timer   = null;
  let busy    = false;

  // Pending reset timers, tracked per slide so a slide that becomes active
  // again (via Prev/Next) can cancel its own stale reset before it fires.
  const resetTimers = new Array(slides.length).fill(null);

  function resetSlide(slide) {
    // Guard: never strip the zoom from a slide that is active again.
    if (slide.classList.contains('hero-slide--active')) return;
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

    const outIndex = current;
    const outSlide = slides[outIndex];
    const inSlide  = slides[nextIndex];

    // Cancel any pending reset for the incoming slide so it keeps its zoom.
    if (resetTimers[nextIndex]) {
      clearTimeout(resetTimers[nextIndex]);
      resetTimers[nextIndex] = null;
    }

    inSlide.classList.add('hero-slide--active');
    requestAnimationFrame(function () {
      inSlide.classList.add('hero-slide--zoomed');
    });

    outSlide.classList.remove('hero-slide--active');
    current = nextIndex;
    scheduleAdvance(current);

    // Release lock after overlap so rapid clicks feel responsive
    setTimeout(function () { busy = false; }, OVERLAP);
    if (resetTimers[outIndex]) clearTimeout(resetTimers[outIndex]);
    resetTimers[outIndex] = setTimeout(function () {
      resetTimers[outIndex] = null;
      resetSlide(outSlide);
    }, FADE_MS);
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
      goTo((current - 1 + slides.length) % slides.length);
    });

    nextBtn.addEventListener('click', function () {
      goTo((current + 1) % slides.length);
    });
  }
})();
