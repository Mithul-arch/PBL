import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react'
import { Button, Field, Input, Logo } from '../components/ui'
import { useApp } from '../lib/store'

type Mode = 'login' | 'register' | 'reset'
const COPY = {
  recruiter: { title: 'Recruiter / Company', demo: 'dana@northwindlabs.com', name: 'Dana Whitfield', pts: ['Configure mandatory and weighted requirements', 'Screen with evidence-linked AI scores', 'Compare, shortlist and schedule in one place'] },
  applicant: { title: 'Job Applicant', demo: 'priya.raman@mail.com', name: 'Priya Raman', pts: ['Upload your resume and fix parsing errors', 'Apply to roles that match your skills', 'See where you stand and how to close gaps'] },
}

export default function Auth({ role, mode }: { role: 'recruiter' | 'applicant'; mode: Mode }) {
  const { go, login, toast } = useApp()
  const c = COPY[role]
  const [email, setEmail] = useState(mode === 'login' ? c.demo : '')
  const [pw, setPw] = useState(mode === 'login' ? 'demo-password' : '')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [sent, setSent] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (busy || sent) return
    setErr('')
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr('Enter a valid email address.')
    if (mode !== 'reset' && pw.length < 8) return setErr('Password must be at least 8 characters.')
    if (mode === 'register' && !name.trim()) return setErr('Please enter your name.')
    setBusy(true)
    timer.current = setTimeout(() => {
      setBusy(false)
      if (mode === 'reset') return setSent(true)
      if (mode === 'login') login({ role, name: c.name, email })
      else login({ role, name: name.trim(), email, fresh: true })
      toast(mode === 'login' ? `Welcome back, ${c.name.split(' ')[0]}` : 'Account created (simulated)')
      go(role === 'recruiter' ? '/r/dashboard' : '/a/dashboard')
    }, 900)
  }
  const other = role === 'recruiter' ? 'applicant' : 'recruiter'

  return (
    <div className="thermal-page min-h-screen grid lg:grid-cols-[1fr_1.1fr]">
      <div className="thermal-dark hidden lg:flex flex-col justify-between text-white p-12 relative overflow-hidden">
        <button onClick={() => go('/')}><Logo light /></button>
        <div className="relative">
          <div className="text-sm font-bold text-indigo-300">{c.title.toUpperCase()}</div>
          <h2 className="text-4xl font-bold tracking-tight mt-3 leading-tight">{role === 'recruiter' ? 'Screen faster. Decide with evidence.' : 'Get matched on what you can actually do.'}</h2>
          <ul className="mt-8 space-y-3.5">{c.pts.map((p) => <li key={p} className="flex gap-3 text-indigo-100/85"><CheckCircle2 size={20} className="text-indigo-300 shrink-0 mt-0.5" />{p}</li>)}</ul>
        </div>
        <div className="relative text-xs text-indigo-100/60 flex items-center gap-2"><ShieldCheck size={14} />Prototype: authentication is simulated.</div>
      </div>

      <div className="flex flex-col px-5 sm:px-12 py-8 bg-white/60">
        <div className="flex items-center justify-between">
          <button onClick={() => go('/')} className="inline-flex items-center gap-1.5 text-sm font-medium text-mute hover:text-ink"><ArrowLeft size={16} />Back</button>
          <div className="lg:hidden"><Logo /></div>
        </div>
        <div className="flex-1 grid place-items-center">
          <form onSubmit={submit} className="w-full max-w-[400px] fade-up" noValidate>
            <h1 className="text-3xl font-bold tracking-tight text-navy">{mode === 'login' ? 'Sign in' : mode === 'register' ? 'Create your account' : 'Reset your password'}</h1>
            <p className="text-mute mt-2 text-[15px]">{mode === 'login' ? `${c.title} portal` : mode === 'register' ? `Join TalentIQ as a ${role === 'recruiter' ? 'recruiter' : 'job applicant'}.` : "Enter your email and we'll send a reset link."}</p>

            {sent ? (
              <div className="mt-8 rounded-2xl bg-emerald-50 ring-1 ring-emerald-200 p-5 text-emerald-900 text-sm">
                <CheckCircle2 className="mb-2" /> If an account exists for <b>{email}</b>, a reset link is on its way (simulated).
                <Button className="mt-4 w-full" onClick={() => go(`/login/${role}`)}>Back to sign in</Button>
              </div>
            ) : (
              <div className="mt-8 space-y-4">
                {mode === 'register' && <Field label="Full name"><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jordan Lee" autoComplete="name" /></Field>}
                {mode === 'register' && role === 'recruiter' && <Field label="Company"><Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Aarya Analytics" /></Field>}
                <Field label="Work email" hint={mode === 'login' ? 'Demo account pre-filled.' : undefined}><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" autoComplete="email" /></Field>
                {mode !== 'reset' && <Field label="Password"><Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="At least 8 characters" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /></Field>}
                {err && <div role="alert" className="rounded-xl bg-rose-50 ring-1 ring-rose-200 px-3.5 py-2.5 text-sm text-rose-700">{err}</div>}
                <Button type="submit" size="lg" className="w-full" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : mode === 'register' ? 'Create account' : 'Send reset link'}</Button>
                {mode === 'login' && <button type="button" onClick={() => go(`/reset/${role}`)} className="block mx-auto text-sm font-medium text-indigo-600 hover:underline">Forgot password?</button>}
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-line text-sm text-mute space-y-2 text-center">
              {mode === 'login' ? <p>New here? <button type="button" onClick={() => go(`/register/${role}`)} className="font-semibold text-indigo-600 hover:underline">Create an account</button></p> : <p>Already registered? <button type="button" onClick={() => go(`/login/${role}`)} className="font-semibold text-indigo-600 hover:underline">Sign in</button></p>}
              <p>Looking for the {other} portal? <button type="button" onClick={() => go(`/login/${other}`)} className="font-semibold text-indigo-600 hover:underline">Switch</button></p>
            </div>
            <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-amber-800"><Sparkles size={12} />Simulated sign-in for prototype</div>
          </form>
        </div>
      </div>
    </div>
  )
}
