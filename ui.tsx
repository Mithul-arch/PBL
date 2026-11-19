import { useEffect, useState, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { AlertTriangle, CheckCircle2, Loader2, X, Sparkles, Inbox, CircleHelp, CircleDashed } from 'lucide-react'
import type { ReqState, Status } from '../lib/data'

function useMounted() {
  const [m, setM] = useState(false)
  useEffect(() => { const t = requestAnimationFrame(() => setM(true)); return () => cancelAnimationFrame(t) }, [])
  return m
}

export const cx = (...a: (string | false | undefined | null)[]) => a.filter(Boolean).join(' ')

export function Logo({ light, size = 28 }: { light?: boolean; size?: number }) {
  return (
    <span className="inline-flex items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
        <rect width="32" height="32" rx="9" fill="#fd550a" />
        <path d="M9 10h14M16 10v13" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        <circle cx="23" cy="22" r="3" fill="#ffb996" />
      </svg>
      <span className={cx('text-[17px] font-bold tracking-tight', light ? 'text-white' : 'text-navy')}>
        Talent<span className="text-indigo-500">IQ</span>
      </span>
    </span>
  )
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'navy' | 'light'; size?: 'sm' | 'md' | 'lg' }
export function Button({ variant = 'primary', size = 'md', className, ...p }: BtnProps) {
  const v = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm',
    navy: 'bg-navy text-white hover:bg-navy-3',
    secondary: 'bg-white text-ink border border-line hover:bg-slate-50 hover:border-slate-300',
    ghost: 'text-mute hover:bg-slate-100 hover:text-ink',
    danger: 'bg-white text-rose-700 border border-rose-200 hover:bg-rose-50',
    light: 'bg-white text-navy hover:bg-indigo-50',
  }[variant]
  const s = { sm: 'h-8 px-3 text-[13px]', md: 'h-10 px-4 text-sm', lg: 'h-12 px-6 text-[15px]' }[size]
  return <button type="button" {...p} className={cx('inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition disabled:opacity-45 disabled:pointer-events-none whitespace-nowrap', v, s, className)} />
}

export const Card = ({ children, className, pad = true }: { children: ReactNode; className?: string; pad?: boolean }) => (
  <div className={cx('min-w-0 bg-white rounded-2xl border border-line shadow-card', pad && 'p-5 sm:p-6', className)}>{children}</div>
)

const TONES: Record<string, string> = {
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  amber: 'bg-amber-50 text-amber-800 ring-amber-200',
  rose: 'bg-rose-50 text-rose-700 ring-rose-200',
  slate: 'bg-slate-100 text-slate-700 ring-slate-200',
  navy: 'bg-navy text-white ring-navy',
  sky: 'bg-lime-100 text-emerald-900 ring-lime-300',
}
export const Badge = ({ tone = 'slate', children, className }: { tone?: string; children: ReactNode; className?: string }) => (
  <span className={cx('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset whitespace-nowrap', TONES[tone], className)}>{children}</span>
)

const STATUS_META: Record<Status, { tone: string; icon: ReactNode }> = {
  'Meets Requirements': { tone: 'green', icon: <CheckCircle2 size={12} /> },
  'Potential Match': { tone: 'indigo', icon: <Sparkles size={12} /> },
  'Needs Verification': { tone: 'amber', icon: <CircleHelp size={12} /> },
  'Mandatory Requirement Concern': { tone: 'rose', icon: <AlertTriangle size={12} /> },
  Processing: { tone: 'sky', icon: <Loader2 size={12} className="animate-spin" /> },
  'Unable to Process': { tone: 'slate', icon: <CircleDashed size={12} /> },
}
export const StatusBadge = ({ status }: { status: Status }) => <Badge tone={STATUS_META[status].tone}>{STATUS_META[status].icon}{status}</Badge>

export const Tag = ({ children, tone = 'slate' }: { children: ReactNode; tone?: string }) => (
  <span className={cx('inline-flex items-center rounded-lg px-2 py-1 text-xs font-medium ring-1 ring-inset', TONES[tone])}>{children}</span>
)

export const REQ_META: Record<ReqState | 'gap', { label: string; tone: string }> = {
  met: { label: 'Evidence found', tone: 'green' },
  partial: { label: 'Partial evidence', tone: 'indigo' },
  unverified: { label: 'Needs verification', tone: 'amber' },
  none: { label: 'No resume evidence', tone: 'slate' },
  gap: { label: 'Confirmed gap', tone: 'rose' },
}

export function ScoreRing({ score, size = 56, stroke = 6 }: { score: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const mounted = useMounted()
  const color = score >= 80 ? '#059669' : score >= 65 ? '#fd550a' : '#c23d00'
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={`Match score ${score} out of 100`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#eadcc0" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={mounted ? c * (1 - score / 100) : c} style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.22,1,.36,1) .1s' }} />
      </svg>
      <span className="absolute inset-0 grid place-items-center font-bold text-navy tabular" style={{ fontSize: size * 0.32 }}>{score}</span>
    </div>
  )
}

export function Bar({ value, tone = 'indigo', h = 'h-2', className }: { value: number; tone?: 'indigo' | 'green' | 'amber'; h?: string; className?: string }) {
  const mounted = useMounted()
  const c = { indigo: 'bg-indigo-600', green: 'bg-emerald-500', amber: 'bg-amber-500' }[tone]
  return <div className={cx('w-full rounded-full bg-slate-100 overflow-hidden', h, className)}><div className={cx('h-full rounded-full transition-all duration-1000 ease-out', c)} style={{ width: mounted ? `${Math.min(100, value)}%` : 0 }} /></div>
}

export function Modal({ open, onClose, title, children, footer, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return
    const f = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', f)
    return () => window.removeEventListener('keydown', f)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-navy/50 backdrop-blur-sm fade-in" onClick={onClose} />
      <div className={cx('relative w-full bg-white rounded-2xl shadow-pop pop-in max-h-[90vh] flex flex-col', wide ? 'max-w-3xl' : 'max-w-lg')}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-line">
          <h3 className="text-lg font-bold text-navy">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-lg text-mute hover:bg-slate-100"><X size={18} /></button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-line flex justify-end gap-2 bg-slate-50/60 rounded-b-2xl">{footer}</div>}
      </div>
    </div>
  )
}

const inputCls = 'w-full rounded-xl border border-line bg-white px-3.5 text-sm text-ink placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition'
export function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[13px] font-semibold text-slate-700 mb-1.5">{label}</span>
      {children}
      {error ? <span className="block text-xs text-rose-600 mt-1">{error}</span> : hint ? <span className="block text-xs text-mute mt-1">{hint}</span> : null}
    </label>
  )
}
export const Input = (p: React.InputHTMLAttributes<HTMLInputElement>) => <input {...p} className={cx(inputCls, 'h-11', p.className)} />
export const Select = (p: React.SelectHTMLAttributes<HTMLSelectElement>) => <select {...p} className={cx(inputCls, 'h-11 pr-8', p.className)} />
export const Textarea = (p: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...p} className={cx(inputCls, 'py-2.5 leading-relaxed', p.className)} />

export function EmptyState({ title, text, action, icon }: { title: string; text: string; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="text-center py-14 px-6">
      <div className="mx-auto w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 grid place-items-center mb-4">{icon ?? <Inbox size={22} />}</div>
      <h4 className="font-bold text-navy">{title}</h4>
      <p className="text-sm text-mute mt-1 max-w-sm mx-auto">{text}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export const Toast = ({ msg }: { msg: string | null }) =>
  msg ? (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] toast-in bg-navy text-white text-sm font-medium pl-4 pr-5 py-3 rounded-xl shadow-pop flex items-center gap-2.5" role="status">
      <CheckCircle2 size={18} className="text-emerald-400" />{msg}
    </div>
  ) : null

export const SimBadge = ({ text = 'Simulated AI results' }: { text?: string }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200 px-2.5 py-1 text-xs font-semibold"><Sparkles size={12} />{text}</span>
)

export const PageHeader = ({ title, sub, actions }: { title: string; sub?: string; actions?: ReactNode }) => (
  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
    <div>
      <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-navy">{title}</h1>
      {sub && <p className="text-mute mt-1 text-sm sm:text-[15px]">{sub}</p>}
    </div>
    {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
  </div>
)

export const Avatar = ({ name, size = 36 }: { name: string; size?: number }) => {
  const hue = [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360
  return (
    <span className="grid place-items-center rounded-full font-bold text-white shrink-0" style={{ width: size, height: size, fontSize: size * 0.36, background: `hsl(${hue} 45% 38%)` }}>
      {name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
    </span>
  )
}

export const Skeleton = ({ className }: { className?: string }) => <div className={cx('skeleton rounded-lg', className)} />

export function Tabs({ tabs, value, onChange }: { tabs: string[]; value: string; onChange: (t: string) => void }) {
  return (
    <div className="inline-flex p-1 bg-slate-100 rounded-xl gap-1 overflow-x-auto max-w-full">
      {tabs.map((t) => (
        <button key={t} onClick={() => onChange(t)} className={cx('px-3.5 h-8 rounded-lg text-[13px] font-semibold whitespace-nowrap transition', value === t ? 'bg-white text-navy shadow-sm' : 'text-mute hover:text-ink')}>{t}</button>
      ))}
    </div>
  )
}

export function AreaChart({ data, labels, h = 180 }: { data: number[]; labels: string[]; h?: number }) {
  const W = 600, pad = 8, max = Math.max(...data) * 1.15
  const x = (i: number) => pad + (i * (W - pad * 2)) / (data.length - 1)
  const y = (v: number) => h - 24 - (v / max) * (h - 36)
  const line = data.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ')
  return (
    <svg viewBox={`0 0 ${W} ${h}`} className="w-full" role="img" aria-label="Application volume over time">
      <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fd550a" stopOpacity=".25" /><stop offset="1" stopColor="#fd550a" stopOpacity="0" /></linearGradient></defs>
      {[0.25, 0.5, 0.75, 1].map((g) => <line key={g} x1={pad} x2={W - pad} y1={y(max * g * 0.87)} y2={y(max * g * 0.87)} stroke="#f3e6cf" />)}
      <path className="area-fade" d={`${line} L${x(data.length - 1)},${h - 24} L${x(0)},${h - 24} Z`} fill="url(#ag)" />
      <path className="line-draw" pathLength={1} d={line} fill="none" stroke="#fd550a" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {data.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r={i === data.length - 1 ? 5 : 3} fill="#fff" stroke="#fd550a" strokeWidth="2"><title>{`${labels[i]}: ${v}`}</title></circle>)}
      {labels.map((l, i) => (i % 2 === 0 || i === labels.length - 1) && <text key={l} x={x(i)} y={h - 6} textAnchor="middle" fontSize="11" fill="#5b6478">{l}</text>)}
    </svg>
  )
}

export function Donut({ parts, size = 150 }: { parts: { label: string; value: number; color: string }[]; size?: number }) {
  const total = parts.reduce((s, p) => s + p.value, 0)
  const r = 54, c = 2 * Math.PI * r
  let acc = 0
  return (
    <svg width={size} height={size} viewBox="0 0 140 140" role="img" aria-label="Eligibility outcomes">
      <g transform="rotate(-90 70 70)">
        {parts.map((p) => {
          const len = (p.value / total) * c
          const el = <circle className="donut-seg" style={{ animationDelay: `${acc / c * 600}ms` }} key={p.label} cx="70" cy="70" r={r} fill="none" stroke={p.color} strokeWidth="18" strokeDasharray={`${len - 2} ${c - len + 2}`} strokeDashoffset={-acc}><title>{`${p.label}: ${p.value}`}</title></circle>
          acc += len
          return el
        })}
      </g>
      <text x="70" y="68" textAnchor="middle" fontSize="22" fontWeight="700" fill="#014634">{total}</text>
      <text x="70" y="85" textAnchor="middle" fontSize="10" fill="#5b6478">screened</text>
    </svg>
  )
}
