import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { INITIAL_APPS, INITIAL_INTERVIEWS, INITIAL_JOBS, type ApplicantApplication, type Interview, type Job } from './data'
import { canPublishJob } from './jobRules'
import { getLandingSection, getRouteFromHash } from './navigation'
import type { Parsed } from '../pages/applicant/shared'

export interface Session { role: 'recruiter' | 'applicant'; name: string; email: string; fresh?: boolean }
export interface ResumeFile { name: string; size: number; parsed: boolean; reviewed?: boolean; data?: Parsed }

interface Ctx {
  route: string
  go: (p: string) => void
  session: Session | null
  login: (s: Session) => void
  logout: () => void
  jobs: Job[]
  saveJob: (j: Job) => void
  setJobStatus: (id: string, s: Job['status']) => void
  editingId: string | null
  setEditingId: (id: string | null) => void
  screeningJob: string
  setScreeningJob: (id: string) => void
  shortlist: string[]
  toggleShortlist: (id: string) => void
  decisions: Record<string, string>
  setDecision: (id: string, d: string) => void
  notes: Record<string, string>
  setNote: (id: string, n: string) => void
  interviews: Interview[]
  addInterview: (i: Interview) => void
  updateInterview: (id: string, p: Partial<Interview>) => void
  compare: string[]
  toggleCompare: (id: string) => void
  clearCompare: () => void
  apps: ApplicantApplication[]
  apply: (jobId: string, note?: string) => boolean
  saved: string[]
  toggleSaved: (id: string) => void
  resume: ResumeFile | null
  setResume: (r: ResumeFile | null) => void
  toast: (m: string) => void
  toastMsg: string | null
}

const C = createContext<Ctx>(null as unknown as Ctx)
export const useApp = () => useContext(C)

const readHash = () => getRouteFromHash(window.location.hash)

export function Provider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState(readHash())
  const [session, setSession] = useState<Session | null>(null)
  const [jobs, setJobs] = useState(INITIAL_JOBS)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [screeningJob, setScreeningJob] = useState('j1')
  const [shortlist, setShortlist] = useState(['c1', 'c8'])
  const [decisions, setDecisions] = useState<Record<string, string>>({})
  const [notes, setNotes] = useState<Record<string, string>>({ c1: 'Strong systems thinking in the first call. Verify GraphQL schema ownership in tech round.' })
  const [interviews, setInterviews] = useState(INITIAL_INTERVIEWS)
  const [compare, setCompare] = useState<string[]>([])
  const [apps, setApps] = useState(INITIAL_APPS)
  const submittedJobs = useRef(new Set(INITIAL_APPS.map((app) => app.jobId)))
  const [saved, setSaved] = useState<string[]>(['j7'])
  const [resume, setResume] = useState<ResumeFile | null>({ name: 'Priya_Raman_Resume.pdf', size: 248000, parsed: true, reviewed: true })
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  useEffect(() => {
    const f = () => {
      setRoute(readHash())
      if (!getLandingSection(window.location.hash)) window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', f)
    return () => window.removeEventListener('hashchange', f)
  }, [])
  useEffect(() => {
    if (!toastMsg) return
    const t = setTimeout(() => setToastMsg(null), 2800)
    return () => clearTimeout(t)
  }, [toastMsg])

  const go = useCallback((p: string) => { window.location.hash = p }, [])
  const toast = useCallback((m: string) => setToastMsg(m), [])
  const tog = (set: React.Dispatch<React.SetStateAction<string[]>>) => (id: string) => set((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]))

  const value = useMemo<Ctx>(() => ({
    route, go, session, toast, toastMsg,
    login: (s) => {
      setSession(s)
      if (s.role === 'applicant' && s.fresh) { setApps([]); submittedJobs.current.clear(); setResume(null); setSaved([]) }
    },
    logout: () => { setSession(null); window.location.hash = '/' },
    jobs,
    saveJob: (j) => {
      if (j.status === 'Published' && !canPublishJob(j)) return
      setJobs((a) => (a.some((x) => x.id === j.id) ? a.map((x) => (x.id === j.id ? j : x)) : [j, ...a]))
    },
    setJobStatus: (id, s) => setJobs((a) => a.map((x) => (x.id === id && (s !== 'Published' || canPublishJob(x)) ? { ...x, status: s } : x))),
    editingId, setEditingId, screeningJob, setScreeningJob,
    shortlist, toggleShortlist: tog(setShortlist),
    decisions, setDecision: (id, d) => setDecisions((m) => ({ ...m, [id]: d })),
    notes, setNote: (id, n) => setNotes((m) => ({ ...m, [id]: n })),
    interviews, addInterview: (i) => setInterviews((a) => [i, ...a]),
    updateInterview: (id, p) => setInterviews((a) => a.map((x) => (x.id === id ? { ...x, ...p } : x))),
    compare,
    toggleCompare: (id) => setCompare((a) => (a.includes(id) ? a.filter((x) => x !== id) : a.length >= 4 ? a : [...a, id])),
    clearCompare: () => setCompare([]),
    apps,
    apply: (jobId, note) => {
      if (session?.role !== 'applicant' || !resume?.parsed ||
        jobs.find((job) => job.id === jobId)?.status !== 'Published' ||
        submittedJobs.current.has(jobId)) return false
      submittedJobs.current.add(jobId)
      setApps((a) => a.some((app) => app.jobId === jobId) ? a : [{ jobId, status: 'Submitted', date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }), note: note?.trim() }, ...a])
      setJobs((a) => a.map((x) => (x.id === jobId ? { ...x, applicants: x.applicants + 1 } : x)))
      return true
    },
    saved, toggleSaved: tog(setSaved),
    resume, setResume,
  }), [route, go, session, toast, toastMsg, jobs, editingId, screeningJob, shortlist, decisions, notes, interviews, compare, apps, saved, resume])

  return <C.Provider value={value}>{children}</C.Provider>
}
