# 06 - SEO, Metadata API & JSON-LD

- **Metadata API**: Every public route must export static `export const metadata: Metadata` or dynamic `export async function generateMetadata()`. Title, description, canonical URL, Open Graph, and Twitter tags must be generated.
- **Human-Readable Slugs**: Prefer descriptive slugs for dynamic routes over database IDs (e.g. `/guides/[slug]`, `/adoption/[slug]`). Handle missing dynamic content with `notFound()`.
- **JSON-LD Structured Data**: Include schema scripts (`Article`, `Product`, `CollectionPage`, `Organization`, `WebSite`) via `<script type="application/ld+json">`.
- **Semantic HTML**: Use `<main>`, `<article>`, `<section>`, `<header>`, `<aside>`, `<h1>`-`<h6>`. Each page must have exactly ONE `<h1>`.
- **Sitemap & Robots**: Expose indexable routes in `sitemap.ts` and block private/authenticated routes (`/admin/`, `/user/`, `/api/`) in `robots.ts`.
