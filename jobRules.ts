import type { Job, WKey } from "./data"

export function canPublishJob(
  job: Pick<Job, "title" | "mandatory" | "weights">,
) {
  const weights = Object.values(job.weights)
  return (
    Boolean(job.title.trim()) &&
    job.mandatory.length > 0 &&
    weights.every(
      (weight) => Number.isFinite(weight) && weight >= 0 && weight <= 60,
    ) &&
    weights.reduce((sum, weight) => sum + weight, 0) === 100
  )
}

// Allocate five-point units, respecting the same limits as the sliders.
export function balanceWeights(
  weights: Record<WKey, number>,
): Record<WKey, number> {
  const keys = Object.keys(weights) as WKey[]
  const result = Object.fromEntries(
    keys.map((key) => [key, 0]),
  ) as Record<WKey, number>
  const total = keys.reduce((sum, key) => sum + weights[key], 0)
  const target = (key: WKey) =>
    total > 0 ? (weights[key] / total) * 100 : 100 / keys.length
  for (let points = 0; points < 100; points += 5) {
    const key = keys
      .filter((key) => result[key] < 60)
      .sort((a, b) => target(b) - result[b] - (target(a) - result[a]))[0]
    result[key] += 5
  }
  return result
}
