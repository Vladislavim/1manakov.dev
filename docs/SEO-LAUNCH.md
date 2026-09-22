# Technical SEO and launch — 2026-09-22

Primary domain confirmed by owner: **https://imanakov.dev**. Domain not purchased and hosting not paid yet. This is a local readiness report, not a live indexation certification or a ranking guarantee.

## Implemented

- Canonical, sitemap, RSS and structured-data URLs use imanakov.dev, replacing the incorrect 1manakov.dev default.
- Shared complete page metadata prevents nested Next.js Open Graph replacement from dropping images, locale or site name. Twitter previews match the individual case image.
- Unique topic and pagination descriptions; Russian guide locales; English portfolio copy preserved. No invented language equivalents/hreflang.
- Person/WebSite graph with stable IDs; Article author/publisher references and image; existing article breadcrumbs retained.
- Permanent www-to-apex redirect preserves path and query. Old unowned domains are not treated as redirect aliases.
- Existing play/journal migrations retained; missing routes return 404; only approved pages enter sitemap.
- Preview noindex: Vercel preview or SEO_NOINDEX=true sets both metadata and HTTP header. Crawling stays allowed so the noindex directive can be read.
- Optional Google/Yandex verification via environment. Empty values do not emit fake tokens.
- Optional Metrica adapter: deferred initialization plus one hit per pathname, guide goals and email/Telegram clicks. Local/preview requests excluded, query strings and form input not sent by this adapter. Webvisor disabled. Analytics remains OFF until configured.
- npm run seo:technical checks the complete sitemap corpus without JS: status, canonical, metadata, H1, SSR text, schema JSON, images, duplicate titles/descriptions, internal links, graph reachability, redirects, robots and 404s.

## Verified locally

Production build, ESLint and TypeScript passed. Technical crawl: 41 indexable URLs, zero errors. Existing guide QA: 20 guides, zero errors. Five Chromium workbench tests passed. Five upgraded tools inspected at 390 and 1440 px with no horizontal overflow.

Reports: seo/reports/technical-qa.json and seo/reports/route-qa.json. Screenshots: ignored qa/guide-*.png.

## Recovered owner settings (historical, not verified for imanakov.dev)

Source: C:/Users/viman/OneDrive/Рабочий стол/01 Projects and Sites/jack template/index.html. That source used www.imanakov.website.

- Yandex verification: 06ea027883e5c443
- Google verification: GbjVRWhZsJ53NBMSyDDYtJL-7r2itkXojkW4MPXBTXI
- Metrica counter: 109144906

These are public identifiers, not API credentials. Google/Yandex must provide or confirm the verification method for the NEW property; do not assume the old tokens transfer. They are documented here but not automatically injected into the new property.

## Launch steps still open

1. Buy imanakov.dev and point DNS to the selected hosting. Deploy this Next.js app on a compatible runtime; static-file-only hosting is not interchangeable with this configuration.
2. Set NEXT_PUBLIC_SITE_URL=https://imanakov.dev. Ensure SEO_NOINDEX is false for production and true for staging outside Vercel. Rebuild after changing these values.
3. Confirm HTTPS and a single redirect for HTTP/www, including deep links and query strings. Public availability was not testable before launch.
4. Add the new property in Search Console and Yandex Webmaster. Use DNS verification or the issued GOOGLE_SITE_VERIFICATION / YANDEX_SITE_VERIFICATION tokens and rebuild.
5. Submit https://imanakov.dev/sitemap.xml, inspect rendered home/case/guide pages and request a small representative sample for indexing.
6. In Metrica, verify counter ownership/domain, configure the website address and goals. Set NEXT_PUBLIC_METRICA_ID=109144906 only if reusing that counter intentionally. Then enable NEXT_PUBLIC_ANALYTICS_ENABLED=true and rebuild. Verify real hits/goals including internal navigation in the dashboard; clicks are not confirmed leads.
7. Goal IDs: contact_email, contact_telegram, seo_cta_view, seo_cta_click, seo_contact_click, seo_case_click, seo_related_page_click.
8. Run QA_BASE_URL=https://imanakov.dev npm run seo:technical (set the environment with the syntax appropriate for your shell). Check Rich Results Test and URL Inspection separately: valid JSON is not search-engine rich-result validation.
9. Measure mobile performance on deployed hosting (LCP/INP/CLS and image/font transfer), then actual field data as traffic accumulates. No live Core Web Vitals score claimed from localhost.
10. Review indexing exclusions, impressions, clicks and referral traffic at 7/28 days. No universal numeric “10/10 SEO” proves ranking or indexation.

## Backlinks: separate acquisition work, not a code toggle

- Update the owner's GitHub profile website and relevant project READMEs to the purchased domain.
- Publish selected original cases on the owner's existing portfolio/professional profiles, linking to the specific relevant case.
- Where a client permits it, request a truthful developer credit or project mention linking to the portfolio. No client edits or outreach sent in this task.
- Share useful interactive guides in relevant discussions with context; do not mass-post identical comments or manufacture links.
- Track referring page, target page, placement date and referral visits; review external-link reports after verification. No backlink count can be established for the unlaunched domain from the available evidence.

References: https://developers.google.com/search/docs/essentials ; https://developers.google.com/search/docs/essentials/spam-policies ; https://developers.google.com/search/docs/crawling-indexing/links-crawlable ; https://yandex.com/support/metrica/ru/code/counter-spa-setup

## Guide improvements

Actual catalog pagination/load-more with detail return and focus restoration; working dashboard state and task-dependent hierarchy; shared-token demonstration with detached override; evidence notes exported from checklists; empty-state and retry examples now reach an outcome. Guide index exposes the practical tool in each article. Examples use clearly labelled teaching data, never fabricated client metrics.
