(function () {
  'use strict';

  var posts = window.POSTS || [];

  function byId(id) {
    return posts.filter(function (p) { return p.id === id; })[0];
  }

  function fill(root, post) {
    root.querySelector('.post-date').textContent = post.date;
    root.querySelector('.post-tag').textContent = post.tag;
    root.querySelector('.post-title').textContent = post.title;
    root.querySelector('.post-body').innerHTML = post.body;
  }

  // ─── Standalone post.html (직접 링크로 진입) ──────────────────
  var standalone = document.querySelector('.post-page .post-article');
  if (standalone) {
    var pid = new URLSearchParams(window.location.search).get('id');
    var post = byId(pid);
    if (!post) {
      var meta = standalone.querySelector('.post-meta');
      if (meta) meta.remove();
      standalone.querySelector('.post-title').textContent = 'Post not found';
      standalone.querySelector('.post-body').innerHTML = '';
      return;
    }
    fill(standalone, post);
    document.title = post.title + ' — KYLE';
    return;
  }

  // ─── Blog list (blog.html) — 카드 렌더 ────────────────────────
  var grid = document.querySelector('.bp-posts-grid');
  if (!grid) return;

  grid.innerHTML = posts.map(function (p) {
    return '<article class="bp-post-card">' +
      '<div class="bp-post-meta">' +
        '<span class="bp-post-date">' + p.date + '</span>' +
        '<span class="bp-post-tag">' + p.tag + '</span>' +
      '</div>' +
      '<h3 class="bp-post-title">' + p.title + '</h3>' +
      '<p class="bp-post-excerpt">' + p.excerpt + '</p>' +
      '<a href="/blog/' + encodeURIComponent(p.id) + '" class="bp-post-link">Read &rsaquo;</a>' +
    '</article>';
  }).join('');

  // ─── Post overlay layer — blog 위로 슬라이드업 ────────────────
  var layer = document.getElementById('postLayer');
  if (!layer) return;
  var root = document.documentElement;
  var suppressPop = false; // 우리가 부른 back 의 popstate 는 UI 토글 건너뜀

  function openPost(id, push) {
    var post = byId(id);
    if (!post) return;
    fill(layer, post);
    layer.scrollTop = 0;
    layer.classList.add('is-open');
    layer.setAttribute('aria-hidden', 'false');
    document.title = post.title + ' — KYLE';
    // URL 은 바꾸지 않고 히스토리 항목만 추가(모든 환경에서 안전).
    // 뒤로가기가 이 항목을 소비하며 오버레이만 닫히고, blog 를 건너뛰지 않는다.
    if (push) history.pushState({ postId: id }, '');
  }

  function closePost() {
    layer.classList.remove('is-open');
    layer.setAttribute('aria-hidden', 'true');
    document.title = 'Blog — KYLE';
  }

  // 닫기: 히스토리 깊이와 무관하게 즉시 UI 닫고, URL 은 뒤로 되돌린다
  function dismiss() {
    if (!layer.classList.contains('is-open')) return;
    closePost();
    if (history.state && history.state.postId) {
      suppressPop = true;
      history.back();
    }
  }

  // 카드 어디를 눌러도 오버레이 (일반 좌클릭만 가로챔; 새 탭 등은 그대로 이동)
  grid.addEventListener('click', function (e) {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var card = e.target.closest('.bp-post-card');
    if (!card) return;
    var link = card.querySelector('.bp-post-link');
    if (!link) return;
    e.preventDefault();
    openPost(decodeURIComponent(new URL(link.href).pathname.replace(/^\/blog\//, '')), true);
  });

  // Back to Blog / 닫기 버튼
  layer.addEventListener('click', function (e) {
    if (!e.target.closest('[data-close]')) return;
    e.preventDefault();
    dismiss();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') dismiss();
  });

  // 브라우저 뒤로/앞으로 만 여기서 처리
  window.addEventListener('popstate', function () {
    if (suppressPop) { suppressPop = false; return; }
    // URL 이 아니라 히스토리 상태로 판별 (오버레이 항목 = state.postId 보유)
    if (history.state && history.state.postId) openPost(history.state.postId, false);
    else closePost();
  });
})();
