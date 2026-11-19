import { useState, type ReactNode } from 'react'
import { BarChart3, Bell, Building2, CalendarClock, ClipboardList, FilePlus2, LayoutDashboard, LogOut, Menu, Settings, Sparkles, Star, Target, Users, X, Briefcase } from 'lucide-react'
import { Avatar, Logo, cx } from '../../components/ui'
import { useApp } from '../../lib/store'

const NAV = [
  { p: '/r/dashboard', l: 'Dashboard', i: LayoutDashboard },
  { p: '/r/post', l: 'Post a Job', i: FilePlus2 },
  { p: '/r/jobs', l: 'Manage Jobs', i: Briefcase },
  { p: '/r/applicants', l: 'Applicants', i: Users },
  { p: '/r/screening', l: 'AI Screening', i: Sparkles },
  { p: '/r/shortlist', l: 'Shortlist', i: Star },
  { p: '/r/gaps', l: 'Skill Gap Reports', i: Target },
  { p: '/r/interviews', l: 'Interviews', i: CalendarClock },
  { p: '/r/analytics', l: 'Analytics', i: BarChart3 },
  { p: '/r/profile', l: 'Company Profile', i: Building2 },
  { p: '/r/settings', l: 'Settings', i: Settings },
]

export default function RecruiterShell({ children }: { children: ReactNode }) {
  const { route, go, session, logout, interviews, setEditingId } = useApp()
  const [open, setOpen] = useState(false)
  const [bell, setBell] = useState(false)
  const active = (p: string) => route === p || (p !== '/r/dashboard' && route.startsWith(p + '/'))
  const upcoming = interviews.filter((i) => i.status === 'Scheduled').length

  const side = (
    <div className="flex flex-col h-full bg-navy text-indigo-100/80">
      <div className="h-[68px] px-5 flex items-center justify-between"><button onClick={() => go('/')}><Logo light /></button><button className="lg:hidden p-1" onClick={() => setOpen(false)} aria-label="Close menu"><X size={20} /></button></div>
      <div className="px-3 pb-2 text-[11px] font-bold tracking-wider text-indigo-300/60 px-5 mt-2">RECRUITING</div>
      <nav className="flex-1 overflow-y-auto px-3 space-y-0.5">
        {NAV.map((n) => (
          <button key={n.p} onClick={() => { if (n.p === '/r/post') setEditingId(null); go(n.p); setOpen(false) }} className={cx('w-full flex items-center gap-3 px-3 h-10 rounded-xl text-sm font-medium transition', active(n.p) ? 'bg-indigo-600 text-white shadow' : 'hover:bg-white/8 hover:text-white')}>
            <n.i size={18} />{n.l}
            {n.l === 'Interviews' && upcoming > 0 && <span className="ml-auto text-[11px] bg-white/15 rounded-full px-2 py-0.5">{upcoming}</span>}
          </button>
        ))}
      </nav>
      <div className="p-3 m-3 rounded-xl bg-white/6 flex items-center gap-3">
        <Avatar name={session?.name ?? 'D W'} size={36} />
        <div className="min-w-0 flex-1"><div className="text-sm font-semibold text-white truncate">{session?.name}</div><div className="text-xs truncate">Aarya Analytics</div></div>
        <button onClick={logout} aria-label="Sign out" className="p-1.5 rounded-lg hover:bg-white/10"><LogOut size={17} /></button>
      </div>
    </div>
  )

  return (
    <div className="thermal-page min-h-screen lg:grid lg:grid-cols-[256px_1fr]">
      <aside className="hidden lg:block sticky top-0 h-screen">{side}</aside>
      {open && <div className="lg:hidden fixed inset-0 z-40 flex"><div className="w-[272px] max-w-[85%]">{side}</div><div className="flex-1 bg-navy/50" onClick={() => setOpen(false)} /></div>}
      <div className="min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 h-[68px] bg-white/55 backdrop-blur-xl backdrop-saturate-150 border-b border-white/60 shadow-[0_4px_24px_rgba(10,31,68,0.06)] px-4 sm:px-8 flex items-center gap-3">
          <button className="lg:hidden p-2 -ml-2" aria-label="Open menu" onClick={() => setOpen(true)}><Menu size={22} /></button>
          <div className="flex-1 text-sm text-mute hidden sm:block">Aarya Analytics · <span className="font-semibold text-ink">Recruiter workspace</span></div>
          <div className="flex-1 sm:hidden"><Logo size={24} /></div>
          <div className="relative">
            <button onClick={() => setBell(!bell)} aria-label="Notifications" className="relative p-2.5 rounded-xl bg-white border border-line hover:bg-slate-50"><Bell size={18} /><span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" /></button>
            {bell && (
              <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-2xl border border-line shadow-pop p-2 fade-up">
                <div className="px-3 py-2 text-sm font-bold text-navy">Notifications</div>
                {['AI screening finished: 142 resumes scored', 'Priya Raman confirmed Oct 14 interview', '2 resumes need manual review'].map((t) => (
                  <button key={t} onClick={() => { setBell(false); go(t.includes('Priya') ? '/r/interviews' : '/r/screening') }} className="w-full text-left px-3 py-2.5 text-sm rounded-xl hover:bg-slate-50 flex gap-2.5"><ClipboardList size={16} className="text-indigo-600 mt-0.5 shrink-0" />{t}</button>
                ))}
              </div>
            )}
          </div>
        </header>
        <main className="flex-1 px-4 sm:px-8 py-6 sm:py-8 max-w-[1280px] w-full mx-auto" key={route.split('/').slice(0, 3).join('/')}>{children}</main>
      </div>
    </div>
  )
}
