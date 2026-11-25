/**
 * Navigation Feature Flags
 * Controls visibility of major application modules in public navbar, mobile bottom navigation, and footer.
 * Flip flags to `true` day-by-day as modules become ready.
 */
export const NAV_FEATURE_FLAGS = {
  guides: true,       // Live & fully functional
  feed: false,        // In development
  community: false,   // In development
  marketplace: false, // In development
  adoption: false,    // In development
  shelter: false,     // In development
} as const;

export type NavFeatureKey = keyof typeof NAV_FEATURE_FLAGS;

export function isFeatureActive(key: NavFeatureKey): boolean {
  return Boolean(NAV_FEATURE_FLAGS[key]);
}
