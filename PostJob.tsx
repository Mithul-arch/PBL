import { useState } from 'react'
import { Check, Eye, Plus, Save, Trash2, Wand2, CheckCircle2 } from 'lucide-react'
import { Badge, Button, Card, Field, Input, Modal, PageHeader, Select, Tag, Textarea, cx } from '../../components/ui'
import { COMPANY, W_KEYS, type Category, type Job, type Level, type Requirement, type WKey } from '../../lib/data'
import { useApp } from '../../lib/store'
import { balanceWeights, canPublishJob } from '../../lib/jobRules'

const STEPS = ['Job details', 'Requirements', 'Screening weights', 'Review & publish']
const LEVELS: Level[] = ['Beginner', 'Intermediate', 'Advanced', 'Expert']
const CATS: Category[] = ['Technical skill', 'Certification', 'Project', 'Competency']
const VERIFY = ['Resume evidence', 'Resume + project evidence', 'Resume + assessment', 'Resume + code sample', 'Portfolio', 'Case study', 'Employment history']
type Item = Requirement & { kind: 'mandatory' | 'preferred' }

export default function PostJob() {
  const { jobs, editingId, setEditingId, saveJob, setScreeningJob, go, toast } = useApp()
  const existing = jobs.find((j) => j.id === editingId)
  const [step, setStep] = useState(0)
  const [f, setF] = useState({
    title: existing?.title ?? '', dept: existing?.dept ?? 'Engineering', location: existing?.location ?? '', type: existing?.type ?? 'Full-time', exp: existing?.exp ?? '3+ years', edu: existing?.edu ?? "Bachelor's degree", salary: existing?.salary ?? '', description: existing?.description ?? '',
  })
  const [items, setItems] = useState<Item[]>(existing ? [...existing.mandatory.map((r) => ({ ...r, kind: 'mandatory' as const })), ...existing.preferred.map((r) => ({ ...r, kind: 'preferred' as const }))] : [])
  const [w, setW] = useState<Record<WKey, number>>(existing?.weights ?? { tech: 30, exp: 25, edu: 10, proj: 15, pref: 10, comp: 10 })
  const [draftItem, setDraftItem] = useState<Item>({ name: '', category: 'Technical skill', kind: 'mandatory', level: 'Intermediate', importance: 3, verify: VERIFY[0] })
  const [preview, setPreview] = useState(false)
  const [done, setDone] = useState<Job | null>(null)
  const [touched, setTouched] = useState(false)

  const total = Object.values(w).reduce((a, b) => a + b, 0)
  const mand = items.filter((i) => i.kind === 'mandatory')
  const pref = items.filter((i) => i.kind === 'preferred')
  const e1 = !f.title.trim() ? 'Job title is required' : ''
  const canPublish = !e1 && mand.length > 0 && total === 100

  const build = (status: Job['status']): Job => ({
    id: existing?.id ?? `j${Date.now()}`, ...f, company: COMPANY, status, applicants: existing?.applicants ?? 0, screened: existing?.screened ?? 0, posted: status === 'Draft' ? 'Draft' : 'Oct 10, 2026',
    mandatory: mand.map(({ kind: _k, ...r }) => r), preferred: pref.map(({ kind: _k, ...r }) => r), weights: w, mine: true,
  })
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }))
  const addItem = () => {
    if (!draftItem.name.trim()) return
    if (items.some((item) => item.name.toLowerCase() === draftItem.name.trim().toLowerCase())) {
      toast('This requirement is already listed')
      return
    }
    setItems((a) => [...a, { ...draftItem, name: draftItem.name.trim() }])
    setDraftItem({ ...draftItem, name: '' })
  }
  const balance = () => {
    setW(balanceWeights(w))
  }
  const next = () => { if (step === 0 && e1) return setTouched(true); setStep(step + 1) }

  const saveDraft = () => {
    if (e1) { setStep(0); setTouched(true); return }
    saveJob(build('Draft')); toast('Draft saved'); setEditingId(null); go('/r/jobs')
  }
  const publish = () => {
    const j = build('Published')
    if (!canPublishJob(j)) { toast('Add a title, a mandatory requirement and valid weights totaling 100%'); return }
    saveJob(j); setDone(j)
  }

  return (
    <>
      <PageHeader title={existing ? 'Edit job' : 'Post a job'} sub="Define the role, the requirements applicants must satisfy and how screening is weighted." actions={<><Button variant="secondary" onClick={() => setPreview(true)}><Eye size={16} />Preview</Button><Button variant="secondary" onClick={saveDraft}><Save size={16} />Save draft</Button></>} />

      <ol className="flex gap-2 overflow-x-auto mb-6">
        {STEPS.map((s, i) => (
          <li key={s} className="flex-1 min-w-[132px]">
            <button onClick={() => (i <= step || !e1) && setStep(i)} className={cx('w-full text-left rounded-xl border px-3.5 py-2.5 transition', i === step ? 'bg-white border-indigo-500 ring-4 ring-indigo-100' : i < step ? 'bg-white border-line' : 'bg-transparent border-line text-mute')}>
              <div className="flex items-center gap-2"><span className={cx('w-5 h-5 rounded-full grid place-items-center text-[11px] font-bold', i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600')}>{i < step ? <Check size={12} /> : i + 1}</span><span className="text-[13px] font-semibold">{s}</span></div>
            </button>
          </li>
        ))}
      </ol>

      {step === 0 && (
        <Card className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div className="md:col-span-2"><Field label="Job title" error={touched ? e1 : ''}><Input value={f.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Senior Frontend Engineer" /></Field></div>
            <Field label="Department"><Select value={f.dept} onChange={(e) => set('dept', e.target.value)}>{['Engineering', 'AI Research', 'Design', 'Platform', 'Customer', 'People', 'Finance'].map((d) => <option key={d}>{d}</option>)}</Select></Field>
            <Field label="Location"><Input value={f.location} onChange={(e) => set('location', e.target.value)} placeholder="Bengaluru, Karnataka (Hybrid)" /></Field>
            <Field label="Employment type"><Select value={f.type} onChange={(e) => set('type', e.target.value)}>{['Full-time', 'Part-time', 'Contract', 'Internship'].map((d) => <option key={d}>{d}</option>)}</Select></Field>
            <Field label="Salary range" hint="Optional"><Input value={f.salary} onChange={(e) => set('salary', e.target.value)} placeholder="₹24L – ₹36L" /></Field>
            <Field label="Experience required"><Select value={f.exp} onChange={(e) => set('exp', e.target.value)}>{['Entry level', '1+ years', '3+ years', '4+ years', '5+ years', '7+ years', '10+ years'].map((d) => <option key={d}>{d}</option>)}</Select></Field>
            <Field label="Education"><Select value={f.edu} onChange={(e) => set('edu', e.target.value)}>{["Any", "Bachelor's degree", "Bachelor's in CS or equivalent experience", "Master's preferred", 'PhD'].map((d) => <option key={d}>{d}</option>)}</Select></Field>
          </div>
          <Field label="Description" hint="Describe the role and impact. Avoid references to age, gender, nationality or other protected traits."><Textarea rows={6} value={f.description} onChange={(e) => set('description', e.target.value)} placeholder="What will this person own?" /></Field>
        </Card>
      )}

      {step === 1 && (
        <div className="grid xl:grid-cols-[1fr_1.15fr] gap-5">
          <Card className="space-y-4 self-start">
            <h2 className="font-bold text-navy">Add a requirement</h2>
            <Field label="Skill, certification, project or competency"><Input value={draftItem.name} onChange={(e) => setDraftItem({ ...draftItem, name: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && addItem()} placeholder="e.g. TypeScript" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Category"><Select value={draftItem.category} onChange={(e) => setDraftItem({ ...draftItem, category: e.target.value as Category })}>{CATS.map((c) => <option key={c}>{c}</option>)}</Select></Field>
              <Field label="Type"><Select value={draftItem.kind} onChange={(e) => setDraftItem({ ...draftItem, kind: e.target.value as Item['kind'] })}><option value="mandatory">Mandatory</option><option value="preferred">Preferred</option></Select></Field>
              <Field label="Required proficiency"><Select value={draftItem.level} onChange={(e) => setDraftItem({ ...draftItem, level: e.target.value as Level })}>{LEVELS.map((c) => <option key={c}>{c}</option>)}</Select></Field>
              <Field label={`Importance weight: ${draftItem.importance}/5`}><input type="range" min={1} max={5} value={draftItem.importance} onChange={(e) => setDraftItem({ ...draftItem, importance: +e.target.value })} className="w-full h-11 accent-indigo-600" /></Field>
            </div>
            <Field label="Verification method"><Select value={draftItem.verify} onChange={(e) => setDraftItem({ ...draftItem, verify: e.target.value })}>{VERIFY.map((c) => <option key={c}>{c}</option>)}</Select></Field>
            <Button onClick={addItem} disabled={!draftItem.name.trim()} className="w-full"><Plus size={16} />Add requirement</Button>
            <p className="text-xs text-mute leading-relaxed">Mandatory requirements are checked separately and never offset by a high match score. Preferred skills only raise the score.</p>
          </Card>
          <div className="space-y-5">
            {(['mandatory', 'preferred'] as const).map((kind) => {
              const list = items.filter((i) => i.kind === kind)
              return (
                <Card key={kind} pad={false}>
                  <div className="px-5 py-4 flex items-center justify-between border-b border-line"><h3 className="font-bold text-navy capitalize">{kind} requirements</h3><Badge tone={kind === 'mandatory' ? 'rose' : 'indigo'}>{list.length}</Badge></div>
                  {list.length === 0 ? <div className="p-6 text-sm text-mute">{kind === 'mandatory' ? 'Add at least one mandatory requirement to publish.' : 'No preferred skills yet.'}</div> : (
                    <ul className="divide-y divide-line">
                      {list.map((it) => {
                        const idx = items.indexOf(it)
                        return (
                          <li key={idx} className="px-5 py-3.5 flex flex-wrap items-center gap-x-4 gap-y-2">
                            <div className="min-w-[140px] flex-1"><div className="font-semibold text-sm text-navy">{it.name}</div><div className="text-xs text-mute">{it.category} · {it.verify}</div></div>
                            <Tag tone="indigo">{it.level}</Tag>
                            <div className="flex gap-0.5" title={`Importance ${it.importance}/5`}>{[1, 2, 3, 4, 5].map((n) => <span key={n} className={cx('w-1.5 h-4 rounded-sm', n <= it.importance ? 'bg-indigo-600' : 'bg-slate-200')} />)}</div>
                            <button aria-label={`Remove ${it.name}`} onClick={() => setItems(items.filter((_, i) => i !== idx))} className="p-1.5 rounded-lg text-mute hover:text-rose-600 hover:bg-rose-50"><Trash2 size={16} /></button>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {step === 2 && (
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><h2 className="font-bold text-navy text-lg">Screening parameters</h2><p className="text-sm text-mute mt-1 max-w-xl">Weights determine the 0–100 match score. Mandatory requirements are evaluated separately.</p></div>
            <div className="flex items-center gap-3">
              <span className={cx('text-2xl font-bold tabular', total === 100 ? 'text-emerald-600' : 'text-rose-600')}>{total}%</span>
              <Button variant="secondary" size="sm" onClick={balance} disabled={total === 100}><Wand2 size={14} />Auto-balance</Button>
            </div>
          </div>
          {total !== 100 && <div role="alert" className="mt-4 rounded-xl bg-rose-50 ring-1 ring-rose-200 text-rose-700 text-sm px-4 py-2.5">Weights must total exactly 100%. Currently {total}%: {total > 100 ? `remove ${total - 100}` : `add ${100 - total}`}.</div>}
          <div className="mt-6 grid md:grid-cols-2 gap-x-10 gap-y-6">
            {W_KEYS.map(({ k, label, hint }) => (
              <div key={k}>
                <div className="flex items-center justify-between"><label htmlFor={k} className="text-sm font-semibold text-navy">{label}</label><span className="tabular font-bold text-indigo-700 w-12 text-right">{w[k]}%</span></div>
                <input id={k} type="range" min={0} max={60} step={5} value={w[k]} onChange={(e) => setW({ ...w, [k]: +e.target.value })} className="w-full accent-indigo-600 mt-1" />
                <div className="text-xs text-mute">{hint}</div>
              </div>
            ))}
          </div>
          <div className="mt-7 flex h-3 rounded-full overflow-hidden bg-slate-100">{W_KEYS.map(({ k }, i) => <div key={k} style={{ width: `${(w[k] / Math.max(total, 100)) * 100}%` }} className={['bg-navy', 'bg-indigo-700', 'bg-indigo-500', 'bg-indigo-400', 'bg-indigo-300', 'bg-indigo-200'][i]} />)}</div>
        </Card>
      )}

      {step === 3 && (
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5">
          <JobSummary job={build('Draft')} />
          <Card className="self-start space-y-3">
            <h2 className="font-bold text-navy">Publish checklist</h2>
            {[['Job title and details', !e1], ['At least one mandatory requirement', mand.length > 0], ['Weights total 100%', total === 100]].map(([l, ok]) => (
              <div key={l as string} className="flex items-center gap-2.5 text-sm"><span className={cx('w-5 h-5 rounded-full grid place-items-center', ok ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500')}><Check size={12} /></span>{l as string}</div>
            ))}
            <Button className="w-full" size="lg" disabled={!canPublish} onClick={publish}>Publish job</Button>
            <Button className="w-full" variant="secondary" onClick={saveDraft}>Save as draft</Button>
          </Card>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <Button variant="secondary" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</Button>
        {step < 3 && <Button onClick={next}>Continue</Button>}
      </div>

      <Modal open={preview} onClose={() => setPreview(false)} title="Applicant preview" wide><JobSummary job={build('Draft')} applicantView /></Modal>
      <Modal open={!!done} onClose={() => { setEditingId(null); go('/r/jobs') }} title="Job published" footer={<><Button variant="secondary" onClick={() => { setEditingId(null); go('/r/jobs') }}>View all jobs</Button><Button onClick={() => { if (done) setScreeningJob(done.id); setEditingId(null); go('/r/screening') }}>Open screening</Button></>}>
        <div className="text-center py-4"><div className="mx-auto w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 grid place-items-center"><CheckCircle2 size={30} /></div><h4 className="mt-4 font-bold text-navy text-lg">{done?.title} is live</h4><p className="text-sm text-mute mt-1">Applicants can now find and apply. Screening starts automatically as resumes arrive.</p></div>
      </Modal>
    </>
  )
}

export function JobSummary({ job, applicantView }: { job: Job; applicantView?: boolean }) {
  return (
    <Card className="space-y-5">
      <div><h2 className="text-xl font-bold text-navy">{job.title || 'Untitled role'}</h2><div className="text-sm text-mute mt-1">{[job.company, job.dept, job.location, job.type, job.salary].filter(Boolean).join(' · ')}</div></div>
      <p className="text-sm leading-relaxed text-ink">{job.description || 'No description yet.'}</p>
      <div className="grid sm:grid-cols-2 gap-4 text-sm"><div><div className="text-xs font-semibold text-mute">EXPERIENCE</div>{job.exp}</div><div><div className="text-xs font-semibold text-mute">EDUCATION</div>{job.edu}</div></div>
      <div><div className="text-xs font-semibold text-mute mb-2">MUST HAVE</div><div className="flex flex-wrap gap-1.5">{job.mandatory.length ? job.mandatory.map((r) => <Tag key={r.name} tone="rose">{r.name} · {r.level}</Tag>) : <span className="text-sm text-mute">None added</span>}</div></div>
      <div><div className="text-xs font-semibold text-mute mb-2">NICE TO HAVE</div><div className="flex flex-wrap gap-1.5">{job.preferred.length ? job.preferred.map((r) => <Tag key={r.name} tone="indigo">{r.name}</Tag>) : <span className="text-sm text-mute">None added</span>}</div></div>
      {!applicantView && <div><div className="text-xs font-semibold text-mute mb-2">SCREENING WEIGHTS</div><div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm">{W_KEYS.map(({ k, label }) => <div key={k} className="flex justify-between border-b border-line py-1"><span>{label}</span><b className="tabular">{job.weights[k]}%</b></div>)}</div></div>}
    </Card>
  )
}
