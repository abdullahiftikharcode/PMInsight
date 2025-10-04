PMInsight – Design Decisions and Justification

This document explains the key architectural and product decisions for PMInsight and the reasoning behind them, covering alternatives, trade-offs, and future improvements. It is intended to satisfy the “Clarity & Justification” criterion of the assignment.

1) Purpose and Scope
- Explore PMBOK 7, PRINCE2, and ISO 21500/21502 in a searchable, navigabtable way
- Compare standards for selected topics with deep links to exact sections
- Generate tailored project processes with evidence-based citations
- Visualize relationships using an innovative Topic Map graph...

2) System Overview
- Frontend: React + TypeScript + Vite (SPA) deployed on Vercel
- Backend: Node.js + Express + Prisma + PostgreSQL, deployed on Render
- AI: Google Generative AI (Gemini) for insights, process generation, and vector embeddings
- Data: Standards → Chapters → Sections (normalized) with semantic search and pagination
- Vector Search: pgvector extension with 768-dimensional embeddings for semantic similarity
- Routing: React Router with SPA rewrite rules to support deep links

Why SPA + API: Enables fast, smooth navigation, client-side interactivity (Topic Map, skeleton loaders) and clean separation of concerns between UI and data.

3) Key Decisions and Rationale

3.1 Tech Stack
- React + TypeScript: Strong typing and fast development with a rich ecosystem; predictable SPA routing and component patterns
- Vite: Lightning-fast dev/build, modern ESM; fewer config pitfalls than CRA
- Node/Express API: Simple, minimal overhead, easy to deploy and reason about
- Prisma ORM + PostgreSQL: Type-safe queries, migrations, and relations for standards/sections; PostgreSQL is robust and widely available on Render
- pgvector: PostgreSQL extension for vector similarity search with cosine distance
- Gemini: Concise, low-latency model for summaries, structured outputs, and text embeddings (text-embedding-004)

Alternatives considered: Django/Flask (heavier context switch with TS frontend), MongoDB (we need relational joins), REST vs GraphQL (REST is simpler for this scope), Weaviate/Pinecone (pgvector is simpler and cost-effective).

3.2 Data Model
- Normalized schema: Standard → Chapter → Section
- Section fields include sectionNumber, title, content, computed metadata (e.g., wordCount), and vector embeddings, enabling:
  - Full-text search (keyword-based)
  - Semantic search (vector similarity)
  - Deep linking from comparisons and Topic Map
  - Pagination for large standards

Trade-offs: Denormalized search indices could be faster but increase write complexity. Normalization keeps ingestion and updates simple. Vector embeddings add storage overhead but enable semantic understanding.

3.3 Comparison Engine
- Topic-driven flow: user selects a topic → API uses semantic search to find top 5 sections per standard → composes similarities, differences, unique points → deep links to sections
- Semantic search: Uses vector embeddings to find conceptually similar content even with different terminology
- Reasoning: Users think in topics first; evidence is essential → every comparison point links to the exact section
- Deep links use SPA routing (/section/:id) to avoid server 404s; Vercel rewrites route everything to index.html

Alternatives: Fully AI-generated comparisons without structure were rejected—lack of deterministic traceability. The chosen approach blends semantic retrieval with AI assistance for structured analysis.

3.4 Insights Dashboard
- Aggregates totals and topic coverage; optional AI summary for narrative insight
- Justification: Quick situational awareness for instructors and users; complements the comparison engine

3.5 Process Generator
- Inputs: scenario, lifecycle, constraints, drivers
- Output: phases → activities → deliverables + citation links to standards sections
- Semantic retrieval: Uses vector embeddings to find most relevant sections for each activity, ensuring evidence-based citations
- Design: Prompt orchestration encourages factual outputs with explicit references. UI provides export (JSON/CSV/Print) for evidence submission

Trade-off: Stronger guardrails (schemas) add prompt complexity but produce more reliable, gradable artifacts. Semantic search improves citation relevance over keyword matching.

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

3.9 Search and Retrieval Strategy
- Dual approach: Both keyword-based and semantic search with user-controlled toggles
- Semantic search: Uses Gemini text-embedding-004 to generate 768-dimensional vectors stored in PostgreSQL with pgvector
- Keyword search: SQL filtering with case-insensitive `contains` on `title`, `fullTitle`, and `content` as fallback
- Implementation:
  - Global search: `/api/search` (keyword) and `/api/search/semantic` (vector)
  - Per-standard search: `/api/standards/:id/search` (keyword) and `/api/standards/:id/search/semantic` (vector)
  - Comparison engine: Uses semantic search to find top 5 sections per standard by cosine similarity
  - Process generator: Uses semantic search for evidence-based citations
- UI toggles: Users can switch between keyword and semantic search modes in both global and per-standard views
- Rationale:
  - Semantic search provides better conceptual understanding and finds relevant content even with different terminology
  - Keyword search provides deterministic, explainable results for exact matches
  - Dual approach accommodates different user preferences and use cases
  - Graceful fallback ensures system reliability even if embedding service is unavailable

4) Performance Considerations
- Graph endpoint optimized to avoid expensive full scans and pool exhaustion
- Vector search: IVFFLAT index on embeddings for fast cosine similarity queries
- Embedding generation: Batch processing with rate limiting and retry logic
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
- Advanced vector search: HNSW index for even faster similarity queries
- Hybrid search: Combine semantic and keyword search with learned ranking
- Saved comparisons and shareable links
- User profiles and personalized topic maps
- Graph clustering and community detection for advanced analytics
- Offline packaging for standards in classroom demos
- Real-time embedding updates when content changes

8) References
- PMBOK 7th Edition; Process Groups Practice Guide (PMI)
- PRINCE2 (Andy Murray, 2023)
- ISO 21500:2021 (Context & concepts)
- ISO 21502:2020 (Guidance on project management)


