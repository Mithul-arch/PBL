import { ArrowRight, Briefcase, FileSearch, GitCompare, Scale, ShieldCheck, Target, UserRound, Upload, Cpu, UsersRound, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button, Logo, ScoreRing, StatusBadge, Tag } from '../components/ui'
import { useApp } from '../lib/store'
import { getLandingSection, LANDING_SECTIONS } from '../lib/navigation'

const FEATURES = [
  { i: FileSearch, t: 'Evidence-aware screening', d: 'Every score links back to the exact resume lines that support it, so reviewers verify instead of guess.' },
  { i: ShieldCheck, t: 'Mandatory vs. weighted', d: 'Eligibility is kept apart from the match score. A high number never hides a missing compulsory requirement.' },
  { i: Target, t: 'Skill gap reports', d: 'Separate missing resume evidence from confirmed deficiencies, with learning suggestions for applicants.' },
  { i: GitCompare, t: 'Side-by-side comparison', d: 'Compare two to four candidates across skills, experience, qualifications and projects.' },
  { i: Scale, t: 'Fairness by design', d: 'Protected characteristics are excluded from scoring, and every outcome stays open to human review.' },
  { i: UsersRound, t: 'One connected pipeline', d: 'From job posting to shortlist and interview feedback, recruiters and applicants share one source of truth.' },
]

const AI_PRINCIPLES = [
  { i: FileSearch, t: 'Evidence, not assumptions', d: 'Review the resume evidence behind a score. “No resume evidence” means the document does not demonstrate a requirement—not that the person lacks the skill. Unclear claims should be verified through an interview, assessment or portfolio.' },
  { i: UsersRound, t: 'People make the decision', d: 'Scores support a recruiter’s review; they are not a hiring verdict. Mandatory requirements are shown separately from the weighted match score so that a high number does not hide an important concern.' },
  { i: Scale, t: 'Relevant criteria, visible limitations', d: 'The screening approach focuses on job-related requirements, not age, gender, photos or other protected characteristics. Excluding those fields alone cannot eliminate bias: a real deployment needs testing for proxy signals and unequal outcomes.' },
  { i: ShieldCheck, t: 'Applicants can review their information', d: 'Applicants can review and correct sample extracted resume data before using it in the application flow. Skill gap reports distinguish missing evidence from confirmed gaps, helping applicants understand what needs clarification.' },
]

export default function Landing() {
  const { go } = useApp()
  const [menu, setMenu] = useState(false)
  useEffect(() => {
    let frame = 0
    const scrollToSection = () => {
      cancelAnimationFrame(frame)
      const section = getLandingSection(window.location.hash)
      if (!section) return
      frame = requestAnimationFrame(() => {
        const target = document.getElementById(section)
        target?.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
          block: 'start',
        })
        target?.focus({ preventScroll: true })
      })
    }
    scrollToSection()
    window.addEventListener('hashchange', scrollToSection)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('hashchange', scrollToSection)
    }
  }, [])
  return (
    <div className="thermal-page">
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between">
          <Logo light />
          <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-8 text-sm font-medium text-indigo-100/80">
            {LANDING_SECTIONS.map((section) => <a key={section.id} href={`#${section.id}`} className="hover:text-white">{section.label}</a>)}
          </nav>
          <div className="hidden lg:flex gap-2">
            <Button variant="ghost" className="!text-indigo-100 hover:!bg-white/10" onClick={() => go('/login/applicant')}>Applicant login</Button>
            <Button variant="light" onClick={() => go('/login/recruiter')}>Recruiter login</Button>
          </div>
          <button className="lg:hidden text-white p-2" aria-label="Menu" aria-expanded={menu} aria-controls="landing-menu" onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button>
        </div>
        {menu && (
          <div id="landing-menu" className="lg:hidden mx-5 rounded-2xl bg-white p-3 shadow-pop flex flex-col gap-1">
            <nav aria-label="Mobile navigation" className="flex flex-col border-b border-line pb-2 mb-1">
              {LANDING_SECTIONS.map((section) => <a key={section.id} href={`#${section.id}`} onClick={() => setMenu(false)} className="rounded-xl px-4 py-3 text-sm font-semibold text-navy hover:bg-indigo-50">{section.label}</a>)}
            </nav>
            <Button variant="ghost" onClick={() => go('/login/recruiter')}>Recruiter login</Button>
            <Button variant="ghost" onClick={() => go('/login/applicant')}>Applicant login</Button>
          </div>
        )}
      </header>

      <section className="thermal-dark relative text-white overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-36 pb-24 grid lg:grid-cols-[1.05fr_1fr] gap-14 items-center">
          <div className="fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/15 px-3 py-1 text-xs font-semibold text-indigo-100"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />AI-assisted, human-decided</span>
            <h1 className="mt-6 text-[40px] sm:text-6xl font-extrabold tracking-tight leading-[1.04]">Hire Smarter.<br />Match Skills.<br /><span className="text-indigo-300">Build Better Teams.</span></h1>
            <p className="mt-6 text-lg text-indigo-100/80 max-w-xl leading-relaxed">TalentIQ matches resumes against your real job requirements, scores candidates across weighted criteria with cited evidence, and surfaces skill gaps, so your team spends time on people, not paperwork.</p>
            <div className="mt-9 grid sm:grid-cols-2 gap-3 max-w-xl">
              <button onClick={() => go('/login/recruiter')} className="group text-left rounded-2xl bg-white text-navy p-5 hover:-translate-y-0.5 transition shadow-pop">
                <Briefcase className="text-indigo-600" size={22} />
                <div className="mt-3 font-bold">Recruiter / Company Login</div>
                <div className="text-sm text-mute mt-0.5 flex items-center gap-1">Post jobs and screen talent <ArrowRight size={14} className="group-hover:translate-x-1 transition" /></div>
              </button>
              <button onClick={() => go('/login/applicant')} className="group text-left rounded-2xl bg-indigo-600 text-white p-5 hover:-translate-y-0.5 hover:bg-indigo-500 transition ring-1 ring-white/20">
                <UserRound size={22} className="text-indigo-200" />
                <div className="mt-3 font-bold">Job Applicant Login</div>
                <div className="text-sm text-indigo-100 mt-0.5 flex items-center gap-1">Upload resume, find roles <ArrowRight size={14} className="group-hover:translate-x-1 transition" /></div>
              </button>
            </div>
          </div>

          <div className="relative fade-up" style={{ animationDelay: '.15s' }}>
            <div className="rounded-3xl bg-white text-ink p-5 shadow-pop ring-1 ring-white/20">
              <div className="flex items-center justify-between">
                <div><div className="text-xs font-semibold text-mute">AI SCREENING · Senior Frontend Engineer</div><div className="font-bold text-navy">142 candidates</div></div>
                <span className="text-[11px] font-semibold rounded-full bg-amber-50 text-amber-800 px-2 py-0.5 ring-1 ring-amber-200">Prototype · simulated</span>
              </div>
              <div className="mt-4 space-y-2.5">
                {[['Priya Raman', 91, 'Meets Requirements'], ['Daniel Okafor', 71, 'Needs Verification'], ['Aisha Khan', 66, 'Mandatory Requirement Concern']].map(([n, s, st]) => (
                  <div key={n as string} className="flex items-center gap-3 rounded-xl border border-line p-3">
                    <ScoreRing score={s as number} size={46} stroke={5} />
                    <div className="min-w-0 flex-1"><div className="font-semibold text-sm text-navy">{n}</div><div className="mt-1"><StatusBadge status={st as 'Meets Requirements'} /></div></div>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl bg-slate-50 p-3.5 text-[13px] text-mute leading-relaxed">
                <div className="font-semibold text-navy mb-1">Why 91? Evidence cited</div>
                "Led React 18 migration for 3 product teams…" <div className="mt-2 flex gap-1.5 flex-wrap"><Tag tone="green">React ✓</Tag><Tag tone="green">TypeScript ✓</Tag><Tag tone="amber">GraphQL: verify</Tag></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-canvas/75">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[['68%', 'less time on first-pass screening'], ['100%', 'scores traceable to resume evidence'], ['6', 'weighted criteria you control'], ['0', 'protected attributes used in scoring']].map(([n, l]) => (
            <div key={l}><div className="text-3xl font-extrabold text-navy tabular">{n}</div><div className="text-sm text-mute mt-1">{l}</div></div>
          ))}
        </div>
      </section>

      <section id="features" tabIndex={-1} aria-labelledby="features-title" className="scroll-mt-6 focus-visible:outline-none max-w-7xl mx-auto px-5 sm:px-8 py-24">
        <div className="max-w-2xl"><div className="text-sm font-bold text-indigo-600">PLATFORM</div><h2 id="features-title" className="text-3xl sm:text-4xl font-bold tracking-tight text-navy mt-2">Screening you can explain to a hiring manager, and to a candidate.</h2></div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div key={f.t} className="rounded-2xl border border-line p-6 hover:shadow-card hover:-translate-y-0.5 transition bg-white">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 grid place-items-center"><f.i size={21} /></div>
              <h3 className="mt-4 font-bold text-navy">{f.t}</h3>
              <p className="text-sm text-mute mt-1.5 leading-relaxed">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how" tabIndex={-1} aria-labelledby="how-title" className="scroll-mt-6 focus-visible:outline-none thermal-dark text-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-24">
          <div className="text-sm font-bold text-indigo-300">HOW IT WORKS</div>
          <h2 id="how-title" className="text-3xl sm:text-4xl font-bold tracking-tight mt-2 max-w-xl">From job post to shortlist in three steps.</h2>
          <div className="mt-12 grid md:grid-cols-3 gap-5">
            {[[Briefcase, 'Define', 'Set mandatory skills, preferred skills and screening weights that total 100%.'], [Cpu, 'Screen', 'Resumes are parsed and compared to each requirement, with every score explained.'], [UsersRound, 'Decide', 'Compare candidates, shortlist, schedule interviews and record feedback.']].map(([I, t, d], i) => {
              const Icon = I as typeof Upload
              return (
                <div key={t as string} className="relative rounded-2xl bg-navy-2 ring-1 ring-white/10 p-7">
                  <div className="text-5xl font-extrabold text-white/10 absolute right-6 top-4">0{i + 1}</div>
                  <Icon className="text-indigo-300" />
                  <h3 className="mt-5 text-xl font-bold">{t as string}</h3>
                  <p className="mt-2 text-indigo-100/75 leading-relaxed text-[15px]">{d as string}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section id="fair" tabIndex={-1} aria-labelledby="fair-title" className="scroll-mt-6 focus-visible:outline-none max-w-7xl mx-auto px-5 sm:px-8 py-24">
        <div className="max-w-2xl">
          <div className="text-sm font-bold text-indigo-600">RESPONSIBLE AI</div>
          <h2 id="fair-title" className="text-3xl sm:text-4xl font-bold tracking-tight text-navy mt-2">Responsible AI. Human accountability.</h2>
          <p className="mt-4 text-mute leading-relaxed">A missing keyword is not a missing skill. TalentIQ is designed to help people understand the evidence behind a match, question uncertain results and make informed decisions—not replace human judgment.</p>
        </div>
        <div className="mt-10 grid md:grid-cols-2 gap-5">
          {AI_PRINCIPLES.map((principle) => (
            <article key={principle.t} className="rounded-2xl border border-line bg-white p-6 sm:p-7 shadow-card">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 grid place-items-center"><principle.i size={21} /></div>
              <h3 className="mt-4 font-bold text-navy text-lg">{principle.t}</h3>
              <p className="mt-2 text-sm text-mute leading-relaxed">{principle.d}</p>
            </article>
          ))}
        </div>
        <div className="mt-6 rounded-2xl bg-indigo-50 border border-line p-6 flex gap-4 items-start">
          <ShieldCheck className="shrink-0 text-indigo-700 mt-0.5" size={22} />
          <div>
            <h3 className="font-bold text-navy">What this demo does—and does not do</h3>
            <p className="mt-2 text-sm text-mute leading-relaxed">AI scores, resume parsing and sign-in are simulated. Resume files are not actually uploaded or parsed; the review flow uses sample data. Changes are held in memory and reset on refresh. This is not a validated hiring model or a claim of regulatory compliance. Production use would require secure storage, access controls, consent and retention policies, and ongoing accuracy and fairness evaluation.</p>
          </div>
        </div>
        <div className="mt-12 rounded-3xl thermal-dark p-7 sm:p-8 text-white flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold">Explore the evidence from either side.</h3>
            <p className="text-indigo-100/75 mt-2">Pick a portal. Demo credentials are pre-filled.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="lg" variant="light" onClick={() => go('/login/recruiter')}>Recruiter portal</Button>
            <Button size="lg" onClick={() => go('/login/applicant')} className="ring-1 ring-white/25">Applicant portal</Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row gap-3 justify-between items-center text-sm text-mute"><Logo /><span>© 2026 TalentIQ. Prototype with simulated data.</span></div>
      </footer>
    </div>
  )
}
