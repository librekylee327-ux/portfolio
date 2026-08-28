(function () {
  'use strict';

  // 프로젝트 개수 단일 소스. 카드 추가/삭제 시 여기만 갱신.
  window.WORKS_COUNT = 8;

  // 헤더 마크업은 각 HTML 에 정적으로 박혀 있다. 숫자만 여기서 채운다.
  document.querySelectorAll('.works-count').forEach(function (el) {
    el.textContent = '(' + window.WORKS_COUNT + ')';
  });

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
