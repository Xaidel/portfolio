# Portfolio PRD

## 1. Problem

The default portfolio pattern is a flat, undifferentiated list of everything the owner has ever built, aimed at every possible visitor at once. That reads as generic and forces the viewer to do the work of figuring out "so what does this person actually do, and is that relevant to me?"

This portfolio should do that work for them. It exists to get one specific kind of visitor — a hiring manager or founder evaluating software engineering talent — to a clear conclusion fast: **this person is a software engineer who also builds AI and automation systems, and here is the proof.**

## 2. Goals

- Present a single, unambiguous positioning: **software engineer**, with **AI and automation systems** as a named specialization — not a generalist, not a designer, not "does a bit of everything."
- Deliver the entire site as **one fixed screen, no page scrolling** — an interactive business card the visitor reads and plays with in place, not a page they scroll through.
- Group projects into three curated categories instead of one undifferentiated list:
  1. **Software Engineering**
  2. **Automation**
  3. **AI**
- Show only role-relevant skills prominently. Skills that don't support the software-engineering-with-AI/automation story are omitted or demoted, not given equal billing.
- The card's flip/reveal interaction is itself part of the pitch: a small, well-crafted piece of interactive engineering is evidence of the same care the positioning claims. It should be memorable, not gimmicky.
- Every visible element (front-of-card copy, category tags, project reveal) should read as written *for* one audience, not for "everyone who lands here."

## 3. Non-goals

- Not a general-purpose "things I've made" showcase — side projects unrelated to the positioning are cut, not just deprioritized.
- Not multi-role. No "I'm also a designer / PM / writer" framing, even if true.
- Not optimized for breadth of impression ("look how much I can do"). Optimized for one visitor concluding "hire this person for this job."
- No attempt to appeal to recruiters screening for other disciplines (design, data analytics, pure ops, etc.).
- Not a multi-page site and not a long-scroll single-pager either — no dedicated About page/section, no scroll-triggered animations. If it doesn't fit on the card, it doesn't go on the site.

## 4. Target audience (single persona)

**Primary reader:** a technical hiring manager, engineering lead, or startup founder scanning for a software engineer, who wants evidence of applied AI/automation work as a differentiator — not a generalist AI hobbyist and not a pure-design portfolio.

Everything on the site is written as if this is the only person who will ever read it. If a piece of content doesn't help convince this reader, it doesn't belong on the page.

## 5. Positioning statement

A working headline/subhead pair, in the spirit of "turning financial insight into sales for B2B fintech" — specific, outcome-oriented, no generic self-description:

> **Software engineer who builds the AI and automation systems behind the product.**
> Not a generalist — I ship working software, then automate and instrument it so it keeps working without me.

This is a draft, not final copy — content/copywriting pass is out of scope for this PRD, but the direction (specific claim + proof, not adjective soup) is a requirement. Reject any copy that could describe any engineer ("passionate developer," "full-stack enthusiast," etc.).

## 6. Information architecture

The whole site is a single interactive object — an ID/business card — centered in the viewport. There is no scrolling, no navigation, no other pages. Everything below happens on or around that one card.

### 6.1 Card front (default state)
- Reads like a minimal ID/business card: name, role/title, one-line bio.
- The one-line bio absorbs what a traditional "About" section would say — it's the positioning statement (see §5), compressed to a single line. No separate About section exists (see §3).
- No skill soup, no rotating "I am a [X], [Y], [Z]" typewriter effect.
- A subtle affordance (e.g. "flip" icon or hint text) signals the card is interactive, since nothing else on a business card implies clicking.

### 6.2 Flip interaction
- Trigger: click/tap flips the card. Click/tap is the primary trigger and must work on every device. Hover-to-flip is an optional enhancement layered on top for pointer-capable devices (`pointer: fine`) — it must never be the *only* way to trigger the flip, since touch devices have no hover.
- The flip is a full front↔back transition (e.g. 3D rotate), not an accordion or modal — it should feel like turning over a physical card.
- Clicking/tapping again (or an explicit back control) returns to the front.

### 6.3 Card back — categories and contact
- Shows the three category tags as the primary content: **Software Engineering**, **Automation**, **AI**.
- A thin, low-emphasis row of role-relevant skill keywords sits near the tags (see §6.4) — not a separate section, just a small supporting line.
- Contact is a persistent single CTA on the back (e.g. email/LinkedIn), always visible regardless of which category is selected — framed toward the hiring-manager persona (e.g. "hiring for an engineering role"), not a generic contact form.

### 6.4 Category tag → project swap
- Clicking a category tag swaps the back's content area to that category's curated project(s), in place — the card itself doesn't grow or scroll; content is replaced, not appended.
- Only one category's projects are shown at a time. If a category has more than one project, the visitor steps through them one at a time within that same content area (e.g. next/prev), rather than listing all of them at once.
- Each project shown states the problem, the engineering decision that mattered, and the outcome — compressed to fit the fixed card area, not a tech-stack tag cloud.
- A project only appears if it supports the positioning (quality bar over completeness); projects that don't fit any of the three categories are excluded from the site entirely, not given a fourth "misc" category.
- Skills are shown as the thin keyword row from §6.3, grouped/weighted by relevance to the three categories rather than flat-alphabetized. Skills that are true but not relevant to the positioning are omitted or pushed to a low-emphasis location off-card (e.g. resume/PDF link), never given equal billing with the load-bearing ones.

## 7. Content rules (apply when writing/curating content)

1. If a sentence could describe any developer, cut it.
2. If a project doesn't map cleanly to one of the three categories, it doesn't go on the site.
3. If a skill isn't load-bearing for the "software engineer + AI/automation" claim, it doesn't get top billing.
4. Prefer one strong, specific claim over several hedged, broad ones.
5. If content doesn't fit in the fixed card area without scrolling or shrinking below readability, cut the content — don't add scroll, don't add a page.

## 8. Success criteria

- A visitor can state the positioning back correctly after 5 seconds of reading the card front.
- The entire experience — front, flip, all three categories, contact — is reachable with zero page scrolling, on both desktop and mobile viewports.
- The flip and category-swap interactions work via tap on a touch device without relying on hover.
- Every project shown maps to exactly one of the three categories.
- No skill or project on the page requires the visitor to ask "wait, is this a design portfolio or an engineering portfolio?"

## 9. Open questions

- Final copy for the positioning statement and card front (name/role/one-line bio) — §5 is a directional draft, not approved final copy.
- Which existing projects (if any) map to each of the three categories, and which get cut. Given the one-project-at-a-time swap (§6.4), does each category need exactly one flagship project, or should some support two-to-three with next/prev stepping?
- Exact visual/interaction spec for the flip (CSS 3D transform vs. library) and for the category swap (crossfade vs. slide) — implementation detail, not blocking this PRD.
- Whether the flip affordance hint (§6.1) is always visible or fades after first interaction/visit.

## 10. Out of scope for this PRD

- Visual design system, component implementation, and copywriting are separate passes. This PRD fixes the *interaction contract* (single screen, front/back card, tag-driven project swap) but not colors, typography, or animation timing.
- Current codebase is a fresh Vite + React + TypeScript scaffold with no existing content — this PRD defines what to build, not how the components are structured.
