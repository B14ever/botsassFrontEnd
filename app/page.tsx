import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900 text-zinc-50">
      <header className="border-b border-white/5 bg-zinc-950/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-sky-400 via-cyan-400 to-emerald-400">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-950">
                KB
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight">
                KiboBot
              </span>
              <span className="text-xs text-zinc-400">
                AI support for your SaaS
              </span>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-zinc-300 md:flex">
            <a href="#features" className="transition hover:text-zinc-50">
              Features
            </a>
            <a href="#how-it-works" className="transition hover:text-zinc-50">
              How it works
            </a>
            <a href="#pricing" className="transition hover:text-zinc-50">
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="hidden md:inline-flex">
              <Link href="/login">Log in</Link>
            </Button>
            <Button size="sm" className="bg-sky-500 text-zinc-950 hover:bg-sky-400">
              <Link href="/register">Start free trial</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-20 px-4 py-12 md:px-6 md:py-20">
        <section className="grid gap-12 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-200">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/10 text-[10px] text-emerald-400">
                ●
              </span>
              <span>Instant AI chat widget for your product</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
                Turn support tickets into
                <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                  {" "}
                  happy customers.
                </span>
              </h1>
              <p className="max-w-xl text-balance text-sm leading-relaxed text-zinc-300 sm:text-base">
                KiboBot is your AI support copilot. Launch an embedded chat widget,
                train it on your docs, and start deflecting repetitive questions in
                minutes—without hiring another agent.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex gap-3">
                <Button size="lg" className="bg-sky-500 text-zinc-950 hover:bg-sky-400">
                  Get started in 5 minutes
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/15 bg-transparent text-zinc-50 hover:bg-white/10"
                >
                  Book a live demo
                </Button>
              </div>
              <p className="text-xs text-zinc-400">
                No credit card required · 14-day free trial
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="text-yellow-300">★★★★★</span>
                <span>Trusted by 200+ SaaS teams</span>
              </div>
              <div className="h-4 w-px bg-zinc-700" />
              <div>Average 38% fewer support tickets</div>
            </div>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute -inset-6 rounded-[1.75rem] bg-gradient-to-tr from-sky-500/20 via-cyan-400/10 to-emerald-400/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/70 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.65)]">
              <div className="mb-4 flex items-center justify-between text-xs text-zinc-400">
                <span className="inline-flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-zinc-800 text-[10px] font-semibold">
                    KB
                  </span>
                  <span className="font-medium text-zinc-200">Kibo support</span>
                </span>
                <span>Online · &lt;1 min response</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex max-w-[80%] rounded-2xl bg-zinc-800 px-3 py-2 text-zinc-100">
                  How do I embed the chatbot inside my dashboard?
                </div>
                <div className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl bg-sky-500 px-3 py-2 text-zinc-950">
                    Install the script, connect your docs, and flip the toggle in the
                    Kibo dashboard. You&apos;ll be live in under 5 minutes.
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="max-w-[75%] rounded-2xl bg-sky-500/90 px-3 py-2 text-zinc-950">
                    Want me to generate the exact snippet for your app?
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-xl border border-zinc-700/60 bg-zinc-900 px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-xs text-zinc-300">
                  Kibo is replying using your help center, changelog and product docs.
                </span>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="space-y-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
                Everything you need to launch AI support
              </h2>
              <p className="mt-1 max-w-xl text-sm text-zinc-400">
                Kibo connects to your existing tools so you can answer questions with
                real product context—not generic AI responses.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 text-sky-300">
                <span className="text-lg">⚡</span>
              </div>
              <h3 className="mt-4 text-sm font-semibold">5‑minute widget setup</h3>
              <p className="mt-2 text-xs text-zinc-400">
                Copy a single script tag, add your domain, and Kibo automatically
                picks up your brand colors and theme.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
                <span className="text-lg">📚</span>
              </div>
              <h3 className="mt-4 text-sm font-semibold">Docs & chat history as context</h3>
              <p className="mt-2 text-xs text-zinc-400">
                Sync from Notion, your website, or your own API and let Kibo answer
                based on your real documentation and past conversations.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-500/15 text-fuchsia-300">
                <span className="text-lg">🔌</span>
              </div>
              <h3 className="mt-4 text-sm font-semibold">Works with your stack</h3>
              <p className="mt-2 text-xs text-zinc-400">
                Use our REST and JavaScript SDKs to push events, identify users, and
                see exactly how AI is answering inside your app.
              </p>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="grid gap-8 rounded-3xl border border-white/5 bg-zinc-900/60 p-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:p-8"
        >
          <div className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
              Launch in three simple steps
            </h2>
            <p className="text-sm text-zinc-400">
              Kibo is designed for fast-moving SaaS teams. Go from idea to live AI
              support without weeks of implementation work.
            </p>

            <ol className="mt-4 space-y-4 text-sm">
              <li className="flex gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500/20 text-xs font-semibold text-sky-300">
                  1
                </div>
                <div>
                  <div className="font-medium">Connect your knowledge sources</div>
                  <p className="mt-1 text-xs text-zinc-400">
                    Plug in your docs, website, or a JSON API. Kibo keeps everything
                    in sync automatically.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500/20 text-xs font-semibold text-sky-300">
                  2
                </div>
                <div>
                  <div className="font-medium">Drop the widget into your app</div>
                  <p className="mt-1 text-xs text-zinc-400">
                    Add a single script and optional SDK, then customize the widget to
                    match your brand.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500/20 text-xs font-semibold text-sky-300">
                  3
                </div>
                <div>
                  <div className="font-medium">Review, refine, and go live</div>
                  <p className="mt-1 text-xs text-zinc-400">
                    Approve responses, add guardrails, and ship the experience to
                    every workspace in your product.
                  </p>
                </div>
              </li>
            </ol>
          </div>

          <div className="space-y-4 rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
            <h3 className="text-sm font-semibold">What you&apos;ll see in your dashboard</h3>
            <div className="space-y-3 rounded-xl border border-white/5 bg-zinc-900/80 p-3 text-xs">
              <div className="flex items-center justify-between text-zinc-300">
                <span>Today</span>
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] text-emerald-300">
                  Live
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[11px]">
                <div className="rounded-lg bg-zinc-800/80 p-2">
                  <div className="text-[10px] text-zinc-400">Deflected tickets</div>
                  <div className="mt-1 text-sm font-semibold text-emerald-300">
                    38%
                  </div>
                </div>
                <div className="rounded-lg bg-zinc-800/80 p-2">
                  <div className="text-[10px] text-zinc-400">CSAT</div>
                  <div className="mt-1 text-sm font-semibold text-sky-300">
                    4.8
                  </div>
                </div>
                <div className="rounded-lg bg-zinc-800/80 p-2">
                  <div className="text-[10px] text-zinc-400">Response time</div>
                  <div className="mt-1 text-sm font-semibold text-zinc-100">
                    2.3s
                  </div>
                </div>
              </div>
              <div className="mt-1 text-[11px] text-zinc-400">
                Kibo automatically tracks how many conversations are fully resolved by
                AI and where humans step in.
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="space-y-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
                Pricing that scales with you
              </h2>
              <p className="mt-1 max-w-xl text-sm text-zinc-400">
                Start free, then only pay as conversations grow. Perfect for early
                teams and mature SaaS alike.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="flex flex-col justify-between rounded-2xl border border-sky-500/50 bg-gradient-to-br from-sky-500/15 via-zinc-900 to-zinc-950 p-5">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/15 px-2.5 py-1 text-[11px] font-medium text-sky-200">
                  Most popular
                </div>
                <h3 className="mt-3 text-sm font-semibold">Growth</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-semibold">$79</span>
                  <span className="text-xs text-zinc-400">/month</span>
                </div>
                <p className="mt-2 text-xs text-zinc-300">
                  Up to 2,000 AI‑resolved conversations per month. Perfect for SaaS
                  teams ready to offload most support.
                </p>
              </div>
              <ul className="mt-4 space-y-2 text-xs text-zinc-200">
                <li>● Unlimited widgets & workspaces</li>
                <li>● All integrations & SDKs</li>
                <li>● Human‑in‑the‑loop review tools</li>
                <li>● Priority support</li>
              </ul>
              <div className="mt-5 flex gap-3">
                <Button className="flex-1 bg-sky-500 text-zinc-950 hover:bg-sky-400">
                  Start 14‑day trial
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-white/20 bg-transparent text-zinc-50 hover:bg-white/10"
                >
                  Talk to sales
                </Button>
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-white/10 bg-zinc-900/60 p-5 text-xs text-zinc-300">
              <h3 className="text-sm font-semibold text-zinc-50">
                Built for modern product teams
              </h3>
              <p>
                Kibo gives PMs, designers, and support leaders a shared place to tune
                AI behavior, experiment with prompts, and roll out safe automation.
              </p>
              <p>
                You control exactly where AI answers, when to escalate to humans, and
                what data is allowed to leave your workspace.
              </p>
              <p className="text-zinc-400">
                SOC 2‑ready architecture, regional hosting options and SSO are
                available on Enterprise plans.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 bg-zinc-950/80">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-zinc-500 md:flex-row md:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-tr from-sky-400 via-cyan-400 to-emerald-400">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-950">
                KB
              </span>
            </div>
            <span>© {new Date().getFullYear()} KiboBot Inc.</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#features" className="hover:text-zinc-300">
              Features
            </a>
            <a href="#pricing" className="hover:text-zinc-300">
              Pricing
            </a>
            <a href="/login" className="hover:text-zinc-300">
              Log in
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
