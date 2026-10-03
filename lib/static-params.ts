// Next export rejects empty dynamic-route lists. Render one notFound() sentinel;
// the hosting packager removes its files, leaving the normal HTTP 404 fallback.
export function exportParams<T extends Record<string, string>>(params: T[], empty: T): T[] {
  return process.env.STATIC_HOSTING === 'true' && params.length === 0 ? [empty] : params;
}
