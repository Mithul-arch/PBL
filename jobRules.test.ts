import assert from "node:assert/strict"
import test from "node:test"
import { balanceWeights, canPublishJob } from "../src/lib/jobRules.ts"

const weights = { tech: 30, exp: 25, edu: 10, proj: 15, pref: 10, comp: 10 }
const job = {
  title: "Frontend Engineer",
  mandatory: [
    {
      name: "React",
      category: "Technical skill" as const,
      level: "Advanced" as const,
      importance: 5,
      verify: "Resume evidence",
    },
  ],
  weights,
}

test("publishing requires a title, mandatory requirements and valid weights", () => {
  assert.equal(canPublishJob(job), true)
  assert.equal(canPublishJob({ ...job, title: "  " }), false)
  assert.equal(canPublishJob({ ...job, mandatory: [] }), false)
  assert.equal(
    canPublishJob({ ...job, weights: { ...weights, tech: 0 } }),
    false,
  )
  assert.equal(
    canPublishJob({ ...job, weights: { ...weights, tech: NaN } }),
    false,
  )
  assert.equal(
    canPublishJob({
      ...job,
      weights: { tech: 100, exp: 0, edu: 0, proj: 0, pref: 0, comp: 0 },
    }),
    false,
  )
  assert.equal(
    canPublishJob({
      ...job,
      weights: { tech: -5, exp: 50, edu: 10, proj: 20, pref: 15, comp: 10 },
    }),
    false,
  )
})

test("auto-balance handles zero weights and concentrated weights within slider limits", () => {
  const cases = [
    weights,
    { tech: 0, exp: 0, edu: 0, proj: 0, pref: 0, comp: 0 },
    { tech: 60, exp: 0, edu: 0, proj: 0, pref: 0, comp: 0 },
    { tech: 0, exp: 60, edu: 0, proj: 0, pref: 0, comp: 0 },
  ]
  for (let a = 0; a <= 60; a += 5) {
    for (let b = 0; b <= 60; b += 5) {
      cases.push({ tech: a, exp: b, edu: 5, proj: 10, pref: 20, comp: 0 })
    }
  }
  for (const original of cases) {
    const snapshot = { ...original }
    const result = balanceWeights(original)
    assert.equal(
      Object.values(result).reduce((sum, value) => sum + value, 0),
      100,
    )
    assert.ok(
      Object.values(result).every(
        (value) => value >= 0 && value <= 60 && value % 5 === 0,
      ),
    )
    assert.deepEqual(original, snapshot)
  }
  assert.deepEqual(balanceWeights(weights), weights)
})
