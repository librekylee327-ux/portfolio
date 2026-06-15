(function () {
  'use strict';

  var path = window.location.pathname;
  var isHome = !path.endsWith('about.html') && !path.endsWith('blog.html');
  var worksHref = isHome ? '#works' : 'index.html#works';

  var headerHTML = '<header class="site-header" role="banner">' +
    '<div class="header-inner">' +
      '<a class="logo" href="index.html" aria-label="KYLE — Home">' +
        '<img src="assets/images/header-logo.svg" alt="KYLE" class="logo-img">' +
      '</a>' +
      '<nav class="header-nav" aria-label="Main navigation">' +
        '<a href="' + worksHref + '" class="nav-link">Works <span class="works-count">(7)</span></a>' +
        '<a href="about.html" class="nav-link">About</a>' +
        '<a href="blog.html" class="nav-link">Blog</a>' +
      '</nav>' +
      '<div class="header-contact">' +
        '<a href="mailto:librekylee327@gmail.com">librekylee327@gmail.com</a>' +
        '<a href="tel:+821088358992">+(82) 10 - 8835 - 8992</a>' +
      '</div>' +
      '<div class="header-role">' +
        '<span>Product Designer</span>' +
        '<span>Founder</span>' +
      '</div>' +
      '<button class="hamburger" aria-label="Open menu" aria-expanded="false" aria-controls="mobileNav">' +
        '<span class="hamburger-line"></span>' +
        '<span class="hamburger-line"></span>' +
        '<span class="hamburger-line"></span>' +
      '</button>' +
    '</div>' +
    '<nav class="mobile-nav" id="mobileNav" aria-hidden="true" aria-label="Mobile navigation">' +
      '<a href="' + worksHref + '">Works <span class="works-count">(7)</span></a>' +
      '<a href="about.html">About</a>' +
      '<a href="blog.html">Blog</a>' +
    '</nav>' +
  '</header>';

  var placeholder = document.getElementById('header-placeholder');
  if (placeholder) {
    placeholder.outerHTML = headerHTML;
  }

  // Mark active page in nav
  var activePage = path.endsWith('about.html') ? 'about.html'
    : path.endsWith('blog.html') ? 'blog.html'
    : null;

  if (activePage) {
    document.querySelectorAll('.nav-link').forEach(function (link) {
      if (link.getAttribute('href') === activePage) {
        link.classList.add('nav-link--active');
      }
    });
  }

  // Hamburger
  var hamburger = document.querySelector('.hamburger');
  var mobileNav = document.getElementById('mobileNav');

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

  hamburger.addEventListener('click', function () {
    var isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  });

  mobileNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  document.addEventListener('click', function (e) {
    if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
      closeMenu();
    }
  });
})();
