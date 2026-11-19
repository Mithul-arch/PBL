import { Provider, useApp } from './lib/store'
import { Toast } from './components/ui'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import RecruiterShell from './pages/recruiter/Shell'
import Dashboard from './pages/recruiter/Dashboard'
import PostJob from './pages/recruiter/PostJob'
import Jobs from './pages/recruiter/Jobs'
import Screening, { Compare } from './pages/recruiter/Screening'
import { Analytics, Applicants, Gaps, Interviews, Profile, SettingsPage, Shortlist } from './pages/recruiter/Misc'
import ApplicantShell from './pages/applicant/Shell'
import ADashboard, { Applications, Skills } from './pages/applicant/Dashboard'
import Resume from './pages/applicant/Resume'
import AJobs from './pages/applicant/Jobs'

function Redirect({ to }: { to: string }) {
  const { go } = useApp()
  useEffect(() => { go(to) }, [go, to])
  return null
}

function Router() {
  const { route, session, editingId } = useApp()
  const parts = route.split('/').filter(Boolean)

  if (parts.length === 0) return <div key="landing" className="page-fade"><Landing /></div>
  if (['login', 'register', 'reset'].includes(parts[0]) && (parts[1] === 'recruiter' || parts[1] === 'applicant')) return <div key={route} className="page-fade"><Auth role={parts[1]} mode={parts[0] as 'login'} /></div>

  if (parts[0] === 'r' || parts[0] === 'a') {
    const role = parts[0] === 'r' ? 'recruiter' : 'applicant'
    if (session?.role !== role) return <Redirect to={`/login/${role}`} />
    const [, page, id] = parts
    if (role === 'recruiter') {
      const body = (() => {
        switch (page) {
          case 'dashboard': return <Dashboard />
          case 'post': return <PostJob key={editingId ?? 'new'} />
          case 'jobs': return <Jobs />
          case 'applicants': return <Applicants />
          case 'screening': return <Screening candId={id} key={id ?? 'list'} />
          case 'compare': return <Compare />
          case 'shortlist': return <Shortlist />
          case 'gaps': return <Gaps />
          case 'interviews': return <Interviews />
          case 'analytics': return <Analytics />
          case 'profile': return <Profile />
          case 'settings': return <SettingsPage />
          default: return <Dashboard />
        }
      })()
      return <RecruiterShell><div key={route} className="page-enter">{body}</div></RecruiterShell>
    }
    const body = (() => {
      switch (page) {
        case 'resume': return <Resume />
        case 'jobs': return <AJobs jobId={id} key={id ?? 'list'} />
        case 'applications': return <Applications />
        case 'skills': return <Skills />
        default: return <ADashboard />
      }
    })()
    return <ApplicantShell><div key={route} className="page-enter">{body}</div></ApplicantShell>
  }
  return <Redirect to="/" />
}

function Toasts() {
  const { toastMsg } = useApp()
  return <Toast msg={toastMsg} />
}

export default function App() {
  return (
    <Provider>
      <Router />
      <Toasts />
    </Provider>
  )
}
import { useEffect } from 'react'
