import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Activity, Database, LayoutDashboard, LogOut, Settings, Target, UserRound, Zap } from 'lucide-react'

import { apiJson } from '../../lib/api'
import { cn } from '../../lib/utils'

type OmniscientShellProps = {
  title: string
  subtitle: string
  actions?: React.ReactNode
  children: React.ReactNode
}

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/hunt', label: 'The Hunt', icon: Target },
  { to: '/vault', label: 'The Vault', icon: Database },
  { to: '/triage', label: 'Triage', icon: Zap },
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/admin/inquiries', label: 'Inquiries', icon: Activity },
  { to: '/account', label: 'Account', icon: UserRound },
]

export default function OmniscientShell({ title, subtitle, actions, children }: OmniscientShellProps) {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await apiJson('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        timeoutMs: 10000,
      })
    } catch {
      // ignore logout edge failures and still return to login
    } finally {
      navigate('/admin/login', { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="mx-auto flex w-full max-w-[1440px] gap-6 px-4 pb-16 pt-28 lg:px-6">
        <aside className="hidden w-[260px] shrink-0 lg:block">
          <div className="sticky top-28 axiom-bento p-5">
            <div className="border-b border-axiom-border pb-5">
              <p className="text-[10px] font-mono uppercase tracking-[0.32em] text-axiom-text-mute">Axiom Ops</p>
              <h2 className="mt-2 text-2xl font-semibold text-axiom-text-main">Omniscient</h2>
              <p className="mt-2 text-sm text-axiom-text-mute">Internal lead intelligence running inside the Axiom ops stack.</p>
            </div>

            <nav className="mt-5 flex flex-col gap-2">
              {navItems.map((item) => {
                const active = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)
                return (
                  <Link
                    key={item.to}
                    className={cn(
                      'flex items-center gap-3 rounded-xl border px-3 py-3 text-sm transition-all',
                      active
                        ? 'border-[rgba(194,110,78,0.35)] bg-[rgba(194,110,78,0.12)] text-axiom-text-main'
                        : 'border-transparent text-axiom-text-mute hover:border-axiom-border hover:bg-white/[0.03] hover:text-axiom-text-main'
                    )}
                    to={item.to}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            <button
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-axiom-border px-3 py-3 text-sm text-axiom-text-mute transition-all hover:border-[rgba(194,110,78,0.35)] hover:text-axiom-text-main"
              onClick={handleLogout}
              type="button"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4 border-b border-axiom-border pb-5">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.32em] text-axiom-text-mute">Protected Operations</p>
              <h1 className="mt-2 text-3xl font-semibold text-axiom-text-main lg:text-4xl">{title}</h1>
              <p className="mt-2 max-w-3xl text-sm text-axiom-text-mute">{subtitle}</p>
            </div>
            {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
          </div>

          <div className="mb-5 flex gap-2 overflow-x-auto pb-2 lg:hidden">
            {navItems.map((item) => {
              const active = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)
              return (
                <Link
                  key={item.to}
                  className={cn(
                    'whitespace-nowrap rounded-full border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em]',
                    active
                      ? 'border-[rgba(194,110,78,0.35)] bg-[rgba(194,110,78,0.12)] text-axiom-text-main'
                      : 'border-axiom-border text-axiom-text-mute'
                  )}
                  to={item.to}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          <div className="space-y-6">{children}</div>
        </div>
      </div>
    </div>
  )
}
