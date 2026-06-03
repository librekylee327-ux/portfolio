(function () {
  const track = document.getElementById('marqueeTrack');
  if (!track) return;

  // Respect reduced-motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function applyMotionPreference() {
    track.style.animationPlayState = prefersReducedMotion.matches ? 'paused' : 'running';
  }

  applyMotionPreference();
  prefersReducedMotion.addEventListener('change', applyMotionPreference);
})();
