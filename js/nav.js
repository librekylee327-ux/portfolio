(function () {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.getElementById('mobileNav');

  if (!hamburger || !mobileNav) return;

  function openMenu() {
    hamburger.setAttribute('aria-expanded', 'true');
    mobileNav.setAttribute('aria-hidden', 'false');
    mobileNav.classList.add('mobile-nav--open');
  }

  function closeMenu() {
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
    mobileNav.classList.remove('mobile-nav--open');
  }

  function toggleMenu() {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  }

  hamburger.addEventListener('click', toggleMenu);

  // Close when a nav link is tapped
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  // Close when clicking outside
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
      closeMenu();
    }
  });
})();
