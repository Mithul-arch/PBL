import assert from "node:assert/strict"
import test from "node:test"
import {
  getLandingSection,
  getRouteFromHash,
  LANDING_SECTIONS,
} from "../src/lib/navigation.ts"

test("landing anchors stay on the landing page rather than becoming app routes", () => {
  for (const { id } of LANDING_SECTIONS) {
    assert.equal(getLandingSection(`#${id}`), id)
    assert.equal(getRouteFromHash(`#${id}`), "/")
  }
})

test("portal routes, the root and unknown fragments retain their routing behavior", () => {
  assert.equal(getRouteFromHash(""), "/")
  assert.equal(getRouteFromHash("#/"), "/")
  assert.equal(getRouteFromHash("#/login/recruiter"), "/login/recruiter")
  assert.equal(getRouteFromHash("#/a/jobs/j7?source=landing"), "/a/jobs/j7")
  assert.equal(getRouteFromHash("#unknown"), "unknown")
  assert.equal(getLandingSection("#/r/dashboard"), null)
  assert.equal(getLandingSection("#unknown"), null)
})
