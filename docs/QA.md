# Portfolio verification — 2026-09-19

Production build passes: all 14 generated routes, including six project cases. ESLint, TypeScript and production dependency audit pass (zero reported vulnerabilities).

Playwright: 25 passed, two skipped. Chromium, Firefox and WebKit cover navigation, portal completion, history, direct URLs, all cases, 404, five experiment dialogs, sliders, keyboard dismissal, image failure, reduced motion, keyboard access, no-JavaScript links, card dragging, rapid activation and responsive layout. The two skips are the Chromium-CDP-only native touch test in Firefox and WebKit; that test passes in Chromium. WebKit is engine coverage, not a claim of testing native Safari or physical iOS devices.

Viewport coverage: 320×740, 360×800, 375×812, 390×844, 430×932, 768×1024, 1024×768, 1280×800, 1366×768, 1440×900, 1920×1080. Additional hero regression at 1884×856 reproduces the user's screenshot dimensions; it verifies stable vertical centering, aligned white mask, separation from captions and full-width lens imagery through resize, scrolling and route return.

Visual passes inspected desktop/mobile hero, dark stage, physical deck, Play, About and case screenshots. Latest fixes: white type inside the lens, CSS-owned hero centering, complete project surface beneath the lens, tap after touch swipe, dialog background scroll containment, accessibility labels and contrast refinements. PDP and Khasaut Tour use actual local project screenshots.

An earlier desktop Lighthouse run scored performance 100, accessibility 96, best practices 100 and SEO 100. It preceded the final hero fixes; do not represent these as a fresh audit of later changes. Native-device testing and live-domain deployment are not included. Local screenshots and raw test artifacts stay in ignored `qa/` and `test-results/` directories.
