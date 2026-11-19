import { useState } from 'react'
import { Pencil, Search, Sparkles, XCircle, FilePlus2, Briefcase } from 'lucide-react'
import { Badge, Button, Card, EmptyState, Input, Modal, PageHeader, Select } from '../../components/ui'
import { JobSummary } from './PostJob'
import { useApp } from '../../lib/store'
import type { Job } from '../../lib/data'

export default function Jobs() {
  const { jobs, go, setEditingId, setJobStatus, setScreeningJob, toast } = useApp()
  const [q, setQ] = useState('')
  const [st, setSt] = useState('All')
  const [dept, setDept] = useState('All')
  const [closing, setClosing] = useState<Job | null>(null)
  const [view, setView] = useState<Job | null>(null)
  const mine = jobs.filter((j) => j.mine)
  const rows = mine.filter((j) => (st === 'All' || j.status === st) && (dept === 'All' || j.dept === dept) && j.title.toLowerCase().includes(q.toLowerCase()))
  const tone = { Published: 'green', Draft: 'slate', Closed: 'rose' } as const

  return (
    <>
      <PageHeader title="Manage jobs" sub="Publish, edit and close roles. Applicant counts update as people apply." actions={<Button onClick={() => { setEditingId(null); go('/r/post') }}><FilePlus2 size={16} />Post a job</Button>} />
      <Card pad={false}>
        <div className="p-4 flex flex-col sm:flex-row gap-3 border-b border-line">
          <div className="relative flex-1"><Search size={16} className="absolute left-3.5 top-3.5 text-mute" /><Input className="pl-10" placeholder="Search jobs" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search jobs" /></div>
          <Select className="sm:w-40" value={st} onChange={(e) => setSt(e.target.value)} aria-label="Status filter">{['All', 'Published', 'Draft', 'Closed'].map((s) => <option key={s}>{s === 'All' ? 'All' : s}</option>)}</Select>
          <Select className="sm:w-44" value={dept} onChange={(e) => setDept(e.target.value)} aria-label="Department filter">{['All', ...new Set(mine.map((j) => j.dept))].map((s) => <option key={s}>{s}</option>)}</Select>
        </div>
        {rows.length === 0 ? <EmptyState icon={<Briefcase size={22} />} title="No jobs match" text="Try clearing filters or post a new role." action={<Button variant="secondary" onClick={() => { setQ(''); setSt('All'); setDept('All') }}>Clear filters</Button>} /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[780px]">
              <thead><tr className="text-left text-xs font-semibold text-mute bg-slate-50/70"><th className="px-5 py-3">Role</th><th className="px-3">Department</th><th className="px-3">Posted</th><th className="px-3 text-right">Applicants</th><th className="px-3">Status</th><th className="px-5 text-right">Actions</th></tr></thead>
              <tbody className="divide-y divide-line">
                {rows.map((j) => (
                  <tr key={j.id} className="hover:bg-slate-50/60">
                    <td className="px-5 py-3.5"><button onClick={() => setView(j)} className="font-semibold text-navy hover:text-indigo-600 text-left">{j.title}</button><div className="text-xs text-mute">{j.location} · {j.type}</div></td>
                    <td className="px-3 text-mute">{j.dept}</td>
                    <td className="px-3 text-mute">{j.posted}</td>
                    <td className="px-3 text-right tabular font-semibold">{j.applicants}</td>
                    <td className="px-3"><Badge tone={tone[j.status]}>{j.status}</Badge></td>
                    <td className="px-5"><div className="flex justify-end gap-1">
                      {j.status !== 'Draft' && <Button size="sm" variant="ghost" onClick={() => { setScreeningJob(j.id); go('/r/screening') }}><Sparkles size={14} />Screen</Button>}
                      <Button size="sm" variant="ghost" onClick={() => { setEditingId(j.id); go('/r/post') }}><Pencil size={14} />Edit</Button>
                      {j.status === 'Published' && <Button size="sm" variant="ghost" className="!text-rose-600" onClick={() => setClosing(j)}><XCircle size={14} />Close</Button>}
                      {j.status === 'Draft' && <Button size="sm" variant="ghost" onClick={() => { setEditingId(j.id); go('/r/post') }}>Review & publish</Button>}
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      <Modal open={!!closing} onClose={() => setClosing(null)} title="Close this job?" footer={<><Button variant="secondary" onClick={() => setClosing(null)}>Cancel</Button><Button variant="navy" onClick={() => { setJobStatus(closing!.id, 'Closed'); toast(`${closing!.title} closed`); setClosing(null) }}>Close job</Button></>}>
        <p className="text-sm text-mute">New applications to <b className="text-ink">{closing?.title}</b> will stop. Existing candidates stay in screening and the shortlist.</p>
      </Modal>
      <Modal open={!!view} onClose={() => setView(null)} title="Job details" wide>{view && <JobSummary job={view} />}</Modal>
    </>
  )
}
