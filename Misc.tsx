import { useState } from 'react'
import { CalendarClock, Star, Video, MessageSquare, Search, Save } from 'lucide-react'
import { AreaChart, Avatar, Badge, Bar, Button, Card, Donut, EmptyState, Field, Input, Modal, PageHeader, ScoreRing, Select, StatusBadge, Tag, Textarea, REQ_META, cx } from '../../components/ui'
import { APPLICATION_VOLUME, CANDIDATES, MONTHS, W_KEYS, calcScore, getStatus, type Candidate } from '../../lib/data'
import { useApp } from '../../lib/store'

export function Applicants() {
  const { go, jobs, setScreeningJob } = useApp()
  const [q, setQ] = useState('')
  const j1 = jobs.find((j) => j.id === 'j1')!
  const rows = CANDIDATES.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()))
  return (
    <>
      <PageHeader title="Applicants" sub="Everyone who applied across your open roles." />
      <Card pad={false}>
        <div className="p-4 border-b border-line relative"><Search size={16} className="absolute left-7 top-7 text-mute" /><Input className="pl-10" placeholder="Search applicants" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search applicants" /></div>
        {rows.length === 0 ? <EmptyState title="No applicants found" text="Try a different name." /> : (
          <div className="divide-y divide-line">
            {rows.map((c) => (
              <button key={c.id} onClick={() => { setScreeningJob('j1'); go(`/r/screening/${c.id}`) }} className="w-full text-left px-5 py-3.5 flex items-center gap-4 hover:bg-slate-50">
                <Avatar name={c.name} /><div className="flex-1 min-w-0"><div className="font-semibold text-navy text-sm">{c.name}</div><div className="text-xs text-mute truncate">{j1.title} · applied {c.applied}</div></div>
                <div className="hidden sm:block"><StatusBadge status={getStatus(c, j1.weights)} /></div>
              </button>
            ))}
          </div>
        )}
      </Card>
    </>
  )
}

export function Shortlist() {
  const { shortlist, toggleShortlist, go, jobs, toast, interviews, setScreeningJob } = useApp()
  const j = jobs.find((x) => x.id === 'j1')!
  const list = CANDIDATES.filter((c) => shortlist.includes(c.id))
  return (
    <>
      <PageHeader title="Shortlist" sub={`${j.title}: candidates you've advanced for review.`} />
      {list.length === 0 ? <Card><EmptyState icon={<Star size={22} />} title="Your shortlist is empty" text="Star candidates in AI Screening to collect them here." action={<Button onClick={() => go('/r/screening')}>Go to screening</Button>} /></Card> : (
        <div className="grid md:grid-cols-2 gap-4">
          {list.map((c) => {
            const iv = interviews.find((i) => i.candId === c.id && i.status === 'Scheduled')
            return (
              <Card key={c.id}>
                <div className="flex items-start gap-4">
                  <Avatar name={c.name} size={48} />
                  <div className="flex-1 min-w-0"><div className="font-bold text-navy">{c.name}</div><div className="text-sm text-mute truncate">{c.headline}</div><div className="mt-2 flex flex-wrap gap-2"><StatusBadge status={getStatus(c, j.weights)} />{iv && <Badge tone="sky"><CalendarClock size={11} />{iv.date}</Badge>}</div></div>
                  <ScoreRing score={calcScore(c.sub, j.weights)} size={52} stroke={5} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button size="sm" variant="secondary" onClick={() => { setScreeningJob('j1'); go(`/r/screening/${c.id}`) }}>Review profile</Button>
                  <Button size="sm" variant="secondary" onClick={() => { go('/r/interviews') }}>Interviews</Button>
                  <Button size="sm" variant="ghost" onClick={() => { toggleShortlist(c.id); toast('Removed from shortlist') }}>Remove</Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </>
  )
}

export function Gaps() {
  const { jobs } = useApp()
  const j = jobs.find((x) => x.id === 'j1')!
  const cands = CANDIDATES.filter((c) => !c.processing)
  const [id, setId] = useState('c4')
  const c = cands.find((x) => x.id === id) as Candidate
  const demonstrated = c.reqs.filter((r) => r.state === 'met')
  const partial = c.reqs.filter((r) => r.state === 'partial')
  const verify = c.reqs.filter((r) => r.state === 'unverified')
  const none = c.reqs.filter((r) => r.state === 'none')
  const all = [...j.mandatory, ...j.preferred]
  const Sec = ({ title, tone, items, hint }: { title: string; tone: string; items: Candidate['reqs']; hint: string }) => (
    <Card>
      <div className="flex items-center justify-between"><h3 className="font-bold text-navy">{title}</h3><Badge tone={tone}>{items.length}</Badge></div>
      <p className="text-xs text-mute mt-1">{hint}</p>
      {items.length === 0 ? <p className="text-sm text-mute mt-4">Nothing here.</p> : <ul className="mt-4 space-y-3">{items.map((r) => { const req = all.find((a) => a.name === r.name); return <li key={r.name} className="text-sm"><div className="flex flex-wrap items-center gap-2"><b className="text-navy">{r.name}</b>{req && <Tag>Expected: {req.level}</Tag>}</div><p className="text-mute text-[13px] mt-0.5">{r.evidence}</p></li> })}</ul>}
    </Card>
  )
  return (
    <>
      <PageHeader title="Skill gap reports" sub="Missing resume evidence is not the same as a confirmed deficiency." actions={<Select className="w-64" value={id} onChange={(e) => setId(e.target.value)} aria-label="Candidate">{cands.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</Select>} />
      <Card className="mb-5 flex flex-wrap items-center gap-4"><Avatar name={c.name} size={48} /><div className="flex-1"><div className="font-bold text-navy">{c.name}</div><div className="text-sm text-mute">vs {j.title}</div></div><StatusBadge status={getStatus(c, j.weights)} /></Card>
      <div className="grid lg:grid-cols-2 gap-5">
        <Sec title="Demonstrated skills" tone="green" items={[...demonstrated, ...partial]} hint="Backed by evidence in the resume (including partial evidence)." />
        <Sec title="Requires verification" tone="amber" items={verify} hint="Mentioned or implied but not conclusively evidenced. Verify through assessment or interview." />
        <Sec title="No resume evidence (potential gaps)" tone="slate" items={none} hint="Not found. This may be a resume omission rather than a confirmed gap." />
        <Card>
          <h3 className="font-bold text-navy">Suggested next steps</h3>
          <ul className="mt-4 space-y-3 text-sm">
            {[...verify, ...none].length === 0 && <li className="text-mute">No follow-up needed. Candidate shows evidence across all requirements.</li>}
            {verify.map((r) => <li key={r.name} className="flex gap-2.5"><MessageSquare size={16} className="text-amber-600 shrink-0 mt-0.5" />Ask {c.name.split(' ')[0]} to describe a concrete {r.name.replace(/ \(.*/, '')} example in the interview.</li>)}
            {none.map((r) => <li key={r.name} className="flex gap-2.5"><Video size={16} className="text-indigo-600 shrink-0 mt-0.5" />Request a short assessment or portfolio link covering {r.name.replace(/ \(.*/, '')} before drawing conclusions.</li>)}
          </ul>
          <div className="mt-5 pt-4 border-t border-line text-xs text-mute">Learning suggestions are shown to applicants in their own skill gap dashboard.</div>
        </Card>
      </div>
    </>
  )
}

export function Interviews() {
  const { interviews, updateInterview, go, toast, setScreeningJob } = useApp()
  const [fb, setFb] = useState<string | null>(null)
  const [rating, setRating] = useState(4)
  const [note, setNote] = useState('')
  const target = interviews.find((i) => i.id === fb)
  return (
    <>
      <PageHeader title="Interviews" sub="Scheduled sessions and interviewer feedback." actions={<Button onClick={() => go('/r/shortlist')}>Schedule from shortlist</Button>} />
      {interviews.length === 0 ? <Card><EmptyState title="No interviews yet" text="Schedule from a candidate profile." /></Card> : (
        <div className="space-y-3">
          {interviews.map((i) => {
            const c = CANDIDATES.find((x) => x.id === i.candId)!
            return (
              <Card key={i.id} className="!p-4 sm:!p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-16 shrink-0 text-center rounded-xl bg-indigo-50 text-indigo-700 py-2"><div className="text-xs font-semibold">{i.date.split(' ')[0].toUpperCase()}</div><div className="text-2xl font-bold">{i.date.split(' ')[1].replace(',', '')}</div></div>
                <div className="flex-1 min-w-0">
                  <button onClick={() => { setScreeningJob(i.jobId); go(`/r/screening/${c.id}`) }} className="font-bold text-navy hover:text-indigo-600">{c.name}</button>
                  <div className="text-sm text-mute">{i.type} · {i.time} · with {i.interviewers.join(', ')}</div>
                  {i.feedback && <div className="mt-2 text-[13px] bg-slate-50 rounded-xl p-3"><div className="font-semibold text-navy">Feedback: {'★'.repeat(i.feedback.rating)}{'☆'.repeat(5 - i.feedback.rating)}</div>{i.feedback.note}</div>}
                </div>
                <div className="flex gap-2 items-center"><Badge tone={i.status === 'Scheduled' ? 'sky' : 'green'}>{i.status}</Badge>{i.status === 'Scheduled' && <Button size="sm" variant="secondary" onClick={() => { setFb(i.id); setRating(4); setNote('') }}>Add feedback</Button>}</div>
              </Card>
            )
          })}
        </div>
      )}
      <Modal open={!!target} onClose={() => setFb(null)} title="Interviewer feedback" footer={<><Button variant="secondary" onClick={() => setFb(null)}>Cancel</Button><Button disabled={note.trim().length < 8} onClick={() => { updateInterview(fb!, { status: 'Completed', feedback: { rating, note } }); toast('Feedback submitted'); setFb(null) }}>Submit</Button></>}>
        <div className="space-y-4">
          <Field label="Overall rating"><div className="flex gap-1">{[1, 2, 3, 4, 5].map((n) => <button key={n} onClick={() => setRating(n)} aria-label={`${n} stars`} className={cx('text-3xl', n <= rating ? 'text-amber-400' : 'text-slate-300')}>★</button>)}</div></Field>
          <Field label="Evidence-based notes" hint="Describe what the candidate demonstrated against job requirements."><Textarea rows={4} value={note} onChange={(e) => setNote(e.target.value)} /></Field>
        </div>
      </Modal>
    </>
  )
}

export function Analytics() {
  const { jobs } = useApp()
  const w = jobs.find((j) => j.id === 'j1')!.weights
  const statuses = CANDIDATES.map((c) => getStatus(c, w))
  const cnt = (s: string) => statuses.filter((x) => x === s).length
  return (
    <>
      <PageHeader title="Analytics" sub="Funnel health, eligibility outcomes and skill gaps. Sample data." />
      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-5">
        <Card><h2 className="font-bold text-navy">Application volume</h2><div className="mt-3"><AreaChart data={APPLICATION_VOLUME} labels={MONTHS} /></div></Card>
        <Card>
          <h2 className="font-bold text-navy">Eligibility outcomes</h2>
          <div className="flex items-center gap-5 mt-4 flex-wrap justify-center"><Donut parts={[{ label: 'Meets / Potential', value: 78, color: '#fd550a' }, { label: 'Needs verification', value: 34, color: '#c4d62e' }, { label: 'Mandatory concern', value: 22, color: '#7a2a08' }, { label: 'Unable to process', value: 8, color: '#94a3b8' }]} />
            <ul className="text-sm space-y-2">{[['Meets / Potential', '#fd550a'], ['Needs verification', '#c4d62e'], ['Mandatory concern', '#7a2a08'], ['Unable to process', '#94a3b8']].map(([l, c]) => <li key={l} className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: c }} />{l}</li>)}</ul></div>
        </Card>
        <Card>
          <h2 className="font-bold text-navy">Screening progress by role</h2>
          <div className="mt-4 space-y-4">{jobs.filter((j) => j.mine && j.applicants > 0).map((j) => <div key={j.id}><div className="flex justify-between text-sm"><span className="font-medium">{j.title}</span><span className="text-mute tabular">{j.screened}/{j.applicants}</span></div><Bar value={(j.screened / j.applicants) * 100} tone={j.screened === j.applicants ? 'green' : 'indigo'} /></div>)}</div>
        </Card>
        <Card>
          <h2 className="font-bold text-navy">Most common evidence gaps</h2>
          <p className="text-xs text-mute">Share of screened candidates with no resume evidence. Not confirmed deficiencies.</p>
          <div className="mt-4 space-y-3.5">{[['GraphQL', 41], ['Design systems', 33], ['Testing (Jest / RTL)', 19], ['TypeScript', 9]].map(([l, v]) => <div key={l as string}><div className="flex justify-between text-sm"><span>{l}</span><span className="tabular text-mute">{v}%</span></div><Bar value={v as number} tone="amber" h="h-1.5" /></div>)}</div>
          <div className="mt-5 text-xs text-mute">Candidates this view: {cnt('Meets Requirements')} meet, {cnt('Needs Verification')} to verify, {cnt('Mandatory Requirement Concern')} concern.</div>
        </Card>
      </div>
    </>
  )
}

export function Profile() {
  const { toast } = useApp()
  return (
    <>
      <PageHeader title="Company profile" sub="Shown to applicants on your job listings." actions={<Button onClick={() => toast('Profile saved')}><Save size={15} />Save</Button>} />
      <Card className="grid md:grid-cols-2 gap-5">
        <Field label="Company name"><Input defaultValue="Aarya Analytics" /></Field>
        <Field label="Industry"><Input defaultValue="Analytics software" /></Field>
        <Field label="Website"><Input defaultValue="northwindlabs.com" /></Field>
        <Field label="Headquarters"><Input defaultValue="Bengaluru, Karnataka" /></Field>
        <div className="md:col-span-2"><Field label="About"><Textarea rows={4} defaultValue="Aarya Analytics builds AI-powered analytics tools that help Indian businesses make faster, better decisions. Our 220-person team works across Bengaluru, Mumbai, Hyderabad, Pune, and Delhi NCR." /></Field></div>
      </Card>
    </>
  )
}

export function SettingsPage() {
  const { toast } = useApp()
  const [t, setT] = useState({ email: true, ai: true, blind: false, human: true })
  const rows: [keyof typeof t, string, string][] = [['email', 'Email notifications', 'New applicants and interview confirmations'], ['ai', 'Notify when screening completes', 'Alert when AI scoring finishes for a role'], ['blind', 'Blind review mode', 'Hide names and photos while reviewing evidence (recommended)'], ['human', 'Require human review before rejection', 'AI outcomes never auto-reject candidates']]
  return (
    <>
      <PageHeader title="Settings" actions={<Button onClick={() => toast('Settings saved')}>Save changes</Button>} />
      <Card className="divide-y divide-line !py-2">
        {rows.map(([k, l, d]) => (
          <div key={k} className="flex items-center justify-between gap-4 py-4"><div><div className="font-semibold text-sm text-navy">{l}</div><div className="text-sm text-mute">{d}</div></div>
            <button role="switch" aria-checked={t[k]} aria-label={l} onClick={() => setT({ ...t, [k]: !t[k] })} className={cx('w-11 h-6 rounded-full p-0.5 transition shrink-0', t[k] ? 'bg-indigo-600' : 'bg-slate-300')}><span className={cx('block w-5 h-5 rounded-full bg-white transition', t[k] && 'translate-x-5')} /></button></div>
        ))}
      </Card>
    </>
  )
}

export { W_KEYS }
