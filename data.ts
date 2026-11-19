export type Level = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
export type Category = 'Technical skill' | 'Certification' | 'Project' | 'Competency'
export interface Requirement {
  name: string
  category: Category
  level: Level
  importance: number
  verify: string
}
export interface Job {
  id: string
  title: string
  company: string
  dept: string
  location: string
  type: string
  exp: string
  edu: string
  salary: string
  status: 'Published' | 'Draft' | 'Closed'
  applicants: number
  screened: number
  posted: string
  description: string
  mandatory: Requirement[]
  preferred: Requirement[]
  weights: Record<WKey, number>
  mine: boolean
}

export type WKey = 'tech' | 'exp' | 'edu' | 'proj' | 'pref' | 'comp'
export const W_KEYS: { k: WKey; label: string; hint: string }[] = [
  { k: 'tech', label: 'Technical skills', hint: 'Demonstrated proficiency in required tools and languages' },
  { k: 'exp', label: 'Relevant experience', hint: 'Years and depth of comparable roles' },
  { k: 'edu', label: 'Education & certifications', hint: 'Degrees, certifications, formal training' },
  { k: 'proj', label: 'Projects & portfolio', hint: 'Shipped work that evidences the skills' },
  { k: 'pref', label: 'Preferred skills', hint: 'Nice-to-haves that raise the match' },
  { k: 'comp', label: 'Professional competencies', hint: 'Leadership, collaboration, communication evidence' },
]

const R = (name: string, level: Level, importance: number, verify: string, category: Category = 'Technical skill'): Requirement => ({ name, category, level, importance, verify })

export const COMPANY = 'Aarya Analytics'

export const INITIAL_JOBS: Job[] = [
  {
    id: 'j1', title: 'Senior Frontend Engineer', company: COMPANY, dept: 'Engineering', location: 'Bengaluru, Karnataka (Hybrid)', type: 'Full-time', exp: '5+ years', edu: "Bachelor's in CS or equivalent experience", salary: '₹32L – ₹45L', status: 'Published', applicants: 142, screened: 142, posted: 'Sep 22, 2026',
    description: 'Own the customer-facing web platform for our analytics suite. You will lead architecture for a React + TypeScript codebase, mentor engineers, and partner with design on a shared component system.',
    mandatory: [R('React', 'Advanced', 5, 'Resume + project evidence'), R('TypeScript', 'Advanced', 5, 'Resume + code sample'), R('Frontend experience (5+ yrs)', 'Advanced', 4, 'Employment history', 'Competency')],
    preferred: [R('GraphQL', 'Intermediate', 3, 'Resume evidence'), R('Testing (Jest / RTL)', 'Intermediate', 3, 'Resume + assessment'), R('Design systems', 'Intermediate', 3, 'Portfolio')],
    weights: { tech: 30, exp: 25, edu: 10, proj: 15, pref: 10, comp: 10 }, mine: true,
  },
  {
    id: 'j2', title: 'Data Scientist, Matching', company: COMPANY, dept: 'AI Research', location: 'Hyderabad, Telangana (Hybrid)', type: 'Full-time', exp: '3+ years', edu: "Master's preferred", salary: '₹24L – ₹36L', status: 'Published', applicants: 96, screened: 61, posted: 'Sep 30, 2026',
    description: 'Build ranking and retrieval models that power candidate-to-role matching. Run experiments, evaluate fairness metrics and partner with product to ship explainable models.',
    mandatory: [R('Python', 'Advanced', 5, 'Resume + assessment'), R('Machine learning', 'Advanced', 5, 'Project evidence'), R('SQL', 'Intermediate', 3, 'Assessment')],
    preferred: [R('NLP', 'Intermediate', 4, 'Project evidence'), R('Experiment design', 'Intermediate', 3, 'Resume evidence')],
    weights: { tech: 35, exp: 20, edu: 15, proj: 15, pref: 10, comp: 5 }, mine: true,
  },
  {
    id: 'j3', title: 'Product Designer', company: COMPANY, dept: 'Design', location: 'Mumbai, Maharashtra', type: 'Full-time', exp: '4+ years', edu: 'Any', salary: '₹20L – ₹30L', status: 'Published', applicants: 174, screened: 158, posted: 'Aug 28, 2026',
    description: 'Shape the end-to-end hiring experience for recruiters and applicants, from research to polished, accessible interface design.',
    mandatory: [R('Figma', 'Expert', 5, 'Portfolio'), R('User research', 'Advanced', 4, 'Case study')],
    preferred: [R('Prototyping', 'Advanced', 3, 'Portfolio'), R('Accessibility (WCAG)', 'Intermediate', 3, 'Case study')],
    weights: { tech: 25, exp: 20, edu: 5, proj: 35, pref: 10, comp: 5 }, mine: true,
  },
  {
    id: 'j4', title: 'DevOps Engineer', company: COMPANY, dept: 'Platform', location: 'Remote (India)', type: 'Contract', exp: '4+ years', edu: 'Any', salary: '₹2.2L/month', status: 'Closed', applicants: 64, screened: 64, posted: 'Jul 14, 2026',
    description: 'Harden CI/CD pipelines and manage Kubernetes infrastructure.',
    mandatory: [R('Kubernetes', 'Advanced', 5, 'Assessment'), R('Terraform', 'Advanced', 4, 'Resume evidence')],
    preferred: [R('Observability', 'Intermediate', 3, 'Resume evidence')],
    weights: { tech: 40, exp: 25, edu: 5, proj: 10, pref: 10, comp: 10 }, mine: true,
  },
  {
    id: 'j5', title: 'Customer Success Manager', company: COMPANY, dept: 'Customer', location: 'Gurugram, Haryana', type: 'Full-time', exp: '3+ years', edu: "Bachelor's", salary: '₹15L – ₹22L', status: 'Draft', applicants: 0, screened: 0, posted: 'Draft',
    description: 'Partner with enterprise recruiting teams to drive onboarding, adoption and renewals.',
    mandatory: [R('Account management', 'Advanced', 4, 'Resume evidence', 'Competency')], preferred: [R('SaaS onboarding', 'Intermediate', 3, 'Resume evidence')],
    weights: { tech: 15, exp: 30, edu: 10, proj: 10, pref: 10, comp: 25 }, mine: true,
  },
  {
    id: 'j6', title: 'Staff UI Engineer', company: 'Swasthya Health', dept: 'Engineering', location: 'Bengaluru, Karnataka', type: 'Full-time', exp: '7+ years', edu: "Bachelor's", salary: '₹38L – ₹52L', status: 'Published', applicants: 58, screened: 58, posted: 'Oct 1, 2026',
    description: 'Set technical direction for clinical interfaces used by 40,000 care providers.',
    mandatory: [R('React', 'Expert', 5, ''), R('TypeScript', 'Expert', 5, ''), R('Accessibility (WCAG)', 'Advanced', 4, '')], preferred: [R('Design systems', 'Advanced', 3, ''), R('Web performance', 'Advanced', 3, '')],
    weights: { tech: 30, exp: 25, edu: 10, proj: 15, pref: 10, comp: 10 }, mine: false,
  },
  {
    id: 'j7', title: 'Design Systems Engineer', company: 'Rangrez Systems', dept: 'Design Technology', location: 'Pune, Maharashtra (Hybrid)', type: 'Full-time', exp: '4+ years', edu: 'Any', salary: '₹22L – ₹32L', status: 'Published', applicants: 41, screened: 41, posted: 'Oct 3, 2026',
    description: 'Maintain a multi-brand component library and its documentation, tokens and release tooling.',
    mandatory: [R('React', 'Advanced', 5, ''), R('CSS architecture', 'Advanced', 4, ''), R('Design systems', 'Advanced', 5, '')], preferred: [R('Storybook', 'Intermediate', 3, ''), R('Accessibility (WCAG)', 'Intermediate', 3, '')],
    weights: { tech: 30, exp: 20, edu: 5, proj: 25, pref: 10, comp: 10 }, mine: false,
  },
  {
    id: 'j8', title: 'Full-Stack Engineer', company: 'Nivaan Payments', dept: 'Product Engineering', location: 'Chennai, Tamil Nadu (Hybrid)', type: 'Full-time', exp: '5+ years', edu: "Bachelor's", salary: '₹28L – ₹40L', status: 'Published', applicants: 87, screened: 87, posted: 'Oct 5, 2026',
    description: 'Build payment-flow features across a TypeScript/Node.js stack on AWS with strong test discipline.',
    mandatory: [R('React', 'Advanced', 5, ''), R('TypeScript', 'Advanced', 5, ''), R('Node.js', 'Advanced', 4, ''), R('PostgreSQL', 'Intermediate', 4, '')], preferred: [R('Docker', 'Intermediate', 3, ''), R('AWS', 'Intermediate', 3, ''), R('CI/CD', 'Intermediate', 2, ''), R('Testing (Jest / RTL)', 'Intermediate', 3, '')],
    weights: { tech: 35, exp: 20, edu: 10, proj: 15, pref: 15, comp: 5 }, mine: false,
  },
]

export type ReqState = 'met' | 'partial' | 'unverified' | 'none'
export interface ReqRow { name: string; kind: 'mandatory' | 'preferred'; state: ReqState; evidence: string; source: string }
export interface Candidate {
  id: string; name: string; headline: string; location: string; email: string; years: number; edu: string; certs: string[]; projects: string[]
  sub: Record<WKey, number>; processing?: 'processing' | 'failed'; reqs: ReqRow[]; skills: string[]; applied: string; summary: string
}

const rows = (a: [ReqState, string, string][]): ReqRow[] => {
  const names = ['React', 'TypeScript', 'Frontend experience (5+ yrs)', 'GraphQL', 'Testing (Jest / RTL)', 'Design systems']
  return a.map((r, i) => ({ name: names[i], kind: i < 3 ? 'mandatory' : 'preferred', state: r[0], evidence: r[1], source: r[2] }))
}

export const CANDIDATES: Candidate[] = [
  {
    id: 'c1', name: 'Priya Raman', headline: 'Senior Frontend Engineer, Swasthya Health', location: 'Bengaluru, Karnataka', email: 'priya.raman@mail.com', years: 7, edu: 'B.Tech. Computer Science, NIT Tiruchirappalli', certs: ['AWS Certified Developer – Associate'], projects: ['Design system migration (40+ components)', 'Real-time clinical dashboard (React, GraphQL)'],
    sub: { tech: 94, exp: 92, edu: 85, proj: 90, pref: 88, comp: 86 }, applied: 'Sep 24', skills: ['React', 'TypeScript', 'GraphQL', 'Jest', 'Storybook', 'Node.js', 'Tailwind CSS', 'Accessibility'],
    summary: 'Led the React 18 migration across three product teams and built a 40-component design system adopted by 6 squads.',
    reqs: rows([['met', 'Led React 18 migration for 3 product teams; owns clinical dashboard architecture.', 'Experience · Swasthya Health'], ['met', 'Introduced strict-mode TypeScript across a 400k-line monorepo.', 'Experience · Swasthya Health'], ['met', '7 years: Swasthya Health (4y), Kalpa Digital (3y).', 'Employment history'], ['met', 'Built GraphQL gateway consumers with Apollo for 12 clinical views.', 'Projects'], ['met', 'Raised test coverage from 48% to 86% using RTL and Jest.', 'Experience · Swasthya Health'], ['met', 'Authored and documented 40+ component design system in Storybook.', 'Projects']]),
  },
  {
    id: 'c8', name: 'Jamal Wright', headline: 'Frontend Engineer, VyaparStack', location: 'Hyderabad, Telangana', email: 'jamal.wright@mail.com', years: 6, edu: 'B.Tech. Software Engineering, IIIT Hyderabad', certs: [], projects: ['Merchant analytics portal', 'Open-source charting library (1.2k stars)'],
    sub: { tech: 90, exp: 88, edu: 80, proj: 85, pref: 86, comp: 84 }, applied: 'Sep 26', skills: ['React', 'TypeScript', 'Apollo', 'Jest', 'D3', 'Next.js'],
    summary: 'Six years shipping analytics UIs; maintainer of an open-source charting library.',
    reqs: rows([['met', 'Built merchant analytics portal in React with 200k MAU.', 'Experience · VyaparStack'], ['met', 'TypeScript migration lead; typed 90% of the codebase.', 'Experience · VyaparStack'], ['met', '6 years across VyaparStack and Setu Labs.', 'Employment history'], ['partial', 'Used Apollo Client in two projects; no server-side schema work shown.', 'Projects'], ['met', 'Maintains Jest + Playwright suites with CI gating.', 'Open source'], ['partial', 'Contributed to a shared component kit; not primary author.', 'Experience · VyaparStack']]),
  },
  {
    id: 'c2', name: 'Marcus Chen', headline: 'Lead Web Engineer, BazaarKart', location: 'Gurugram, Haryana', email: 'marcus.chen@mail.com', years: 8, edu: 'B.E. Information Science, BMSCE Bengaluru', certs: ['Certified Scrum Master'], projects: ['Checkout rebuild (React)', 'Internal CMS'],
    sub: { tech: 88, exp: 85, edu: 80, proj: 78, pref: 80, comp: 82 }, applied: 'Sep 25', skills: ['React', 'TypeScript', 'Redux', 'Jest', 'GraphQL', 'Webpack'],
    summary: 'Eight years of web engineering, most recently leading a 6-person team on a checkout rebuild.',
    reqs: rows([['met', 'Rebuilt checkout in React serving 3M monthly sessions.', 'Experience · BazaarKart'], ['met', 'TypeScript across checkout and CMS packages.', 'Experience · BazaarKart'], ['met', '8 years of progressive frontend roles.', 'Employment history'], ['unverified', 'GraphQL appears in the skills list only; no project or role evidence found.', 'Skills list'], ['met', 'Unit and integration tests described for checkout flows.', 'Experience · BazaarKart'], ['partial', 'Contributed tokens to a shared theme package.', 'Projects']]),
  },
  {
    id: 'c3', name: 'Elena Rossi', headline: 'Software Engineer, Loom Digital India', location: 'Mumbai, Maharashtra', email: 'elena.rossi@mail.com', years: 5.2, edu: 'M.Tech. Computer Engineering, IIT Bombay', certs: [], projects: ['Fashion-commerce storefront', 'Realtime inventory dashboard'],
    sub: { tech: 80, exp: 76, edu: 75, proj: 70, pref: 72, comp: 74 }, applied: 'Sep 27', skills: ['React', 'TypeScript', 'Vue', 'Node.js', 'Cypress'],
    summary: 'Five years building storefronts and dashboards for leading Indian retail brands.',
    reqs: rows([['met', 'Primary React developer on storefront serving 14 markets.', 'Experience · Loom Digital India'], ['met', 'TypeScript used across storefront and dashboard repos.', 'Projects'], ['met', '5 years 2 months across two employers.', 'Employment history'], ['none', 'No GraphQL evidence found in resume. This is not proof of a skill gap.', '—'], ['partial', 'Cypress end-to-end testing; unit-testing experience not described.', 'Experience'], ['unverified', 'Mentions "UI kit" but scope is unclear.', 'Experience']]),
  },
  {
    id: 'c4', name: 'Daniel Okafor', headline: 'Frontend Developer, Freelance / Prakash Digital', location: 'Pune, Maharashtra', email: 'daniel.okafor@mail.com', years: 4.5, edu: 'B.Tech. Computer Science, VIT Vellore', certs: ['Meta Front-End Developer Certificate'], projects: ['Telehealth booking app', 'Component playground'],
    sub: { tech: 74, exp: 70, edu: 70, proj: 68, pref: 66, comp: 72 }, applied: 'Sep 29', skills: ['React', 'TypeScript', 'Next.js', 'Jest'],
    summary: 'Four and a half years of titled frontend roles, plus freelance work not dated in the resume.',
    reqs: rows([['met', 'Built telehealth booking app in React and Next.js.', 'Projects'], ['met', 'TypeScript used in two of three roles.', 'Experience'], ['unverified', '4 yrs 6 mo in titled roles; freelance period (2021–22) is undated and may meet the 5-year bar.', 'Employment history'], ['none', 'No GraphQL evidence found in resume.', '—'], ['partial', 'Jest unit tests mentioned for one project.', 'Projects'], ['none', 'No design system work described.', '—']]),
  },
  {
    id: 'c5', name: 'Aisha Khan', headline: 'Web Developer, JanSeva Digital', location: 'New Delhi, Delhi', email: 'aisha.khan@mail.com', years: 6, edu: 'B.Sc. Mathematics & CS, University of Delhi', certs: ['Google UX Design Certificate'], projects: ['Government forms portal', 'Accessible date-picker'],
    sub: { tech: 70, exp: 62, edu: 85, proj: 60, pref: 58, comp: 66 }, applied: 'Sep 30', skills: ['React', 'JavaScript', 'Sass', 'Jest', 'Accessibility'],
    summary: 'Six years of web development with a strong accessibility focus; resume lists JavaScript only.',
    reqs: rows([['met', 'Built government forms portal in React 17/18.', 'Experience · JanSeva Digital'], ['none', 'No TypeScript mentioned; projects list "JavaScript (ES2022)". May be unlisted, so request verification.', '—'], ['met', '6 years of web development.', 'Employment history'], ['partial', 'REST consumption only; GraphQL not mentioned.', 'Projects'], ['met', 'Jest and axe-core tests documented.', 'Experience'], ['none', 'No design system evidence found.', '—']]),
  },
  { id: 'c6', name: 'Tom Becker', headline: 'Parsing resume…', location: '—', email: 'tom.becker@mail.com', years: 0, edu: '—', certs: [], projects: [], sub: { tech: 0, exp: 0, edu: 0, proj: 0, pref: 0, comp: 0 }, processing: 'processing', reqs: [], skills: [], applied: 'Oct 8', summary: '' },
  { id: 'c7', name: 'Sofia Lindqvist', headline: 'Resume could not be read', location: '—', email: 'sofia.lindqvist@mail.com', years: 0, edu: '—', certs: [], projects: [], sub: { tech: 0, exp: 0, edu: 0, proj: 0, pref: 0, comp: 0 }, processing: 'failed', reqs: [], skills: [], applied: 'Oct 7', summary: '' },
]

export type Status = 'Meets Requirements' | 'Potential Match' | 'Needs Verification' | 'Mandatory Requirement Concern' | 'Processing' | 'Unable to Process'

export const calcScore = (sub: Record<WKey, number>, w: Record<WKey, number>) => Math.round(W_KEYS.reduce((s, { k }) => s + (sub[k] * w[k]) / 100, 0))
export const mandatoryOf = (c: Candidate) => c.reqs.filter((r) => r.kind === 'mandatory')
export function getStatus(c: Candidate, w: Record<WKey, number>): Status {
  if (c.processing === 'processing') return 'Processing'
  if (c.processing === 'failed') return 'Unable to Process'
  const m = mandatoryOf(c)
  if (m.some((r) => r.state === 'none')) return 'Mandatory Requirement Concern'
  if (m.some((r) => r.state === 'unverified' || r.state === 'partial')) return 'Needs Verification'
  return calcScore(c.sub, w) >= 80 ? 'Meets Requirements' : 'Potential Match'
}

export interface Interview { id: string; candId: string; jobId: string; date: string; time: string; type: string; interviewers: string[]; status: 'Scheduled' | 'Completed'; feedback?: { rating: number; note: string } }
export const INITIAL_INTERVIEWS: Interview[] = [
  { id: 'i1', candId: 'c1', jobId: 'j1', date: 'Oct 14, 2026', time: '10:30 AM', type: 'Technical (Video)', interviewers: ['Dana Whitfield', 'Raj Patel'], status: 'Scheduled' },
  { id: 'i2', candId: 'c8', jobId: 'j1', date: 'Oct 8, 2026', time: '2:00 PM', type: 'Recruiter screen', interviewers: ['Dana Whitfield'], status: 'Completed', feedback: { rating: 4, note: 'Clear communicator; deep React fundamentals. Probe GraphQL schema design next round.' } },
]

export interface ApplicantApplication { jobId: string; status: 'Submitted' | 'Under Review' | 'Shortlisted' | 'Interview Scheduled'; date: string; score?: number; note?: string }
export const INITIAL_APPS: ApplicantApplication[] = [
  { jobId: 'j1', status: 'Interview Scheduled', date: 'Sep 24, 2026', score: 91 },
  { jobId: 'j6', status: 'Under Review', date: 'Oct 4, 2026', score: 84 },
]

export type SkillState = 'met' | 'partial' | 'unverified' | 'none' | 'gap'
export const PRIYA_SKILLS: Record<string, { state: SkillState; note: string }> = {
  React: { state: 'met', note: 'Led React 18 migration, Swasthya Health' },
  TypeScript: { state: 'met', note: 'Strict-mode monorepo, 6 years' },
  'Frontend experience (5+ yrs)': { state: 'met', note: '7 years in role history' },
  GraphQL: { state: 'met', note: 'Clinical dashboard project' },
  'Testing (Jest / RTL)': { state: 'met', note: 'Coverage 48% → 86%' },
  'Design systems': { state: 'met', note: '40-component library' },
  'Node.js': { state: 'met', note: 'BFF services at Kalpa Digital' },
  'Accessibility (WCAG)': { state: 'partial', note: 'Audits mentioned; no WCAG certification shown' },
  AWS: { state: 'unverified', note: 'Certification listed; no hands-on project evidence' },
  'Web performance': { state: 'met', note: 'Cut LCP by 38% on patient portal' },
  Storybook: { state: 'met', note: 'Documented design system' },
  'CSS architecture': { state: 'met', note: 'Tailwind + token architecture' },
  PostgreSQL: { state: 'none', note: '' },
  Docker: { state: 'gap', note: 'Self-assessed as Beginner in profile' },
  'CI/CD': { state: 'partial', note: 'GitHub Actions pipelines mentioned briefly' },
}
export const SUGGESTIONS: Record<string, string> = {
  PostgreSQL: 'Add a project or role that used relational databases, or take the free "PostgreSQL for Developers" course and build a small CRUD API.',
  Docker: 'Containerize an existing side project and publish the Dockerfile in your portfolio. Complete a Docker fundamentals lab.',
  AWS: 'Describe one deployment you ran on AWS (S3 + CloudFront or Lambda) with outcomes to turn your certification into evidence.',
  'CI/CD': 'Expand your resume bullet on GitHub Actions: pipeline stages, deploy frequency, rollback strategy.',
  'Accessibility (WCAG)': 'Link an accessibility audit you led and the WCAG criteria fixed.',
}
export const SAMPLE_NOTIF = ['Interview scheduled: Oct 14, 10:30 AM with Aarya Analytics', 'Your application to Staff UI Engineer moved to Under Review', '3 new roles match your skills']

export const ACTIVITY = [
  { t: '12 min ago', text: 'AI screening completed for Senior Frontend Engineer (142 resumes)', kind: 'ai' },
  { t: '1 h ago', text: 'Priya Raman accepted interview slot for Oct 14', kind: 'int' },
  { t: '3 h ago', text: 'Jamal Wright added to shortlist by Dana Whitfield', kind: 'short' },
  { t: 'Yesterday', text: 'Product Designer closed to new applications at 174', kind: 'job' },
  { t: 'Yesterday', text: '2 resumes need manual review (unreadable PDF)', kind: 'warn' },
]
export const APPLICATION_VOLUME = [22, 31, 28, 44, 52, 39, 61, 58, 73, 66, 81, 94]
export const MONTHS = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']
