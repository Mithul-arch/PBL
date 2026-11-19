import { useEffect, useMemo, useState } from 'react'
import { ArrowDownUp, ArrowLeft, CalendarPlus, ClipboardCheck, GitCompare, Info, RefreshCw, Search, ShieldCheck, Star, Gavel, FileText, Eye } from 'lucide-react'
import { Avatar, Badge, Bar, Button, Card, EmptyState, Field, Input, Modal, PageHeader, ScoreRing, Select, SimBadge, Skeleton, StatusBadge, Tag, Textarea, REQ_META, cx } from '../../components/ui'
import { CANDIDATES, W_KEYS, calcScore, getStatus, mandatoryOf, type Candidate, type Job, type Status } from '../../lib/data'
import { useApp } from '../../lib/store'

const SCREENED_JOBS = ['j1']
const STATUSES: Status[] = ['Meets Requirements', 'Potential Match', 'Needs Verification', 'Mandatory Requirement Concern', 'Processing', 'Unable to Process']

function useCands(job: Job) {
  return useMemo(() => (SCREENED_JOBS.includes(job.id) ? CANDIDATES.map((c) => ({ c, score: c.processing ? null : calcScore(c.sub, job.weights), status: getStatus(c, job.weights) })) : []), [job])
}
const missingOf = (c: Candidate) => c.reqs.filter((r) => r.state === 'none' || r.state === 'unverified')

export default function Screening({ candId }: { candId?: string }) {
  const { jobs, screeningJob, setScreeningJob } = useApp()
  const job = jobs.find((j) => j.id === screeningJob) ?? jobs[0]
  if (candId) return <Detail candId={candId} job={job} />
  return <List job={job} jobs={jobs.filter((j) => j.mine && j.status !== 'Draft')} setJob={setScreeningJob} />
}

function List({ job, jobs, setJob }: { job: Job; jobs: Job[]; setJob: (id: string) => void }) {
  const { go, shortlist, toggleShortlist, compare, toggleCompare, toast } = useApp()
  const [q, setQ] = useState('')
  const [fs, setFs] = useState('All')
  const [sort, setSort] = useState<{ k: 'score' | 'name' | 'years'; dir: 1 | -1 }>({ k: 'score', dir: -1 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const all = useCands(job)
  useEffect(() => { setLoading(true); const t = setTimeout(() => setLoading(false), 650); return () => clearTimeout(t) }, [job.id])

  const rows = all
    .filter(({ c, status }) => (fs === 'All' || status === fs) && c.name.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => {
      const v = (x: typeof a) => (sort.k === 'score' ? x.score ?? -1 : sort.k === 'years' ? x.c.years : x.c.name.localeCompare('') )
      if (sort.k === 'name') return sort.dir * a.c.name.localeCompare(b.c.name)
      return sort.dir * (v(a) - v(b))
    })
  const th = (k: typeof sort.k, l: string) => <button onClick={() => setSort({ k, dir: sort.k === k ? (-sort.dir as 1 | -1) : -1 })} className="inline-flex items-center gap-1 hover:text-ink">{l}<ArrowDownUp size={12} className={sort.k === k ? 'text-indigo-600' : 'opacity-40'} /></button>
  const counts = (s: Status) => all.filter((x) => x.status === s).length

  return (
    <>
      <PageHeader title="AI screening" sub="Resumes compared to each requirement. Eligibility and weighted score are shown separately." actions={<><SimBadge /><Button variant="secondary" onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); toast('Screening refreshed (simulated)') }, 1200) }}><RefreshCw size={15} />Re-run</Button><Button disabled={compare.length < 2} onClick={() => go('/r/compare')}><GitCompare size={15} />Compare{compare.length > 0 && ` (${compare.length})`}</Button></>} />

      <div className="flex flex-col lg:flex-row gap-3 mb-4">
        <Select className="lg:w-80 font-semibold" value={job.id} onChange={(e) => setJob(e.target.value)} aria-label="Select job">{jobs.map((j) => <option key={j.id} value={j.id}>{j.title} ({j.applicants})</option>)}</Select>
        <div className="relative flex-1"><Search size={16} className="absolute left-3.5 top-3.5 text-mute" /><Input className="pl-10" placeholder="Search candidates" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search candidates" /></div>
        <Select className="lg:w-64" value={fs} onChange={(e) => setFs(e.target.value)} aria-label="Status filter"><option>All</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}</Select>
      </div>

      {all.length > 0 && !loading && (
        <div className="flex flex-wrap gap-2 mb-4 text-xs">
          {STATUSES.map((s) => counts(s) > 0 && <button key={s} onClick={() => setFs(fs === s ? 'All' : s)} className={cx('rounded-full ring-1 ring-inset px-0 transition', fs === s ? 'ring-indigo-500' : 'ring-transparent')}><StatusBadge status={s} /><span className="sr-only">{counts(s)}</span></button>)}
          <span className="text-mute self-center ml-1">Showing {rows.length} of {all.length} sampled candidates ({job.applicants} total applicants)</span>
        </div>
      )}

      <div className="rounded-xl bg-indigo-50/70 ring-1 ring-indigo-100 text-[13px] text-indigo-950 px-4 py-2.5 mb-4 flex gap-2.5"><Info size={16} className="shrink-0 mt-0.5 text-indigo-600" /><span>Scores are decision support. A missing keyword is not proof a candidate lacks a skill, and names, photos, age, gender and other protected traits are excluded. A person makes every final decision.</span></div>

      <Card pad={false}>
        {error ? <EmptyState title="Screening could not load" text="The simulated service timed out. Your data is safe." action={<Button onClick={() => setError(false)}>Retry</Button>} /> :
          loading ? <div className="p-5 space-y-4">{[0, 1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-14" />)}</div> :
            all.length === 0 ? <EmptyState icon={<FileText size={22} />} title="No screened applicants yet" text={`${job.title} has ${job.applicants} applicant${job.applicants === 1 ? '' : 's'}. In this prototype, screening results are only simulated for Senior Frontend Engineer.`} action={<Button onClick={() => setJob('j1')}>View Senior Frontend Engineer</Button>} /> :
              rows.length === 0 ? <EmptyState title="No candidates match" text="Adjust your search or status filter." action={<Button variant="secondary" onClick={() => { setQ(''); setFs('All') }}>Clear filters</Button>} /> : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[1180px]">
                    <thead><tr className="text-left text-xs font-semibold text-mute bg-slate-50/70 [&_th]:py-3 [&_th]:px-3">
                      <th className="!pl-5 w-8"><span className="sr-only">Compare</span></th><th>{th('name', 'Candidate')}</th><th>{th('score', 'Match score')}</th><th>Mandatory</th><th>Technical</th><th>{th('years', 'Experience')}</th><th>Education / certs</th><th>Projects · Preferred</th><th>Missing or unverified</th><th>Status</th><th className="!pr-5 text-right">Actions</th>
                    </tr></thead>
                    <tbody className="divide-y divide-line">
                      {rows.map(({ c, score, status }) => {
                        const m = mandatoryOf(c), met = m.filter((r) => r.state === 'met').length, miss = missingOf(c), ok = !c.processing
                        return (
                          <tr key={c.id} className="hover:bg-slate-50/60 [&_td]:px-3 [&_td]:py-3.5">
                            <td className="!pl-5"><input type="checkbox" aria-label={`Compare ${c.name}`} disabled={!ok} checked={compare.includes(c.id)} onChange={() => toggleCompare(c.id)} className="w-4 h-4 accent-indigo-600" /></td>
                            <td><button onClick={() => go(`/r/screening/${c.id}`)} className="flex items-center gap-3 text-left group"><Avatar name={c.name} /><div><div className="font-semibold text-navy group-hover:text-indigo-600">{c.name}</div><div className="text-xs text-mute max-w-[190px] truncate">{c.headline}</div></div></button></td>
                            <td>{score !== null ? <div className="flex items-center gap-2.5"><ScoreRing score={score} size={42} stroke={5} /></div> : <span className="text-mute">—</span>}</td>
                            <td>{ok ? <Badge tone={m.some((r) => r.state === 'none') ? 'rose' : met === m.length ? 'green' : 'amber'}>{met}/{m.length} met</Badge> : '—'}</td>
                            <td className="w-28">{ok ? <><div className="text-xs font-semibold tabular mb-1">{c.sub.tech}%</div><Bar value={c.sub.tech} h="h-1.5" /></> : '—'}</td>
                            <td>{ok ? <><div className="font-medium tabular">{c.years} yrs</div><div className="text-xs text-mute">fit {c.sub.exp}%</div></> : '—'}</td>
                            <td className="max-w-[170px]">{ok ? <><div className="truncate text-[13px]">{c.edu.split(',')[0]}</div><div className="text-xs text-mute">{c.certs.length} cert{c.certs.length === 1 ? '' : 's'}</div></> : '—'}</td>
                            <td>{ok ? <div className="text-[13px] tabular">{c.sub.proj}% · {c.sub.pref}%</div> : '—'}</td>
                            <td className="max-w-[210px]">{ok ? (miss.length ? <div className="flex flex-wrap gap-1">{miss.slice(0, 2).map((r) => <Tag key={r.name} tone={r.state === 'unverified' ? 'amber' : 'slate'}>{r.name.replace(/ \(.*/, '')}</Tag>)}{miss.length > 2 && <Tag>+{miss.length - 2}</Tag>}</div> : <span className="text-xs text-emerald-700">None</span>) : <span className="text-xs text-mute">{c.processing === 'failed' ? 'Resume unreadable' : 'Parsing…'}</span>}</td>
                            <td><StatusBadge status={status} /></td>
                            <td className="!pr-5"><div className="flex justify-end gap-1">
                              <Button size="sm" variant="secondary" onClick={() => go(`/r/screening/${c.id}`)}><Eye size={14} />Review</Button>
                              {ok && <button onClick={() => { toggleShortlist(c.id); toast(shortlist.includes(c.id) ? 'Removed from shortlist' : `${c.name} shortlisted`) }} aria-label={shortlist.includes(c.id) ? 'Remove from shortlist' : 'Shortlist'} className={cx('p-2 rounded-lg border', shortlist.includes(c.id) ? 'bg-indigo-600 text-white border-indigo-600' : 'border-line text-mute hover:bg-slate-50')}><Star size={14} fill={shortlist.includes(c.id) ? 'currentColor' : 'none'} /></button>}
                              {c.processing === 'failed' && <Button size="sm" variant="secondary" onClick={() => toast('Requested a new resume file from candidate')}>Request file</Button>}
                            </div></td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
      </Card>
      <button onClick={() => setError(true)} className="mt-3 text-xs text-mute hover:underline">Preview error state</button>
    </>
  )
}

function Detail({ candId, job }: { candId: string; job: Job }) {
  const { go, shortlist, toggleShortlist, notes, setNote, decisions, setDecision, addInterview, toast, interviews } = useApp()
  const c = SCREENED_JOBS.includes(job.id) ? CANDIDATES.find((x) => x.id === candId) : undefined
  const [hl, setHl] = useState(0)
  const [modal, setModal] = useState<'assess' | 'interview' | 'decision' | null>(null)
  const [iv, setIv] = useState({ date: '2026-10-16', time: '10:00', type: 'Technical (Video)', who: 'Dana Whitfield, Raj Patel' })
  const [assess, setAssess] = useState('Take-home: React + TypeScript (90 min)')
  const [dec, setDec] = useState('Advance to interview')
  const [why, setWhy] = useState('')
  if (!c) return <EmptyState title="Candidate not found" text="This profile may have been removed." action={<Button onClick={() => go('/r/screening')}>Back to screening</Button>} />
  const score = c.processing ? null : calcScore(c.sub, job.weights)
  const status = getStatus(c, job.weights)
  const mand = mandatoryOf(c)
  const short = shortlist.includes(c.id)
  const gaps = c.reqs.filter((r) => r.state === 'none' || r.state === 'unverified')
  const matched = c.reqs.filter((r) => r.state === 'met' || r.state === 'partial')
  const hasIv = interviews.some((i) => i.candId === c.id && i.status === 'Scheduled')

  const schedule = () => {
    if (!iv.date || !iv.time || !iv.who.split(',').some((name) => name.trim())) {
      toast('Choose a date, time and at least one interviewer')
      return
    }
    const d = new Date(iv.date + 'T12:00')
    if (!Number.isFinite(d.getTime())) { toast('Choose a valid interview date'); return }
    const [h, m] = iv.time.split(':').map(Number)
    addInterview({ id: `i${Date.now()}`, candId: c.id, jobId: job.id, date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), time: `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`, type: iv.type, interviewers: iv.who.split(',').map((s) => s.trim()).filter(Boolean), status: 'Scheduled' })
    toast(`Interview scheduled with ${c.name}`); setModal(null)
  }

  return (
    <>
      <button onClick={() => go('/r/screening')} className="inline-flex items-center gap-1.5 text-sm font-medium text-mute hover:text-ink mb-4"><ArrowLeft size={16} />Back to screening</button>
      <Card className="mb-5">
        <div className="flex flex-col lg:flex-row lg:items-center gap-5">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <Avatar name={c.name} size={56} />
            <div className="min-w-0"><h1 className="text-2xl font-bold text-navy tracking-tight">{c.name}</h1><div className="text-sm text-mute">{c.headline} · {c.location}</div><div className="mt-2 flex flex-wrap gap-2 items-center"><StatusBadge status={status} />{short && <Badge tone="indigo"><Star size={11} fill="currentColor" />Shortlisted</Badge>}{decisions[c.id] && <Badge tone="navy">Decision: {decisions[c.id]}</Badge>}{hasIv && <Badge tone="sky">Interview scheduled</Badge>}</div></div>
          </div>
          {score !== null && <div className="flex items-center gap-3 lg:pr-4"><ScoreRing score={score} size={72} stroke={7} /><div className="text-xs text-mute leading-snug">Weighted match<br />for {job.title}</div></div>}
        </div>
        {!c.processing && (
          <div className="mt-5 pt-5 border-t border-line flex flex-wrap gap-2">
            <Button variant={short ? 'secondary' : 'primary'} onClick={() => { toggleShortlist(c.id); toast(short ? 'Removed from shortlist' : 'Added to shortlist') }}><Star size={15} fill={short ? 'currentColor' : 'none'} />{short ? 'Shortlisted' : 'Shortlist'}</Button>
            <Button variant="secondary" onClick={() => setModal('assess')}><ClipboardCheck size={15} />Request assessment</Button>
            <Button variant="secondary" onClick={() => setModal('interview')}><CalendarPlus size={15} />Schedule interview</Button>
            <Button variant="secondary" onClick={() => setModal('decision')}><Gavel size={15} />Record decision</Button>
          </div>
        )}
      </Card>

      {c.processing ? (
        <Card><EmptyState title={c.processing === 'processing' ? 'Still processing this resume' : 'We could not read this resume'} text={c.processing === 'processing' ? 'Parsing usually takes under a minute. Check back shortly.' : 'The PDF is a scanned image without a text layer. Ask the candidate for a DOCX or text-based PDF, or review the original manually. This is not a reflection on their qualifications.'} action={<Button onClick={() => toast('Requested a readable resume from candidate')}>Request new file</Button>} /></Card>
      ) : (
        <div className="grid xl:grid-cols-[1fr_1.25fr] gap-5">
          <div className="space-y-5">
            <Card>
              <div className="flex items-center justify-between"><h2 className="font-bold text-navy">Resume preview</h2><Tag>Evidence highlighted</Tag></div>
              <div className="mt-4 rounded-xl border border-line bg-slate-50 p-5 text-[13px] leading-relaxed space-y-3.5 max-h-[560px] overflow-y-auto">
                <div className="border-b border-line pb-3"><div className="text-base font-bold text-navy">{c.name}</div><div className="text-mute">{c.headline} · {c.location}</div></div>
                <p>{c.summary}</p>
                <div><div className="text-[11px] font-bold tracking-wider text-mute mb-1">EXPERIENCE & EVIDENCE</div><ul className="space-y-1.5">{c.reqs.filter((r) => r.state !== 'none').map((r) => { const i = c.reqs.indexOf(r); return <li key={r.name}><mark className={cx('rounded px-1 py-0.5 transition cursor-pointer', hl === i ? 'bg-lime-200 ring-2 ring-lime-300' : 'bg-indigo-100/70')} onClick={() => setHl(i)}>{r.evidence}</mark> <span className="text-mute">({r.source})</span></li> })}</ul></div>
                <div><div className="text-[11px] font-bold tracking-wider text-mute mb-1">EDUCATION</div>{c.edu}</div>
                <div><div className="text-[11px] font-bold tracking-wider text-mute mb-1">CERTIFICATIONS</div>{c.certs.join(', ') || 'None listed'}</div>
                <div><div className="text-[11px] font-bold tracking-wider text-mute mb-1">PROJECTS</div><ul className="list-disc pl-4">{c.projects.map((p) => <li key={p}>{p}</li>)}</ul></div>
                <div><div className="text-[11px] font-bold tracking-wider text-mute mb-1">SKILLS</div><div className="flex flex-wrap gap-1">{c.skills.map((s) => <Tag key={s}>{s}</Tag>)}</div></div>
              </div>
            </Card>
            <Card>
              <h2 className="font-bold text-navy">Recruiter notes</h2>
              <Textarea rows={4} className="mt-3" value={notes[c.id] ?? ''} onChange={(e) => setNote(c.id, e.target.value)} placeholder="Observations, questions to probe, verification steps…" />
              <p className="text-xs text-mute mt-2">Keep notes job-related. Avoid references to protected characteristics.</p>
            </Card>
          </div>

          <div className="space-y-5">
            <Card>
              <div className="flex items-center justify-between"><h2 className="font-bold text-navy">How the score is calculated</h2><SimBadge /></div>
              <div className="mt-4 space-y-3">
                {W_KEYS.map(({ k, label }) => (
                  <div key={k}>
                    <div className="flex justify-between text-sm"><span className="font-medium">{label} <span className="text-mute font-normal">· weight {job.weights[k]}%</span></span><span className="tabular text-mute">{c.sub[k]} × {job.weights[k]}% = <b className="text-ink">{((c.sub[k] * job.weights[k]) / 100).toFixed(1)}</b></span></div>
                    <Bar value={c.sub[k]} h="h-1.5" className="mt-1" />
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-line flex justify-between items-center"><span className="font-semibold text-navy">Total match score</span><span className="text-2xl font-bold text-navy tabular">{score}<span className="text-sm text-mute font-medium">/100</span></span></div>
              <div className="mt-3 rounded-xl bg-slate-50 p-3.5 text-xs text-mute leading-relaxed flex gap-2"><ShieldCheck size={15} className="shrink-0 text-indigo-600 mt-0.5" />Mandatory eligibility ({mand.filter((r) => r.state === 'met').length}/{mand.length} met) is assessed separately and is not offset by this score.</div>
            </Card>

            <Card pad={false}>
              <div className="px-5 pt-5 pb-3 flex items-center justify-between"><h2 className="font-bold text-navy">Requirement comparison</h2><span className="text-xs text-mute">Select a row to highlight its evidence</span></div>
              <ul className="divide-y divide-line">
                {c.reqs.map((r, i) => (
                  <li key={r.name}><button onClick={() => setHl(i)} className={cx('w-full text-left px-5 py-3.5 flex gap-3 hover:bg-slate-50', hl === i && 'bg-indigo-50/50')}>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2"><span className="font-semibold text-sm text-navy">{r.name}</span><Badge tone={r.kind === 'mandatory' ? 'rose' : 'indigo'} className="!text-[10px]">{r.kind}</Badge></div>
                      <p className="text-[13px] text-mute mt-1 leading-snug">{r.evidence}</p>
                      <div className="text-[11px] text-slate-400 mt-0.5">Source: {r.source}</div>
                    </div>
                    <Badge tone={REQ_META[r.state].tone} className="self-start">{REQ_META[r.state].label}</Badge>
                  </button></li>
                ))}
              </ul>
            </Card>

            <div className="grid sm:grid-cols-2 gap-5">
              <Card><h3 className="font-bold text-navy text-sm">Matched skills</h3><div className="mt-3 flex flex-wrap gap-1.5">{matched.map((r) => <Tag key={r.name} tone={r.state === 'met' ? 'green' : 'indigo'}>{r.name.replace(/ \(.*/, '')}</Tag>)}</div></Card>
              <Card><h3 className="font-bold text-navy text-sm">Gaps & items to verify</h3>
                {gaps.length === 0 ? <p className="text-sm text-mute mt-3">No open items.</p> : <div className="mt-3 space-y-2">{gaps.map((r) => <div key={r.name} className="text-[13px]"><Tag tone={r.state === 'unverified' ? 'amber' : 'slate'}>{r.name.replace(/ \(.*/, '')}</Tag><div className="text-mute mt-1">{r.state === 'unverified' ? 'Verify in interview or assessment.' : 'Not found in resume. Ask before assuming a gap.'}</div></div>)}</div>}
              </Card>
            </div>
          </div>
        </div>
      )}

      <Modal open={modal === 'assess'} onClose={() => setModal(null)} title="Request an assessment" footer={<><Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button><Button onClick={() => { toast(`Assessment sent to ${c.name}`); setModal(null) }}>Send request</Button></>}>
        <Field label="Assessment" hint={gaps.length ? `Suggested to verify: ${gaps.map((g) => g.name.replace(/ \(.*/, '')).join(', ')}` : undefined}><Select value={assess} onChange={(e) => setAssess(e.target.value)}>{['Take-home: React + TypeScript (90 min)', 'Live pairing: component design (60 min)', 'GraphQL schema exercise (45 min)', 'Portfolio walkthrough'].map((a) => <option key={a}>{a}</option>)}</Select></Field>
      </Modal>
      <Modal open={modal === 'interview'} onClose={() => setModal(null)} title="Schedule interview" footer={<><Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button><Button onClick={schedule}>Schedule</Button></>}>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Date"><Input type="date" value={iv.date} onChange={(e) => setIv({ ...iv, date: e.target.value })} /></Field>
          <Field label="Time"><Input type="time" value={iv.time} onChange={(e) => setIv({ ...iv, time: e.target.value })} /></Field>
          <div className="col-span-2"><Field label="Interview type"><Select value={iv.type} onChange={(e) => setIv({ ...iv, type: e.target.value })}>{['Recruiter screen', 'Technical (Video)', 'Panel (On-site)', 'Culture & collaboration'].map((a) => <option key={a}>{a}</option>)}</Select></Field></div>
          <div className="col-span-2"><Field label="Interviewers" hint="Comma-separated"><Input value={iv.who} onChange={(e) => setIv({ ...iv, who: e.target.value })} /></Field></div>
        </div>
      </Modal>
      <Modal open={modal === 'decision'} onClose={() => setModal(null)} title="Record a decision" footer={<><Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button><Button disabled={why.trim().length < 8} onClick={() => { setDecision(c.id, dec); toast('Decision recorded'); setModal(null) }}>Record decision</Button></>}>
        <div className="space-y-4">
          <Field label="Decision"><Select value={dec} onChange={(e) => setDec(e.target.value)}>{['Advance to interview', 'Hold for verification', 'Move to offer stage', 'Decline'].map((a) => <option key={a}>{a}</option>)}</Select></Field>
          <Field label="Job-related rationale" hint="Required. Reference requirements and evidence, not personal characteristics."><Textarea rows={4} value={why} onChange={(e) => setWhy(e.target.value)} /></Field>
        </div>
      </Modal>
    </>
  )
}

export function Compare() {
  const { compare, toggleCompare, clearCompare, go, jobs, screeningJob } = useApp()
  const job = jobs.find((j) => j.id === screeningJob) ?? jobs[0]
  if (!SCREENED_JOBS.includes(job.id)) return <Card><EmptyState title="No candidates to compare for this role" text="Sample screening results are available for Senior Frontend Engineer." action={<Button onClick={() => go('/r/screening')}>Back to screening</Button>} /></Card>
  const cands = compare.map((id) => CANDIDATES.find((c) => c.id === id)!).filter(Boolean)
  if (cands.length < 2) {
    return (
      <>
        <PageHeader title="Compare candidates" sub="Select two to four candidates to compare side by side." />
        <Card><div className="space-y-2">{CANDIDATES.filter((c) => !c.processing).map((c) => (
          <label key={c.id} className="flex items-center gap-3 p-3 rounded-xl border border-line hover:bg-slate-50 cursor-pointer"><input type="checkbox" className="accent-indigo-600 w-4 h-4" checked={compare.includes(c.id)} onChange={() => toggleCompare(c.id)} /><Avatar name={c.name} size={32} /><span className="font-semibold text-sm text-navy flex-1">{c.name}</span><span className="text-sm text-mute tabular">{calcScore(c.sub, job.weights)}</span></label>
        ))}</div><div className="mt-4 text-sm text-mute">{compare.length}/4 selected. {compare.length < 2 && 'Pick at least two.'}</div></Card>
      </>
    )
  }
  const best = (f: (c: Candidate) => number) => Math.max(...cands.map(f))
  const scoreOf = (c: Candidate) => calcScore(c.sub, job.weights)
  const Row = ({ label, children }: { label: string; children: (c: Candidate) => React.ReactNode }) => <tr className="border-t border-line"><th className="text-left text-[13px] font-semibold text-mute py-3 px-4 bg-slate-50/60 w-44 sticky left-0">{label}</th>{cands.map((c) => <td key={c.id} className="py-3 px-4 align-top">{children(c)}</td>)}</tr>
  return (
    <>
      <PageHeader title="Compare candidates" sub={`${job.title}: ${cands.length} selected`} actions={<><Button variant="secondary" onClick={() => go('/r/screening')}>Change selection</Button><Button variant="ghost" onClick={clearCompare}>Clear</Button></>} />
      <Card pad={false}><div className="overflow-x-auto"><table className="w-full text-sm" style={{ minWidth: 200 + cands.length * 220 }}>
        <thead><tr><th className="sticky left-0 bg-white" />{cands.map((c) => <th key={c.id} className="p-4 text-left align-top"><button onClick={() => go(`/r/screening/${c.id}`)} className="flex items-center gap-3 text-left"><Avatar name={c.name} /><div><div className="font-bold text-navy hover:text-indigo-600">{c.name}</div><div className="text-xs text-mute font-normal">{c.years} yrs</div></div></button></th>)}</tr></thead>
        <tbody>
          <Row label="Match score">{(c) => <div className="flex items-center gap-2"><ScoreRing score={scoreOf(c)} size={44} stroke={5} />{scoreOf(c) === best(scoreOf) && <Badge tone="green">Highest</Badge>}</div>}</Row>
          <Row label="Status">{(c) => <StatusBadge status={getStatus(c, job.weights)} />}</Row>
          <Row label="Mandatory requirements">{(c) => <div className="space-y-1.5">{mandatoryOf(c).map((r) => <div key={r.name} className="flex items-center gap-1.5"><Badge tone={REQ_META[r.state].tone}>{r.name.replace(/ \(.*/, '')}</Badge></div>)}</div>}</Row>
          <Row label="Preferred skills">{(c) => <div className="space-y-1.5">{c.reqs.filter((r) => r.kind === 'preferred').map((r) => <div key={r.name}><Tag tone={REQ_META[r.state].tone}>{r.name.replace(/ \(.*/, '')}</Tag></div>)}</div>}</Row>
          {W_KEYS.map(({ k, label }) => <Row key={k} label={label}>{(c) => <div><div className={cx('tabular font-semibold', c.sub[k] === best((x) => x.sub[k]) && 'text-emerald-700')}>{c.sub[k]}%</div><Bar value={c.sub[k]} h="h-1.5" tone={c.sub[k] === best((x) => x.sub[k]) ? 'green' : 'indigo'} /></div>}</Row>)}
          <Row label="Qualifications">{(c) => <><div>{c.edu}</div><div className="text-mute text-xs mt-1">{c.certs.join(', ') || 'No certifications listed'}</div></>}</Row>
          <Row label="Projects">{(c) => <ul className="list-disc pl-4 text-[13px] space-y-1">{c.projects.map((p) => <li key={p}>{p}</li>)}</ul>}</Row>
          <Row label="Unverified / missing">{(c) => <div className="text-[13px] text-mute">{missingOf(c).map((r) => r.name.replace(/ \(.*/, '')).join(', ') || 'None'}</div>}</Row>
        </tbody>
      </table></div></Card>
      <p className="text-xs text-mute mt-3">The highest score does not imply the best hire. Review mandatory status and evidence before deciding.</p>
    </>
  )
}
