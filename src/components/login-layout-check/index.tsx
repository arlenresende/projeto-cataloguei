'use client'

import { useState } from 'react'
import { Eye, EyeOff, Menu, MoreVertical, Plus } from 'lucide-react'

function BrandHeader() {
  return (
    <header className="flex items-center justify-between gap-4 px-8 py-7 sm:px-10 lg:px-12">
      <div className="flex items-center gap-7">
        <span className="text-lg font-bold tracking-tight">PineMin</span>
        <span className="hidden text-[11px] text-muted-foreground sm:inline">Ph. +830.430.9879</span>
      </div>
      <nav className="hidden items-center gap-7 text-xs font-medium md:flex" aria-label="Primary navigation">
        <a href="#agency" className="transition-opacity hover:opacity-60">Agency</a>
        <a href="#service" className="transition-opacity hover:opacity-60">Service</a>
        <a href="#account" className="transition-opacity hover:opacity-60">My Account</a>
        <button type="button" aria-label="Open menu" className="flex size-9 items-center justify-center rounded-full bg-card shadow-sm ring-1 ring-border/60">
          <Menu aria-hidden="true" size={16} strokeWidth={1.8} />
        </button>
      </nav>
      <button type="button" aria-label="Open menu" className="flex size-9 items-center justify-center rounded-full bg-card shadow-sm ring-1 ring-border/60 md:hidden">
        <Menu aria-hidden="true" size={16} strokeWidth={1.8} />
      </button>
    </header>
  )
}

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')

  return (
    <section className="flex flex-1 flex-col px-8 pb-8 sm:px-10 lg:px-12" aria-labelledby="login-heading">
      <div className="mx-auto flex w-full max-w-[360px] flex-1 flex-col justify-center py-10 lg:py-16">
        <h1 id="login-heading" className="text-balance text-2xl font-bold tracking-tight sm:text-[25px]">Login to Your Account!</h1>
        <div className="mt-7 flex gap-2.5">
          <button type="button" className="h-9 flex-1 rounded-md border border-foreground bg-foreground px-3 text-[10px] font-semibold text-background shadow-sm transition-transform hover:-translate-y-0.5">Login With Facebook</button>
          <button type="button" className="h-9 flex-1 rounded-md border border-foreground bg-card px-3 text-[10px] font-semibold text-foreground shadow-sm transition-transform hover:-translate-y-0.5">Login With Twitter</button>
        </div>
        <div className="my-5 flex items-center gap-3 text-[10px] text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">- OR -</div>
        <form className="flex flex-col gap-4" onSubmit={(event) => { event.preventDefault(); setMessage('Welcome back to PineMin.') }}>
          <label className="flex flex-col gap-1 text-[10px] text-muted-foreground" htmlFor="email">
            Email Address
            <input id="email" type="email" defaultValue="dean.ambrose@yahoo.com" className="h-7 border-b border-foreground/80 bg-transparent text-sm font-semibold text-foreground outline-none placeholder:text-muted-foreground focus:border-accent" />
          </label>
          <label className="flex flex-col gap-1 text-[10px] text-muted-foreground" htmlFor="password">
            Password
            <span className="relative flex items-center border-b border-foreground/80">
              <input id="password" type={showPassword ? 'text' : 'password'} defaultValue="password" className="h-7 w-full bg-transparent text-sm font-semibold tracking-[0.22em] text-foreground outline-none" />
              <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground transition-colors hover:text-foreground">
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </span>
          </label>
          <div className="flex items-center justify-between pt-0.5 text-[9px] text-muted-foreground">
            <label className="flex items-center gap-1.5"><input type="checkbox" className="size-3 accent-foreground" /> Remember Me</label>
            <a href="#forgot" className="hover:text-foreground">Forgot Password</a>
          </div>
          <button type="submit" className="mt-1 h-9 w-fit rounded-md border border-foreground bg-accent px-4 text-[10px] font-bold text-accent-foreground shadow-[3px_3px_0_var(--foreground)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--foreground)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_var(--foreground)]">Login To Your Account</button>
          {message && <p role="status" className="text-[10px] text-muted-foreground">{message}</p>}
          <p className="text-[10px] text-muted-foreground">Don&apos;t have an account ? <a href="#signup" className="font-bold text-foreground">Signup</a></p>
        </form>
      </div>
      <footer className="flex gap-2 px-1 text-[10px] font-semibold"><a href="#facebook">Facebook</a><span>|</span><a href="#linkedin">Linkedin</a><span>|</span><a href="#twitter">Twitter</a></footer>
    </section>
  )
}

function FinancePreview() {
  return (
    <section className="relative hidden min-h-[620px] flex-1 overflow-hidden bg-pattern lg:block" aria-label="PineMin account preview">
      <div className="absolute left-[18%] top-[36%] w-[58%] max-w-[270px] rounded-xl bg-[#292d31] p-7 text-background shadow-xl">
        <div className="flex items-center justify-between"><div className="flex -space-x-2"><span className="size-4 rounded-full bg-accent" /><span className="size-4 rounded-full border border-background bg-card" /></div><MoreVertical size={17} /></div>
        <p className="mt-5 text-2xl font-light">$ 6421.50</p><p className="mt-2 text-xs">Balance</p><div className="mt-10 flex justify-between text-[10px] tracking-[0.25em] text-accent"><span>** **</span><span>****</span><span>3667</span></div>
      </div>
      <div className="absolute right-[7%] top-[23%] w-[68%] max-w-[250px] rounded-xl bg-card px-7 py-5 shadow-lg"><div className="flex items-start justify-between"><div><p className="text-xs">12:30 - 15:45</p><p className="mt-1 text-base font-medium">Promotional SMS</p></div><MoreVertical size={16} /></div><div className="mt-3 flex items-center justify-between"><div className="flex -space-x-2"><span className="size-8 rounded-full bg-[#d4b49c] ring-2 ring-card" /><span className="size-8 rounded-full bg-[#8f806c] ring-2 ring-card" /><span className="size-8 rounded-full bg-[#65734b] ring-2 ring-card" /></div><span className="flex size-9 items-center justify-center rounded-full bg-accent text-sm font-semibold">+8</span></div></div>
      <div className="absolute left-[9%] top-[55%] w-[42%] max-w-[158px] rounded-xl bg-card p-5 shadow-lg"><div className="flex h-10 items-end justify-between gap-2"><i className="h-4 w-3 rounded bg-foreground/80" /><i className="h-2 w-3 rounded bg-muted-foreground" /><i className="h-7 w-3 rounded bg-accent" /><i className="h-10 w-3 rounded bg-accent" /><i className="h-3 w-3 rounded bg-muted-foreground" /><i className="h-8 w-3 rounded bg-accent" /><i className="h-4 w-3 rounded bg-foreground/80" /></div><div className="mt-2 flex justify-between text-[8px] text-muted-foreground"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div></div>
      <div className="absolute bottom-0 right-[7%] w-[77%] max-w-[275px] rounded-t-xl bg-card p-4 shadow-lg"><div className="flex items-center gap-3"><span className="flex size-8 items-center justify-center rounded-full bg-foreground text-sm text-background">P&apos;</span><div><p className="text-xs font-medium">PineMin</p><p className="text-[10px] text-foreground/80">Hey there, 😉 How can we help you.....?</p></div><span className="ml-auto text-[9px] text-muted-foreground">2 Min Ago</span></div><div className="mt-3 border-t border-border pt-2 text-right"><button type="button" className="rounded-full border border-foreground bg-accent px-3 py-1 text-[9px] font-semibold shadow-[2px_2px_0_var(--foreground)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--foreground)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none">Chat Now</button></div></div>
    </section>
  )
}

export default function Page() {
  return <main className="min-h-screen bg-page px-3 py-6 sm:px-6 sm:py-12"><div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-[1220px] overflow-hidden rounded-[26px] bg-card shadow-sm"><div className="flex min-w-0 flex-1 flex-col"><BrandHeader /><LoginForm /></div><FinancePreview /></div></main>
}
