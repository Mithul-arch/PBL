export const LANDING_SECTIONS = [
  { id: "features", label: "Features" },
  { id: "how", label: "How it works" },
  { id: "fair", label: "Responsible AI" },
] as const

export function getLandingSection(hash: string) {
  const fragment = hash.replace(/^#/, "").split("?")[0]
  return LANDING_SECTIONS.find((section) => section.id === fragment)?.id ?? null
}

export function getRouteFromHash(hash: string) {
  if (getLandingSection(hash)) return "/"
  return (hash.replace(/^#/, "") || "/").split("?")[0]
}
