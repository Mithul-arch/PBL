import { useEffect, useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, FileText, Loader2, Plus, RefreshCw, UploadCloud, X } from 'lucide-react'
import { Bar, Button, Card, Field, Input, PageHeader, SimBadge, Tag, Textarea, cx } from '../../components/ui'
import { useApp } from '../../lib/store'
import { PARSED, type Parsed } from './shared'

const MAX = 5 * 1024 * 1024
const kb = (n: number) => (n > 1e6 ? `${(n / 1e6).toFixed(1)} MB` : `${Math.round(n / 1000)} KB`)

export default function Resume() {
  const { resume, setResume, go, toast } = useApp()
  const [stage, setStage] = useState<'idle' | 'uploading' | 'parsing' | 'done'>(resume?.parsed ? 'done' : 'idle')
  const [pct, setPct] = useState(0)
  const [err, setErr] = useState('')
  const [drag, setDrag] = useState(false)
  const [data, setData] = useState<Parsed>(() => structuredClone(resume?.data ?? PARSED))
  const [newSkill, setNewSkill] = useState('')
  const [saved, setSaved] = useState(!!resume?.reviewed)
  const input = useRef<HTMLInputElement>(null)
  const uploadTimer = useRef<ReturnType<typeof setInterval> | undefined>(undefined)
  const parseTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const processing = useRef(false)

  useEffect(() => () => {
    clearInterval(uploadTimer.current)
    clearTimeout(parseTimer.current)
  }, [])

  const handle = (file?: File) => {
    if (processing.current) return
    setErr('')
    if (!file) return
    const ok = /\.(pdf|docx)$/i.test(file.name)
    if (!ok) return setErr(`"${file.name}" isn't supported. Upload a PDF or DOCX file.`)
    if (file.size > MAX) return setErr(`This file is ${kb(file.size)}. The limit is 5 MB.`)
    if (file.size === 0) return setErr('This file is empty.')
    processing.current = true
    setStage('uploading'); setPct(0); setSaved(false)
    let p = 0
    uploadTimer.current = setInterval(() => {
      p += 12 + Math.random() * 14
      if (p >= 100) {
        clearInterval(uploadTimer.current); setPct(100); setStage('parsing')
        parseTimer.current = setTimeout(() => {
          const parsed = structuredClone(PARSED)
          setData(parsed)
          setResume({ name: file.name, size: file.size, parsed: true, reviewed: false, data: parsed })
          processing.current = false
          setStage('done')
          toast('Resume parsed (simulated). Please review the details.')
        }, 1600)
      } else setPct(p)
    }, 180)
  }
  const up = <K extends keyof Parsed>(k: K, v: Parsed[K]) => { setData({ ...data, [k]: v }); setSaved(false) }

  return (
    <>
      <PageHeader title="My resume" sub="Upload once, then correct anything we misread. You control what recruiters see." actions={<SimBadge text="Simulated parsing" />} />
      <input ref={input} type="file" accept=".pdf,.docx" hidden onChange={(e) => { handle(e.target.files?.[0]); e.target.value = '' }} />

      {(stage === 'idle' || stage === 'uploading' || stage === 'parsing') && (
        <Card>
          <div
            onDragOver={(e) => { e.preventDefault(); setDrag(true) }} onDragLeave={() => setDrag(false)} onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files[0]) }}
            className={cx('rounded-2xl border-2 border-dashed p-8 sm:p-14 text-center transition', drag ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-slate-50/50')}>
            {stage === 'idle' ? (
              <>
                <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 grid place-items-center"><UploadCloud size={28} /></div>
                <h2 className="mt-4 text-lg font-bold text-navy">Drag and drop your resume</h2>
                <p className="text-sm text-mute mt-1">PDF or DOCX, up to 5 MB</p>
                <Button className="mt-5" onClick={() => input.current?.click()}>Choose file</Button>
              </>
            ) : (
              <div className="max-w-sm mx-auto">
                <Loader2 className="mx-auto animate-spin text-indigo-600" size={30} />
                <h2 className="mt-4 font-bold text-navy">{stage === 'uploading' ? 'Uploading…' : 'Extracting education, experience and skills…'}</h2>
                <div className="mt-4"><Bar value={stage === 'uploading' ? pct : 100} /></div>
                <div className="text-xs text-mute mt-2">{stage === 'uploading' ? `${Math.round(pct)}%` : 'Parsing resume'}</div>
              </div>
            )}
          </div>
          {err && <div role="alert" className="mt-4 flex gap-2.5 rounded-xl bg-rose-50 ring-1 ring-rose-200 text-rose-700 text-sm p-3.5"><AlertCircle size={18} className="shrink-0" />{err}</div>}
          <p className="text-xs text-mute mt-4">Prototype note: the file is not actually uploaded or parsed. After "processing", sample extracted data is shown so you can try the review flow.</p>
        </Card>
      )}

      {stage === 'done' && resume && (
        <div className="grid lg:grid-cols-[320px_1fr] gap-5">
          <div className="space-y-5 lg:sticky lg:top-24 self-start">
            <Card>
              <div className="flex items-center gap-3"><div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 grid place-items-center"><FileText size={22} /></div><div className="min-w-0"><div className="font-semibold text-sm text-navy truncate">{resume.name}</div><div className="text-xs text-mute">{kb(resume.size)} · Uploaded Oct 10</div></div></div>
              <div className="mt-4 flex gap-2"><Button size="sm" variant="secondary" className="flex-1" onClick={() => input.current?.click()}><RefreshCw size={14} />Replace</Button><Button size="sm" variant="ghost" onClick={() => { setResume(null); setStage('idle') }}>Remove</Button></div>
              {err && <div role="alert" className="mt-3 text-xs text-rose-700 bg-rose-50 rounded-lg p-2.5">{err}</div>}
            </Card>
            <Card className="!p-4">
              <div className="text-xs font-bold tracking-wider text-mute mb-3">PREVIEW</div>
              <div className="rounded-lg border border-line bg-white p-4 text-[10.5px] leading-relaxed shadow-inner space-y-2 max-h-80 overflow-y-auto">
                <div className="text-sm font-bold text-navy">Priya Raman</div>
                <div className="text-mute">Bengaluru, Karnataka · priya.raman@mail.com</div>
                {data.experience.map((e) => <div key={e.company}><b>{e.title}</b>, {e.company} <span className="text-mute">({e.period})</span><div className="text-mute">{e.bullets}</div></div>)}
                <div><b>Education</b>: {data.education.map((e) => `${e.degree}, ${e.school}`).join('; ')}</div>
                <div><b>Skills</b>: {data.skills.join(', ')}</div>
              </div>
            </Card>
          </div>

          <div className="space-y-5">
            <div className="rounded-xl bg-indigo-50 ring-1 ring-indigo-100 px-4 py-3 text-sm text-indigo-950 flex gap-2.5"><AlertCircle size={17} className="shrink-0 text-indigo-600 mt-0.5" />Automatic extraction can make mistakes. Edit any field below. Recruiters see your corrected data.</div>

            <Card className="space-y-4">
              <h2 className="font-bold text-navy">Experience</h2>
              {data.experience.map((e, i) => (
                <div key={i} className="grid sm:grid-cols-3 gap-3 pb-4 border-b border-line last:border-0 last:pb-0">
                  <Field label="Title"><Input value={e.title} onChange={(ev) => up('experience', data.experience.map((x, j) => (j === i ? { ...x, title: ev.target.value } : x)))} /></Field>
                  <Field label="Company"><Input value={e.company} onChange={(ev) => up('experience', data.experience.map((x, j) => (j === i ? { ...x, company: ev.target.value } : x)))} /></Field>
                  <Field label="Period"><Input value={e.period} onChange={(ev) => up('experience', data.experience.map((x, j) => (j === i ? { ...x, period: ev.target.value } : x)))} /></Field>
                  <div className="sm:col-span-3"><Field label="Highlights"><Textarea rows={3} value={e.bullets} onChange={(ev) => up('experience', data.experience.map((x, j) => (j === i ? { ...x, bullets: ev.target.value } : x)))} /></Field></div>
                </div>
              ))}
            </Card>

            <Card className="space-y-4">
              <h2 className="font-bold text-navy">Education</h2>
              {data.education.map((e, i) => (
                <div key={i} className="grid sm:grid-cols-3 gap-3">
                  <Field label="Degree"><Input value={e.degree} onChange={(ev) => up('education', data.education.map((x, j) => (j === i ? { ...x, degree: ev.target.value } : x)))} /></Field>
                  <Field label="School"><Input value={e.school} onChange={(ev) => up('education', data.education.map((x, j) => (j === i ? { ...x, school: ev.target.value } : x)))} /></Field>
                  <Field label="Year"><Input value={e.year} onChange={(ev) => up('education', data.education.map((x, j) => (j === i ? { ...x, year: ev.target.value } : x)))} /></Field>
                </div>
              ))}
            </Card>

            <Card>
              <h2 className="font-bold text-navy">Skills</h2>
              <div className="mt-3 flex flex-wrap gap-2">{data.skills.map((s) => <span key={s} className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-200 pl-2.5 pr-1 py-1 text-xs font-medium">{s}<button aria-label={`Remove ${s}`} onClick={() => up('skills', data.skills.filter((x) => x !== s))} className="p-0.5 rounded hover:bg-indigo-100"><X size={12} /></button></span>)}</div>
              <form className="mt-4 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (newSkill.trim() && !data.skills.includes(newSkill.trim())) up('skills', [...data.skills, newSkill.trim()]); setNewSkill('') }}><Input placeholder="Add a skill missing from the list" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} /><Button type="submit" variant="secondary"><Plus size={16} />Add</Button></form>
            </Card>

            <div className="grid md:grid-cols-2 gap-5">
              <Card><h2 className="font-bold text-navy">Certifications</h2><div className="mt-3 space-y-2">{data.certs.map((c, i) => <Input key={i} value={c} onChange={(e) => up('certs', data.certs.map((x, j) => (j === i ? e.target.value : x)))} />)}<Button size="sm" variant="ghost" onClick={() => up('certs', [...data.certs, ''])}><Plus size={14} />Add certification</Button></div></Card>
              <Card><h2 className="font-bold text-navy">Projects</h2><div className="mt-3 space-y-3">{data.projects.map((p, i) => <div key={i} className="space-y-1.5"><Input value={p.name} onChange={(e) => up('projects', data.projects.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} /><Input value={p.desc} onChange={(e) => up('projects', data.projects.map((x, j) => (j === i ? { ...x, desc: e.target.value } : x)))} /></div>)}</div></Card>
            </div>

            <div className="flex flex-wrap items-center gap-3 sticky bottom-4 bg-white/90 backdrop-blur rounded-2xl border border-line shadow-pop p-4">
              {saved ? <span className="flex items-center gap-2 text-sm font-semibold text-emerald-700"><CheckCircle2 size={18} />Changes saved</span> : <span className="text-sm text-mute flex-1">Review looks right? Save to update your profile.</span>}
              <div className="ml-auto flex gap-2"><Button variant={saved ? 'primary' : 'secondary'} onClick={() => {
                if (saved) { go('/a/jobs'); return }
                setResume({ ...resume, data: structuredClone(data), reviewed: true })
                setSaved(true)
                toast('Profile updated')
              }}>{saved ? 'Browse matching jobs' : 'Confirm & save'}</Button></div>
            </div>
            <Tag>Skills with no evidence in your resume appear in your Skill gaps dashboard</Tag>
          </div>
        </div>
      )}
    </>
  )
}
