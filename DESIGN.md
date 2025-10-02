PMInsight – Design Decisions and Justification

This document explains the key architectural and product decisions for PMInsight and the reasoning behind them, covering alternatives, trade-offs, and future improvements. It is intended to satisfy the “Clarity & Justification” criterion of the assignment.

1) Purpose and Scope
- Explore PMBOK 7, PRINCE2, and ISO 21500/21502 in a searchable, navigable way
- Compare standards for selected topics with deep links to exact sections
- Generate tailored project processes with evidence-based citations
- Visualize relationships using an innovative Topic Map graph .

2) System Overview
- Frontend: React + TypeScript + Vite (SPA) deployed on Vercel
- Backend: Node.js + Express + Prisma + PostgreSQL, deployed on Render
- AI: Google Generative AI (Gemini) for insights and process generation
- Data: Standards → Chapters → Sections (normalized) with search and pagination
- Routing: React Router with SPA rewrite rules to support deep links

Why SPA + API: Enables fast, smooth navigation, client-side interactivity (Topic Map, skeleton loaders) and clean separation of concerns between UI and data.

3) Key Decisions and Rationale

3.1 Tech Stack
- React + TypeScript: Strong typing and fast development with a rich ecosystem; predictable SPA routing and component patterns
- Vite: Lightning-fast dev/build, modern ESM; fewer config pitfalls than CRA
- Node/Express API: Simple, minimal overhead, easy to deploy and reason about
- Prisma ORM + PostgreSQL: Type-safe queries, migrations, and relations for standards/sections; PostgreSQL is robust and widely available on Render
- Gemini: Concise, low-latency model for summaries and structured outputs (process steps, citations)

Alternatives considered: Django/Flask (heavier context switch with TS frontend), MongoDB (we need relational joins), REST vs GraphQL (REST is simpler for this scope).

3.2 Data Model
- Normalized schema: Standard → Chapter → Section
- Section fields include sectionNumber, title, content, and computed metadata (e.g., wordCount), enabling:
  - Full-text search
  - Deep linking from comparisons and Topic Map
  - Pagination for large standards

Trade-offs: Denormalized search indices could be faster but increase write complexity. Normalization keeps ingestion and updates simple.

3.3 Comparison Engine
- Topic-driven flow: user selects a topic → API composes similarities, differences, unique points → deep links to sections
- Reasoning: Users think in topics first; evidence is essential → every comparison point links to the exact section
- Deep links use SPA routing (/section/:id) to avoid server 404s; Vercel rewrites route everything to index.html

Alternatives: Fully AI-generated comparisons without structure were rejected—lack of deterministic traceability. The chosen approach blends curated structure with AI assistance.

3.4 Insights Dashboard
- Aggregates totals and topic coverage; optional AI summary for narrative insight
- Justification: Quick situational awareness for instructors and users; complements the comparison engine

3.5 Process Generator
- Inputs: scenario, lifecycle, constraints, drivers
- Output: phases → activities → deliverables + citation links to standards sections
- Design: Prompt orchestration encourages factual outputs with explicit references. UI provides export (JSON/CSV/Print) for evidence submission

Trade-off: Stronger guardrails (schemas) add prompt complexity but produce more reliable, gradable artifacts.

3.6 Topic Map (Innovation)
- Backend /api/graph computes topic coverage cheaply first (counts), then fetches limited sections per top topics
- Frontend force-layout SVG with zoom/pan, mini-map, tooltips, and info panel; animated transitions
- Rationale: Balances performance (avoids connection pool exhaustion) with an engaging visual exploration of relationships

Alternatives: Client-only computation was too heavy; naive querying caused Prisma pool timeouts (P2024). The staged count-then-fetch strategy solved this.

3.7 Routing and Deployment
- SPA rewrites on Vercel (vercel.json) so direct links like /standard/8 or /section/351 render in the client
- All internal links use Link/programmatic navigation to avoid full page reloads
- Backend health: /api/ping for Render health checks, plus /api/health in app

3.8 Loading, Errors, and UX Polish
- Reusable skeleton loaders for major pages; graceful error cards with retry or navigation
- Tooltips clamped within viewport; passive event listeners respected; React hook order stabilized to remove update-depth errors
- 404 page is branded and provides quick paths back to main features

3.9 Retrieval Strategy Without Embeddings (Resource Constraints)
- Decision: Do not use vector embeddings or a vector database in this phase. Rely on deterministic keyword and heuristic scoring for search, comparison, and process-citation retrieval.
- Rationale:
  - Operational cost/complexity: Hosting and maintaining a vector DB (pgvector/Weaviate/FAISS service) exceeds the course scope and available resources.
  - Ingestion overhead: Chunking, embedding, re-embedding on data changes, and index maintenance add time and cost.
  - Determinism and grading: Keyword+rule-based retrieval provides stable, explainable outcomes with transparent evidence links—easier to verify in an academic context.
  - Latency: Avoids additional network round-trips and cold starts to embedding services; current dataset size is modest, so SQL-based matching is sufficient.
- Approach implemented:
  - SQL filtering with case-insensitive `contains` on `title`, `fullTitle`, and `content`.
  - Lightweight similarity heuristics (title match > content match; partial word overlaps) to rank results.
  - Topic-driven queries (predefined keyword sets) for comparison and process generation evidence.
- Upgrade path (Future Improvements):
  - Introduce `tsvector` indexes in Postgres for faster full-text search.
  - Optionally adopt Meilisearch/OpenSearch for fuzzy ranking and typo tolerance.
  - Add embeddings (pgvector) once resources allow, keeping the same API surface so the UI remains unchanged.

4) Performance Considerations
- Graph endpoint optimized to avoid expensive full scans and pool exhaustion
- Debounced controls (e.g., sliders) to prevent overfetching
- Section pagination and limited graph fetches reduce payload sizes
- Client navigations via SPA links to avoid server round-trips

5) Security & Reliability
- CORS configured narrowly for frontend origin during deployment
- Prisma parameterization prevents injection; environment variables for secrets (DATABASE_URL, GEMINI_API_KEY, VITE_API_URL)
- Health checks (/api/ping) and structured error responses for observability

6) Known Limitations
- AI outputs may vary; mitigated with stronger prompting and evidence citations
- No full role-based access control (not required for assignment)
- PDF/EPUB ingestion is assumed pre-processed into DB—automated pipeline is out of scope

7) Future Improvements
- Server-side search indexing (e.g., Postgres tsvector, Meilisearch) for faster global search
- Saved comparisons and shareable links
- User profiles and personalized topic maps
- Graph clustering and community detection for advanced analytics
- Offline packaging for standards in classroom demos

8) References
- PMBOK 7th Edition; Process Groups Practice Guide (PMI)
- PRINCE2 (Andy Murray, 2023)
- ISO 21500:2021 (Context & concepts)
- ISO 21502:2020 (Guidance on project management)


