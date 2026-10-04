(function () {
  'use strict';

  var viewHome = document.getElementById('viewHome');
  var viewWorks = document.getElementById('viewWorks');

  if (!viewHome || !viewWorks) return;

  // ─── Group counts: counted from the cards actually in each grid ─
  viewWorks.querySelectorAll('.works-page-count[data-count-for]').forEach(function (el) {
    var grid = document.getElementById(el.getAttribute('data-count-for'));
    if (grid) el.textContent = '(' + grid.children.length + ')';
  });

  // ─── Projects accordion: 줄을 누르면 설명·프로세스가 열린다 ──────
  // 여러 개를 함께 열어 비교할 수 있게 서로 닫지 않는다.
  viewWorks.querySelectorAll('.project-item-toggle').forEach(function (toggle) {
    var item = toggle.closest('.project-item');
    if (!item) return;
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      item.classList.toggle('is-open', open);
    });
  });

  // ─── Header total from single source (header.js) ─────────────
  var count = window.WORKS_COUNT;
  document.querySelectorAll('.works-count').forEach(function (el) {
    el.textContent = '(' + count + ')';
  });

  // ─── View switchers ──────────────────────────────────────────
  function showWorks() {
    viewHome.hidden = true;
    viewWorks.hidden = false;
    window.scrollTo(0, 0);
  }

  function showHome(scrollToAbout) {
    viewWorks.hidden = true;
    viewHome.hidden = false;
    if (scrollToAbout) {
      var target = document.getElementById('about');
      if (target) {
        requestAnimationFrame(function () {
          target.scrollIntoView({ behavior: 'smooth' });
        });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }

  // ─── Nav: Works ──────────────────────────────────────────────
  document.querySelectorAll('a[href="#works"], a[href="index.html#works"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      showWorks();
      history.pushState(null, '', '#works');
    });
  });

  // ─── Nav: About ──────────────────────────────────────────────
  document.querySelectorAll('a[href="#about"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      if (!viewWorks.hidden) {
        history.pushState(null, '', '#about');
        showHome(true);
      } else {
        var target = document.getElementById('about');
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ─── Logo → home ─────────────────────────────────────────────
  var logoLink = document.querySelector('.logo');
  if (logoLink) {
    logoLink.addEventListener('click', function (e) {
      if (!viewWorks.hidden) {
        e.preventDefault();
        history.pushState(null, '', window.location.pathname);
        showHome(false);
      }
    });
  }

  // ─── Handle initial hash (direct URL / page reload) ──────────
  if (window.location.hash === '#works') {
    showWorks();
  }

  // ─── Browser back / forward ──────────────────────────────────
  window.addEventListener('popstate', function () {
    if (window.location.hash === '#works') {
      showWorks();
    } else {
      showHome(window.location.hash === '#about');
    }
  });
})();
