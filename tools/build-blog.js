#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const ORIGIN = 'https://leejaekyo.netlify.app';
const OG_IMAGE = ORIGIN + '/assets/images/OG%20Image.png'; // 공백은 반드시 인코딩

// posts.js 는 브라우저 파일(window.POSTS = [...]) — vm 샌드박스로 읽는다
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'js/posts.js'), 'utf8'), sandbox);

const posts = sandbox.window.POSTS || [];
if (!posts.length) {
  console.error('[build-blog] js/posts.js 에서 POSTS 를 읽지 못했다.');
  process.exit(1);
}

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// body(HTML 문자열)에서 태그를 걷어내 meta description 용 발췌를 만든다
const strip = (html) => String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

// '2026. 08. 14' -> '2026-08-14'
const iso = (d) => {
  const m = String(d).match(/(\d{4})\D+(\d{1,2})\D+(\d{1,2})/);
  return m ? `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}` : '';
};

// ── 헤더: index/about/blog 의 정적 마크업과 반드시 동일하게 유지 ──
const header = `  <header class="site-header" role="banner">
    <div class="header-inner">
      <a class="logo" href="/" aria-label="KYLE — Home">
        <img src="/assets/images/header-logo.svg" alt="KYLE" class="logo-img">
      </a>
      <nav class="header-nav" aria-label="Main navigation">
        <a href="/#works" class="nav-link">Works <span class="works-count"></span></a>
        <a href="/about" class="nav-link">About</a>
        <a href="/blog" class="nav-link nav-link--active">Blog</a>
      </nav>
      <div class="header-contact">
        <a href="mailto:librekylee327@gmail.com">librekylee327@gmail.com</a>
        <a href="tel:+821088358992">+(82) 10 - 8835 - 8992</a>
      </div>
      <div class="header-role">
        <span>Product Designer</span>
        <span>Founder</span>
      </div>
      <button class="hamburger" aria-label="Open menu" aria-expanded="false" aria-controls="mobileNav">
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>
    </div>
    <nav class="mobile-nav" id="mobileNav" aria-hidden="true" aria-label="Mobile navigation">
      <a href="/#works">Works <span class="works-count"></span></a>
      <a href="/about">About</a>
      <a href="/blog">Blog</a>
    </nav>
  </header>`;

function page(p) {
  const url = `${ORIGIN}/blog/${p.id}`;
  const desc = (p.excerpt && p.excerpt.trim()) || strip(p.body).slice(0, 155);
  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: p.title,
    description: desc,
    datePublished: iso(p.date),
    inLanguage: 'ko',
    mainEntityOfPage: url,
    image: OG_IMAGE,
    author: { '@type': 'Person', name: 'Lee Jaekyo', alternateName: 'KYLE', url: ORIGIN },
    publisher: { '@type': 'Person', name: 'Lee Jaekyo', url: ORIGIN }
  };

  // 본문이 한국어이므로 글 페이지는 lang="ko"
  return `<!DOCTYPE html>
<html lang="ko">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>${esc(p.title)} — KYLE</title>
  <meta name="description" content="${esc(desc)}">
  <link rel="canonical" href="${url}">
  <link rel="icon" type="image/png" href="/assets/images/favicon.png">
  <meta property="og:title" content="${esc(p.title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${OG_IMAGE}">
  <meta property="article:published_time" content="${iso(p.date)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(p.title)}">
  <meta name="twitter:description" content="${esc(desc)}">
  <meta name="twitter:image" content="${OG_IMAGE}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/reset.css">
  <link rel="stylesheet" href="/css/variables.css">
  <link rel="stylesheet" href="/css/typography.css">
  <link rel="stylesheet" href="/css/header.css">
  <link rel="stylesheet" href="/css/blog-page.css">
  <link rel="stylesheet" href="/css/responsive.css">
  <link rel="stylesheet" href="/css/cursor-light.css">
  <script type="application/ld+json">${JSON.stringify(jsonld)}</script>
</head>

<body>
  <div id="cursorLight" aria-hidden="true"></div>

${header}

  <main class="post-page">
    <div class="post-page-inner">
      <article class="post-article">
        <header class="post-header">
          <a class="post-back" href="/blog">&lsaquo; Back to Blog</a>
          <div class="post-meta">
            <span class="post-date">${esc(p.date)}</span>
            <span class="post-tag">${esc(p.tag)}</span>
          </div>
          <h1 class="post-title">${esc(p.title)}</h1>
        </header>
        <div class="post-body">${p.body}</div>
      </article>
    </div>
  </main>

  <script src="/js/header.js"></script>
  <script src="/js/cursor-light.js"></script>
</body>

</html>
`;
}

// ── 글 페이지 생성 ──
const outDir = path.join(ROOT, 'blog');
fs.mkdirSync(outDir, { recursive: true });
posts.forEach((p) => {
  fs.writeFileSync(path.join(outDir, `${p.id}.html`), page(p), 'utf8');
  console.log(`[build-blog] blog/${p.id}.html`);
});

// ── sitemap.xml 생성 ──
const today = new Date().toISOString().slice(0, 10);
const urls = [
  { loc: ORIGIN + '/', lastmod: today, priority: '1.0' },
  { loc: ORIGIN + '/about', lastmod: today, priority: '0.8' },
  { loc: ORIGIN + '/blog', lastmod: today, priority: '0.8' },
  ...posts.map((p) => ({ loc: `${ORIGIN}/blog/${p.id}`, lastmod: iso(p.date) || today, priority: '0.7' }))
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap, 'utf8');
console.log(`[build-blog] sitemap.xml (${urls.length} URLs)`);
