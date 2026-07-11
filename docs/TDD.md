# Portfolio TDD (Technical Design Document)

Implements [PRD.md](./PRD.md). This document fixes the things the PRD explicitly left open in §10: stack, typography, animation approach, component/data architecture, and the no-scroll layout mechanism.

## 1. Scope

Covers the single-screen flip-card site: front, flip interaction, back (categories + skills + contact), category → project swap. Copywriting/content and final visual design (color, spacing) are out of scope here — this is the engineering plan.

## 2. Tech stack

| Concern | Choice | Why |
|---|---|---|
| Framework | React 19 + TypeScript (existing scaffold) | Already in place, no change. |
| Build | Vite (existing scaffold) | Already in place, no change. |
| Styling | **Tailwind CSS** | Utility classes keep layout/typography/responsive rules colocated with markup, which matters for a single fixed-size component tree where every element's sizing has to be tuned together to satisfy the no-scroll constraint (§4). |
| Animation | **Framer Motion** (`motion` package) | Declarative 3D flip via `rotateY` transforms, `AnimatePresence` for the category/project swap, built-in `prefers-reduced-motion` support via `useReducedMotion`. Avoids hand-rolled CSS transition/keyframe juggling for two distinct animated regions (card flip, content swap). |
| Fonts | **JetBrains Mono** (name/headline) + **Inter** (everything smaller), via **Google Fonts** | See §3. |
| Linting | ESLint (existing scaffold) | No change. |
| Package manager | npm (existing `package-lock.json`) | No change. |

New dependencies to add:
```
npm install motion
npm install -D tailwindcss @tailwindcss/vite
```
(`motion` is the current package name for Framer Motion; `framer-motion` still works as an alias but `motion` is the actively maintained import going forward. Tailwind v4's Vite plugin is used instead of the old PostCSS config route, since the project already runs on Vite.)

No router, no state library — the whole site is one screen with local component state, so pulling in Redux/Zustand/React Router would be unjustified weight.

## 3. Typography

### 3.1 Assignment

| Use | Font | Elements |
|---|---|---|
| Name / headline | **JetBrains Mono** | Card name (`.card-name`), the positioning headline on the front (§5 of PRD) |
| Everything else | **Inter** | Title/role line, one-line bio, category tags, skill keyword row, project title/problem/decision/outcome text, contact CTA link, flip-hint text |

Rationale: JetBrains Mono on the name/headline gives the card an "identity/ID-badge, engineered" feel that reinforces the software-engineer positioning without turning the whole card into a code block. Inter carries all reading-density text because it's built for small-size legibility, which matters since the layout is fixed-height and can't grow to accommodate a less compact face.

### 3.2 Loading strategy

Load both families from **Google Fonts** via a `<link>` in `index.html` (simplest path, no local font-package management):

```html
<!-- index.html, inside <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap"
  rel="stylesheet"
/>
```

Only the weights actually used are requested (Inter 400/500/600, JetBrains Mono 500/700) to keep the request payload small. `display=swap` avoids invisible-text blocking on first paint; a brief system-font flash is acceptable for a one-screen static card.

### 3.3 Tailwind theme wiring

Register both families as Tailwind theme tokens (Tailwind v4 CSS-first config, in `src/index.css`):

```css
@import "tailwindcss";

@theme {
  --font-headline: 'JetBrains Mono', ui-monospace, Consolas, monospace;
  --font-body: 'Inter', system-ui, 'Segoe UI', Roboto, sans-serif;
}
```

This exposes `font-headline` and `font-body` as Tailwind utility classes (e.g. `<h1 className="font-headline">`), so every element pulls from exactly one of two fonts via a class name — no ad hoc third font sneaks in later, and no hand-written CSS selectors are needed for typography.

## 4. Layout: the no-scroll constraint

The PRD's hardest constraint is zero page scrolling on any viewport (§2, §8). Mechanism:

- Root container sized with Tailwind's `h-svh` (small viewport height) instead of `h-screen`/`100vh`, so mobile browser chrome (address bar show/hide) never triggers a scrollbar or clipped content.
- The card itself uses fluid sizing — Tailwind arbitrary values with `clamp()` (e.g. `text-[clamp(0.75rem,2vw,1rem)]`) for font sizes and card dimensions — so it scales continuously between mobile and desktop instead of jumping at breakpoints. Content that must "fit or be cut" (PRD §7.5) needs continuous scaling, not just two fixed layouts.
- `overflow-hidden` on the root container as a hard backstop — if content doesn't fit, that's a content-authoring bug to fix (cut copy per PRD §7.5), not something CSS should silently allow to scroll.
- No component in the tree renders anything outside the card's fixed box — the category/project swap replaces content in place (PRD §6.4), it never appends or grows the container.

Verification: manual check at 320px width (smallest common mobile), 768px (tablet), 1440px (desktop) with browser dev tools device toolbar, confirming no scrollbar appears and no text is clipped.

## 5. Component architecture

```
App
└── Card                     (owns flip state)
    ├── CardFront
    │   ├── Headline          (font-headline)
    │   ├── RoleAndBio        (font-body)
    │   └── FlipHint          (font-body, "tap to flip" affordance)
    └── CardBack               (owns selected-category + project-index state)
        ├── CategoryTabs       (3 tags: Software Engineering / Automation / AI)
        ├── ProjectPanel       (AnimatePresence-swapped on category/index change)
        │   ├── ProjectStep    (problem / decision / outcome)
        │   └── ProjectStepper (next/prev, only rendered if category has >1 project)
        ├── SkillRow           (thin low-emphasis keyword line)
        └── ContactCTA          (persistent, rendered outside ProjectPanel so it survives swaps)
```

State lives at the lowest common owner, no global store:
- `Card`: `isFlipped: boolean`
- `CardBack`: `activeCategory: CategoryId`, `activeProjectIndex: number` (reset to `0` on category change)

## 6. Data model

Static TS data, no CMS/backend — content changes are code changes (consistent with "fresh scaffold, no existing content" per PRD §10).

```ts
// src/data/portfolio.ts
export type CategoryId = 'software-engineering' | 'automation' | 'ai'

export interface Category {
  id: CategoryId
  label: string          // e.g. "Software Engineering"
  projects: Project[]    // 1+, ordered for next/prev stepping
}

export interface Project {
  slug: string
  title: string
  problem: string        // 1 sentence
  decision: string        // the engineering decision that mattered — 1-2 sentences
  outcome: string        // 1 sentence, ideally with a number
}

export interface Skill {
  label: string
  weight: 'primary' | 'secondary'   // primary = load-bearing per PRD §7.3, renders first/bolder
  relatedTo: CategoryId[]           // drives grouping in SkillRow
}

export const categories: Category[] = [ /* ... */ ]
export const skills: Skill[] = [ /* ... */ ]
export const contact = { label: '...', href: 'mailto:...' }
```

Keeping `problem`/`decision`/`outcome` as separate fields (rather than one free-text blob) forces every project entry to satisfy PRD §6.4's three-part structure at the type level — a project can't be added without an outcome, for instance.

## 7. Animation spec (Framer Motion)

### 7.1 Flip (front ↔ back)

- `Card` renders both faces stacked via Tailwind (`absolute inset-0 [backface-visibility:hidden]`), wrapped in a `motion.div` with `style={{ transformStyle: 'preserve-3d' }}` and `animate={{ rotateY: isFlipped ? 180 : 0 }}`.
- Trigger: `onClick` on the card, always active — satisfies PRD §6.2's "click/tap must work on every device."
- Hover-to-flip is an additive enhancement, gated behind a `matchMedia('(pointer: fine)')` check (via a small `usePointerFine()` hook), so touch devices never depend on `:hover`. Implemented as `onHoverStart`/`onHoverEnd` from Framer Motion, only wired up when the hook reports `true`.
- Duration ~500-600ms, `ease: [0.4, 0, 0.2, 1]`-style curve — physical-card-turn feel per PRD §6.2, not a snap or bounce.
- Respect `useReducedMotion()`: when true, cut the rotation duration to near-zero (instant swap) instead of removing the flip entirely — the state change still needs to register.

### 7.2 Category / project swap

- `ProjectPanel` content wrapped in `AnimatePresence mode="wait"` keyed by `` `${activeCategory}-${activeProjectIndex}` ``.
- Crossfade + small vertical slide (`initial={{ opacity: 0, y: 8 }}`, `animate={{ opacity: 1, y: 0 }}`, `exit={{ opacity: 0, y: -8 }}`), ~200ms — fast enough not to feel laggy when a hiring manager is clicking through three tabs.
- `mode="wait"` (not `"popLayout"` or default) so the outgoing project fully exits before the incoming one enters — prevents any transient double-height layout jump inside the fixed card box.

## 8. Accessibility

- Card container is a `<button>` (or has `role="button"` + `tabIndex={0}`) so flip works via `Enter`/`Space`, not just pointer/touch.
- `aria-live="polite"` region wrapping `ProjectPanel` so category/project swaps are announced to screen readers without moving focus.
- Category tabs use `role="tablist"`/`role="tab"`/`aria-selected`, matching native tab semantics since that's functionally what they are.
- Contact CTA is a real `<a href="mailto:...">`, not a JS-only click handler, so it works with assistive tech and "open in new tab."

## 9. Testing / verification

- No dedicated test framework is being added for this pass (single static page, low logic surface); verification is manual per §4's viewport checklist plus the PRD §8 success criteria, exercised in-browser via the `run` skill before calling any interaction "done."
- If project/category data grows or stepper logic gets more complex later, revisit adding Vitest + React Testing Library for the stepper index math (wrap-around, category-change reset) specifically.

## 10. Risks / open technical questions

- Google Fonts introduces a third-party network dependency (vs. self-hosting) — acceptable tradeoff for build simplicity, but if the site ever needs to work fully offline or pass a strict no-third-party-requests audit, revisit self-hosting via `@fontsource`.
- 3D `rotateY` flip can look inverted/mirrored on the back face if `backface-visibility: hidden` isn't paired with a `rotateY(180deg)` counter-rotation on the back face's own content — flag as an implementation gotcha to test explicitly, not just visually skim.
- Exact crossfade vs. slide-vs-something-else feel for the category swap (PRD §9 lists this as an open question) — §7.2 above is a reasonable default, not a locked decision; adjust after seeing it live.
