export interface CaseStudyImage {
  src: string
  alt: string
  caption: string
  detail: string
}

export interface CaseStudySection {
  id: string
  heading: string
  paragraphs?: string[]
  bullets?: string[]
  images?: CaseStudyImage[]
}

export interface CaseStudy {
  /** Matches the project's `name` in `categories.ts`. */
  name: string
  sections: CaseStudySection[]
}

export const caseStudies: CaseStudy[] = [
  {
    name: 'Pharmassist — Medicine Price & Availability Map',
    sections: [
      {
        id: 'overview',
        heading: 'Overview',
        paragraphs: [
          'Pharmassist is a mobile-first medicine price-and-availability map for Naga City, Camarines Sur. A patient searches for a medicine — or scans a prescription — and sees which nearby pharmacies have it, what it costs, and which single pharmacy is cheapest for the whole list.',
          'v1 is a seeded-data, information-only pilot: it does not sell, reserve, or deliver medicines. The point is to validate whether patients will use and trust the loop before real data operations and pharmacy partnerships are built.',
        ],
      },
      {
        id: 'problem',
        heading: 'Problem',
        paragraphs: [
          'Patients in Naga City pay out of pocket for medicines and have no reliable way to know, before traveling, which nearby pharmacy has a drug in stock or at the lowest total price. Prices vary by pharmacy and pack size; prescriptions can hold several medicines; calling ahead or walking between drugstores costs time and fare.',
          'The market is single-seller, not comparison-first: chain pharmacies publish only their own prices, and some publish none at all. No product answers “where in Naga is my full list cheapest and in stock right now?”',
        ],
      },
      {
        id: 'constraints',
        heading: 'Constraints',
        bullets: [
          'Information-only — no cart, order, reservation, payment, or delivery, so RA 11967 e-marketplace rules stay out of scope.',
          'Regulatory honesty — MDRP ceilings are shown separately and never misrepresented; only FDA-registered products are listed.',
          'Privacy by design — no accounts, no server-side prescription storage; the medicine list is session-only.',
          'Delivery — a mobile-first PWA usable on low-end Android and 3G, running on seeded one-time pilot data for Naga City only.',
        ],
      },
      {
        id: 'architecture',
        heading: 'Architecture',
        paragraphs: [
          'TanStack Start (React 19 + strict TypeScript) with file routes and createServerFn server functions; Postgres for storage; Docker and Caddy for the deployable stack.',
          'Map-first results via MapLibre GL, typo-tolerant medicine search, and a PWA whose service worker caches only the offline shell — never price data, which is unavailable offline by design.',
        ],
        bullets: [
          'Feature-based source layout: routes stay thin, and each feature owns its domain, UI, and server functions.',
          'Idempotent seed and guarded wipe tooling, plus a database acceptance harness that proves migrations, seed, and wipe on a scratch database.',
        ],
      },
      {
        id: 'key-decisions',
        heading: 'Key Decisions',
        bullets: [
          'Rank by the total shelf price of a complete list, and split compliant vs above-MDRP lists into separate tiers so an above-ceiling list is never highlighted as cheapest.',
          'Model pack, strip, and loose as observations with an explicit state, so “sold per pack only” and “not applicable” never read as unavailable.',
          'Show the published MDRP ceiling and the observed shelf price separately, including the 12% VAT gross-up for VATable products.',
          'Keep OCR privacy-safe: no prescription images or OCR text are stored server-side, and every scanned item must be confirmed by the user.',
        ],
      },
      {
        id: 'outcome',
        heading: 'Outcome',
        paragraphs: [
          'A seeded pilot covering 50 medicines, 10 Naga pharmacies, and 204 published MDRP ceilings validates the full search → rank → map → directions loop.',
          'The acceptance suite proves the seed, wipe, and MDRP fixtures, and browser E2E exercises every demo state through the mobile viewport.',
        ],
      },
      {
        id: 'lessons',
        heading: 'Lessons Learned',
        bullets: [
          'Regulatory and trust constraints (MDRP framing, the information-only boundary) are product requirements, not afterthoughts — they shaped the data model and ranking rules early.',
          'A deterministic seed plus an acceptance gate pays for itself: every demo case is reachable and provable before anything ships.',
        ],
      },
      {
        id: 'showcase',
        heading: 'Showcase',
        images: [
          {
            src: '/screenshots/pharmassist-search.png',
            alt: 'Pharmassist search with typo-tolerant autocomplete',
            caption: 'Typo-tolerant search',
            detail:
              'Misspellings still surface the right medicine — “amlodipne” resolves to Norvasc with a “Close spelling match” flag, and every search is recorded as an anonymous event.',
          },
          {
            src: '/screenshots/pharmassist-results.png',
            alt: 'Pharmassist map-first results with price pins and ranked list',
            caption: 'Map-first results',
            detail:
              'Pharmacies render as price-labelled pins over a live map, with a ranked list below. Janumet shows the MDRP ceiling, a stale-price flag, and no-price pharmacies — never falsely “unavailable”.',
          },
          {
            src: '/screenshots/pharmassist-detail.png',
            alt: 'Pharmacy detail with stock list and MDRP breakdown',
            caption: 'Pharmacy detail',
            detail:
              'Tapping a pin opens the full stock list with per-form state and the MDRP comparison — box, strip, and loose rates — with the published ceiling shown separately.',
          },
          {
            src: '/screenshots/pharmassist-scan.png',
            alt: 'Prescription scan entry screen',
            caption: 'Prescription scan',
            detail:
              'Scanning starts with explicit consent, then offers a photo, upload, or bundled sample. Nothing is added on its own — every item is reviewed and confirmed first.',
          },
        ],
      },
    ],
  },
  {
    name: 'Teach — AI Learning Platform',
    sections: [
      {
        id: 'overview',
        heading: 'Overview',
        paragraphs: [
          'Teach is an interactive, AI-driven learning platform that converts AI-generated code a learner doesn’t fully understand into active, evaluated practice — pairing an AI Teacher with a real sandboxed compiler and a deterministic evaluation gate.',
          'The v1 build delivers the multi-language sandbox: one hardcoded exercise each in Rust, Go, and Python, submitted through a TanStack Start server function, evaluated by that language’s real test toolchain in an isolated Docker sandbox, with pass/fail persisted in Postgres.',
        ],
      },
      {
        id: 'problem',
        heading: 'Problem',
        paragraphs: [
          'Developers who lean on AI coding assistants end up reviewing code in languages or paradigms they don’t fully master rather than writing it. They accumulate “cognitive debt”: they can accept or reject AI output, but they can’t independently debug, modify, or explain it.',
          'Existing learning sites are too passive — multiple-choice, no real compiler feedback — to close that gap, and nothing turns a specific AI-generated snippet the learner doesn’t understand into targeted, evaluated practice.',
        ],
      },
      {
        id: 'constraints',
        heading: 'Constraints',
        bullets: [
          'The AI Teacher generates but never grades — pass/fail must be deterministic, not a model’s opinion of its own output.',
          'Untrusted code is assumed malicious: every submission runs in an ephemeral Docker sandbox with hard CPU, memory, PID, and network limits.',
          'Multi-language from day one (Rust, Go, Python), and multi-user-ready from the first schema even though v1 runs with a single learner.',
          'A deterministic leakage guard (Prompt Shield) so a hint can never accidentally contain the full solution.',
        ],
      },
      {
        id: 'architecture',
        heading: 'Architecture',
        paragraphs: [
          'A single TanStack Start (React 19 + strict TypeScript) app: server functions own the API and the Docker sandbox orchestration — no separate backend service.',
          'Postgres via Drizzle for the Concept Graph, Learner Model, and attempts; Docker via dockerode with one pinned image per language and one ephemeral container per submission.',
        ],
        bullets: [
          'A bind-mounted workspace moves code in and results out; a watchdog enforces the 10-second timeout and guarantees teardown.',
          'Per-language normalizers map native test output — go test -json, cargo-nextest JUnit XML, pytest --junit-xml — into one shared Sandbox Result shape.',
        ],
      },
      {
        id: 'key-decisions',
        heading: 'Key Decisions',
        bullets: [
          'Two-stage evaluation: Stage 1 (deterministic compile/test) is authoritative; Stage 2 (LLM rubric) checks only what Stage 1 can’t, gated by required/prohibited criteria.',
          'Pre-Flight validation runs every generated exercise through a reference solution before a learner sees it, capped at three attempts with a circuit breaker.',
          'Prompt Shield compares output against the verified reference solution deterministically — no second LLM call — gated by the learner’s current hint level.',
          'Each language’s pinned image is built from an in-repo Dockerfile whose skeleton manifest is the allowed-dependency list, so “allowed” and “pre-compiled” can’t drift.',
        ],
      },
      {
        id: 'outcome',
        heading: 'Outcome',
        paragraphs: [
          'The multi-language sandbox is live: one hardcoded exercise per language, evaluated by cargo nextest, go test, and pytest in isolated containers, with each submission and its pass/fail result persisted in Postgres.',
          'The test suite spans unit, component, real-Docker sandbox integration, Postgres-backed server-operation, and browser E2E coverage across all three languages.',
        ],
      },
      {
        id: 'lessons',
        heading: 'Lessons Learned',
        bullets: [
          'Making the AI a generator but never the evaluator created a hard trust boundary: the model that writes an exercise can never grade its own output.',
          'A deterministic gate — Pre-Flight plus Prompt Shield — is what makes AI output safe to surface, not more model calls.',
        ],
      },
      {
        id: 'showcase',
        heading: 'Showcase',
        images: [
          {
            src: '/screenshots/teach-dashboard.png',
            alt: 'Teach learner dashboard',
            caption: 'Learner dashboard',
            detail:
              'The home surfaces the Concept Graph and Tactical Sprint entry points, plus learner-model progress — streak, concepts mastered, and overall completion.',
          },
          {
            src: '/screenshots/teach-practice.png',
            alt: 'Teach exercise editor',
            caption: 'Exercise editor',
            detail:
              'The practice surface lists the available exercises with a code editor, explanation-depth preferences, and the retrieval queue — the two tracks meeting in one surface.',
          },
          {
            src: '/screenshots/teach-result.png',
            alt: 'Teach sandbox pass result',
            caption: 'Sandbox result',
            detail:
              'A submission runs through a real isolated Docker sandbox — here the Go exercise passes all 3 tests via go test, with the deterministic pass/fail verdict.',
          },
        ],
      },
    ],
  },
  {
    name: 'Order Status Reconciliation',
    sections: [
      {
        id: 'overview',
        heading: 'Overview',
        paragraphs: [
          'An n8n automation that turns the routine “where’s my order?” question into an instant answer. It pulls live order status from the source system and posts it directly into the support Slack channel, removing the manual lookup that used to sit between the request and the answer.',
          'The workflow is read-only and on-demand: it answers with the current status at the moment it’s asked, and it never changes an order.',
        ],
      },
      {
        id: 'problem',
        heading: 'Problem',
        paragraphs: [
          'Every “where’s my order?” request forced a support agent to stop, look up the order status by hand in the source system, and paste the result back — slow, repetitive, and error-prone.',
          'The lookup itself was mechanical and predictable; only the human plumbing around it made it feel like work. That made it a prime target for automation.',
        ],
      },
      {
        id: 'constraints',
        heading: 'Constraints',
        bullets: [
          'Answer from the authoritative source, not a snapshot or report, so the status is current at query time.',
          'Run unattended and fail loudly: a down source or a missing order must produce an explicit message, never a silent empty reply.',
          'Live inside Slack, where support already works, so there’s no new UI or tool to learn.',
          'Read-only — the workflow reports status and never mutates an order, so a bad run can’t change customer data.',
        ],
      },
      {
        id: 'architecture',
        heading: 'Architecture',
        paragraphs: [
          'An n8n workflow, triggered from Slack, pulls live order status from the source system, formats it, and posts the answer back into the same channel or thread the request came from.',
          'Scripting steps handle parsing and formatting edge cases, and scheduling covers recurring jobs — leaving the on-demand path free to stay fast and simple.',
        ],
      },
      {
        id: 'key-decisions',
        heading: 'Key Decisions',
        bullets: [
          'Answer on demand rather than pre-fetch: the workflow runs when asked, so the status is live at query time, not a cached copy.',
          'Post the answer into the same Slack context the request came from, so support keeps its existing flow.',
          'Stay read-only — report status, never update or cancel — so the automation can’t be the cause of a wrong order change.',
          'Make failure explicit: a missing order or an unreachable source returns a clear message instead of silence.',
        ],
      },
      {
        id: 'outcome',
        heading: 'Outcome',
        paragraphs: [
          'Order-status checks now resolve automatically instead of manual digging, removing the slow, error-prone copy-paste step from the loop.',
          'Support spends its time on the requests that genuinely need judgment; the mechanical lookups answer themselves.',
        ],
      },
      {
        id: 'lessons',
        heading: 'Lessons Learned',
        bullets: [
          'The highest-leverage automations are the mechanical, predictable steps hiding inside a “human” process — the win came from finding the repeated manual lookup, not from automating something exotic.',
          'Point the automation at the live source and make failures loud: a silent empty answer would be worse than the manual step it replaced.',
        ],
      },
    ],
  },
]

export function getCaseStudy(name: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.name === name)
}
