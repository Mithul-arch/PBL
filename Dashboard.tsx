import { useEffect, useState } from 'react'
import { ArrowUpRight, Briefcase, CalendarClock, FileCheck2, Sparkles, Star, Users, AlertTriangle, UserCheck, FilePlus2 } from 'lucide-react'
import { AreaChart, Bar, Button, Card, PageHeader, Skeleton, SimBadge } from '../../components/ui'
import { ACTIVITY, APPLICATION_VOLUME, MONTHS } from '../../lib/data'
import { useApp } from '../../lib/store'

export default function Dashboard() {
  const { jobs, go, session, shortlist, interviews } = useApp()
  const [loading, setLoading] = useState(true)
  useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t) }, [])
  const mine = jobs.filter((j) => j.mine)
  const active = mine.filter((j) => j.status === 'Published')
  const total = mine.reduce((s, j) => s + j.applicants, 0)
  const screened = mine.reduce((s, j) => s + j.screened, 0)
  const stats = [
    { l: 'Active jobs', v: active.length, i: Briefcase, d: '+1 this month', to: '/r/jobs' },
    { l: 'Total applicants', v: total, i: Users, d: '+38 this week', to: '/r/applicants' },
    { l: 'Resumes screened', v: screened, i: FileCheck2, d: `${Math.round((screened / total) * 100)}% of applicants`, to: '/r/screening' },
    { l: 'Shortlisted', v: shortlist.length + 36, i: Star, d: `${shortlist.length} in this role`, to: '/r/shortlist' },
    { l: 'Interviews', v: interviews.filter((i) => i.status === 'Scheduled').length + 8, i: CalendarClock, d: 'Next: Oct 14', to: '/r/interviews' },
  ]
  const pipeline = [['Applied', total, 'bg-slate-300'], ['Screened', screened, 'bg-indigo-300'], ['Shortlisted', shortlist.length + 36, 'bg-indigo-500'], ['Interview', 17, 'bg-indigo-700'], ['Offer', 3, 'bg-navy']] as const
  const icon = { ai: Sparkles, int: CalendarClock, short: UserCheck, job: Briefcase, warn: AlertTriangle }

  return (
    <>
      <PageHeader title={`Good morning, ${session?.name.split(' ')[0]}`} sub="Here's what's happening across your open roles today." actions={<><Button variant="secondary" onClick={() => go('/r/screening')}><Sparkles size={16} />Open screening</Button><Button onClick={() => { go('/r/post') }}><FilePlus2 size={16} />Post a job</Button></>} />
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {stats.map((s) => (
          <button key={s.l} onClick={() => go(s.to)} className="text-left bg-white rounded-2xl border border-line shadow-card p-4 sm:p-5 hover:border-indigo-300 transition group">
            <div className="flex items-center justify-between text-mute"><s.i size={18} className="text-indigo-600" /><ArrowUpRight size={15} className="opacity-0 group-hover:opacity-100 transition" /></div>
            {loading ? <Skeleton className="h-9 w-16 mt-3" /> : <div className="text-3xl font-bold text-navy mt-3 tabular">{s.v}</div>}
            <div className="text-[13px] font-medium text-ink mt-0.5">{s.l}</div>
            <div className="text-xs text-mute mt-1">{s.d}</div>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-4 sm:gap-5 mt-5">
        <Card>
          <div className="flex items-center justify-between"><h2 className="font-bold text-navy">Application volume</h2><span className="text-xs text-mute">Last 12 months</span></div>
          <div className="mt-3">{loading ? <Skeleton className="h-44" /> : <AreaChart data={APPLICATION_VOLUME} labels={MONTHS} />}</div>
        </Card>
        <Card>
          <h2 className="font-bold text-navy">Recruitment pipeline</h2>
          <div className="mt-4 space-y-3.5">
            {pipeline.map(([l, v, c]) => (
              <div key={l}>
                <div className="flex justify-between text-sm"><span className="font-medium">{l}</span><span className="tabular text-mute">{v}</span></div>
                <div className="mt-1.5 h-2.5 rounded-full bg-slate-100 overflow-hidden"><div className={`h-full rounded-full ${c} transition-all duration-700`} style={{ width: loading ? 0 : `${Math.max(4, (v / total) * 100)}%` }} /></div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-5 mt-5">
        <Card pad={false}>
          <div className="flex items-center justify-between p-5 pb-3"><h2 className="font-bold text-navy">Roles needing attention</h2><button className="text-sm font-semibold text-indigo-600" onClick={() => go('/r/jobs')}>All jobs</button></div>
          <div className="divide-y divide-line">
            {active.map((j) => (
              <button key={j.id} onClick={() => { go('/r/screening') }} className="w-full text-left px-5 py-3.5 flex items-center gap-4 hover:bg-slate-50">
                <div className="min-w-0 flex-1"><div className="font-semibold text-sm text-navy truncate">{j.title}</div><div className="text-xs text-mute mt-0.5">{j.dept} · {j.location}</div></div>
                <div className="w-28 hidden sm:block"><div className="text-xs text-mute mb-1">{j.screened}/{j.applicants} screened</div><Bar value={j.applicants ? (j.screened / j.applicants) * 100 : 0} tone={j.screened === j.applicants ? 'green' : 'indigo'} h="h-1.5" /></div>
                <span className="text-sm font-bold tabular text-navy">{j.applicants}</span>
              </button>
            ))}
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between"><h2 className="font-bold text-navy">Recent activity</h2><SimBadge text="Sample data" /></div>
          <ul className="mt-4 space-y-4">
            {ACTIVITY.map((a, i) => {
              const I = icon[a.kind as keyof typeof icon]
              return (
                <li key={i} className="flex gap-3">
                  <span className={`w-8 h-8 rounded-lg grid place-items-center shrink-0 ${a.kind === 'warn' ? 'bg-amber-50 text-amber-700' : 'bg-indigo-50 text-indigo-600'}`}><I size={16} /></span>
                  <div><div className="text-sm text-ink leading-snug">{a.text}</div><div className="text-xs text-mute mt-0.5">{a.t}</div></div>
                </li>
              )
            })}
          </ul>
        </Card>
      </div>
    </>
  )
}
