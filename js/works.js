(function () {
  'use strict';

  var viewHome = document.getElementById('viewHome');
  var viewWorks = document.getElementById('viewWorks');

  if (!viewHome || !viewWorks) return;

  // ─── Count projects and sync all count labels ────────────────
  var count = viewWorks.querySelectorAll('.work-card').length;
  var pageCount = viewWorks.querySelector('.works-page-count');
  if (pageCount) pageCount.textContent = '(' + count + ')';
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
