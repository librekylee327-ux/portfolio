# Portfolio Renewal — Project Rules

## Overview

Kyle의 포트폴리오 사이트. Vanilla HTML/CSS/JS, 빌드 도구 없음. 단일 페이지(`index.html`).

**Identity:** Product Designer & Founder, based in Seoul  
**Contact:** librekylee327@gmail.com

---

## File Structure

```
/
├── index.html
├── css/
│   ├── reset.css        — box-sizing, margin/padding 초기화
│   ├── variables.css    — 모든 디자인 토큰 (색상, 타이포, 레이아웃, 애니메이션)
│   ├── typography.css   — body, .section-label 등 텍스트 기본값
│   ├── header.css       — fixed header, hamburger, mobile-nav drawer
│   ├── hero.css         — 전체화면 히어로, scroll-zoom, prev/next nav
│   ├── about.css        — About Me 섹션
│   ├── marquee.css      — Worked With 마키 섹션
│   └── responsive.css   — 반응형 오버라이드 (tablet ≤800px, mobile ≤480px)
├── js/
│   ├── nav.js           — 햄버거 메뉴 토글 (Escape, 외부 클릭 닫기 포함)
│   ├── marquee.js       — 마키 애니메이션
│   └── hero.js          — 스크롤 zoom (scale 1→1.25), Prev/Next stub
└── assets/
    └── images/
        ├── header-logo.svg
        ├── hero-laptop.png
        └── logos/       — coway, navien, classu, deltai (흰색 PNG)
```

---

## Design Tokens (`css/variables.css`)

모든 값은 여기서 관리. 직접 하드코딩 금지.

```css
/* Surfaces */
--color-bg:             #0d0d0d
--color-bg-hero:        #111111

/* Text hierarchy — contrast on #0d0d0d */
--color-fg:             #c0c0c0   /* 10.7:1 — primary text */
--color-fg-muted:       #808080   /*  4.9:1 — secondary labels (WCAG AA ✓) */
--color-fg-dim:         #484848   /*  2.5:1 — decorative only, not readable text */
--color-fg-overlay:     #e8e8e8   /* 13.7:1 — text on images / transparent header */

/* Borders */
--color-border:         rgba(255,255,255,0.10)
--color-border-strong:  rgba(255,255,255,0.16)

/* Layout */
--header-height:        52px
--container-max:        1440px
--pad-desktop:          10px    ← 섹션 좌우 수평 패딩 (desktop/tablet 공통)
--pad-tablet:           10px
--pad-mobile:           20px    ← 모바일(≤480px)에서 20px로 증가

/* Animation */
--marquee-duration:     32s
--ease-out:             cubic-bezier(0.16, 1, 0.3, 1)
--transition-fast:      120ms ease
--transition-base:      220ms ease
```

---

## Breakpoints (`css/responsive.css`)

Desktop-first 방식. 오버라이드는 반드시 `responsive.css`에.

| 이름 | 조건 | 주요 변화 |
|------|------|-----------|
| Tablet | `≤ 800px` | header padding → `--pad-tablet`, role 숨김 |
| Mobile | `≤ 480px` | header padding → `--pad-mobile`, nav 숨김, hamburger 표시 |

---

## Layout Rules

- **수평 패딩:** `--pad-desktop` / `--pad-tablet` / `--pad-mobile` 변수만 사용
- **최대 너비:** inner 컨테이너에 `max-width: var(--container-max)` + `margin: 0 auto`
- **Hero:** `height: 100vh`, 이미지 `object-fit: cover`, JS로 scroll zoom
- **섹션 구조:** `<section class="foo">` → `<div class="foo-inner">` 패턴 유지

---

## CSS Rules

- 새 섹션 추가 시 독립 CSS 파일 생성 후 `index.html`에 `<link>` 추가
- 반응형 오버라이드는 반드시 `responsive.css`의 해당 breakpoint 블록 안에
- 컴포넌트별 스타일을 `responsive.css`에 직접 쓰지 말 것 (오버라이드만)
- 색상/간격을 하드코딩하지 말고 variables를 사용할 것
- `z-index` 기준: header = 100

---

## JS Rules

- 모든 JS는 IIFE(`(function(){})()`)로 감싸 전역 오염 방지
- DOM 접근 전 null 체크 필수
- 스크롤/리사이즈 이벤트는 `requestAnimationFrame` + ticking 패턴으로 스로틀
- 이벤트 리스너에 `{ passive: true }` 옵션 적용 (스크롤 계열)

---

## Sections (현재 구현)

| 섹션 | ID/aria | 설명 |
|------|---------|------|
| Header | — | fixed, 투명, 히어로 위에 overlay |
| Hero | `#works` | 풀스크린 이미지 + scroll zoom + Prev/Next (stub) |
| About Me | `#about` | 2컬럼 그리드 (label + body) |
| Worked With | — | 로고 마키 (무한 루프) |

---

## Accessibility

- 모든 인터랙티브 요소에 `aria-label` 또는 텍스트 레이블 필수
- `aria-expanded` / `aria-hidden` 상태 JS에서 동기화
- 장식용 중복 이미지에 `aria-hidden="true"` (마키 중복 세트 등)
- 섹션에 `aria-label` 또는 `aria-labelledby` 적용

---

## What NOT to do

- `!important` 사용 금지
- 인라인 스타일 (`style=""`) 직접 작성 금지 (JS 애니메이션 제외)
- 새 breakpoint 임의 추가 금지 (800px / 480px 두 개만 유지)
- 빌드 도구, 프레임워크, npm 패키지 도입 금지
