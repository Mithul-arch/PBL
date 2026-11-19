import { PRIYA_SKILLS, type Job } from '../../lib/data'

const W = { met: 1, partial: 0.6, unverified: 0.35, none: 0, gap: 0 }
export function matchFor(job: Job, fresh: boolean) {
  if (fresh) return null
  const items = [...job.mandatory.map((r) => ({ r, w: r.importance * 2 })), ...job.preferred.map((r) => ({ r, w: r.importance }))]
  const tot = items.reduce((s, i) => s + i.w, 0)
  const got = items.reduce((s, i) => s + i.w * W[PRIYA_SKILLS[i.r.name]?.state ?? 'none'], 0)
  return tot > 0 ? Math.round((got / tot) * 100) : null
}

export interface Parsed {
  education: { school: string; degree: string; year: string }[]
  experience: { company: string; title: string; period: string; bullets: string }[]
  skills: string[]
  certs: string[]
  projects: { name: string; desc: string }[]
}
export const PARSED: Parsed = {
  education: [{ school: 'UC San Diego', degree: 'B.S. Computer Science', year: '2017' }],
  experience: [
    { company: 'Swasthya Health', title: 'Senior Frontend Engineer', period: '2021 – Present', bullets: 'Led React 18 migration for 3 product teams. Introduced strict-mode TypeScript across a 400k-line monorepo. Raised test coverage from 48% to 86% with RTL and Jest. Cut LCP by 38% on patient portal.' },
    { company: 'Kalpa Digital', title: 'Frontend Developer', period: '2017 – 2021', bullets: 'Built BFF services in Node.js and shipped a Storybook-documented component library used by 6 squads.' },
  ],
  skills: ['React', 'TypeScript', 'GraphQL', 'Node.js', 'Jest', 'Storybook', 'Tailwind CSS', 'Design systems'],
  certs: ['AWS Certified Developer – Associate'],
  projects: [{ name: 'Design system migration', desc: '40+ component library with tokens and docs' }, { name: 'Real-time clinical dashboard', desc: 'React + GraphQL subscriptions for 12 views' }],
}
