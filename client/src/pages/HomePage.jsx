import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Clock3,
  Compass,
  HeartHandshake,
  Medal,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { createSession } from "../api/assessmentApi";
import ErrorBanner from "../components/ErrorBanner";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import { useToast } from "../components/ui/ToastProvider";
import { SESSION_STORAGE_KEY } from "../utils/constants";
import { getApiErrorMessage } from "../utils/errors";

const pillars = [
  {
    title: "Interest Discovery",
    description: "Map the environments, tasks, and work patterns you naturally gravitate toward.",
    icon: Compass,
    iconClass: "bg-brand-100 text-brand-700",
  },
  {
    title: "Personality Profiling",
    description: "Measure how you communicate, decide, and perform under pressure using Big Five signals.",
    icon: Brain,
    iconClass: "bg-slate-100 text-slate-700",
  },
  {
    title: "Core Values",
    description: "Surface the motivators that make a role sustainable, meaningful, and worth committing to.",
    icon: HeartHandshake,
    iconClass: "bg-amber-100 text-amber-700",
  },
  {
    title: "Strength Signals",
    description: "Highlight the abilities you should lean on when evaluating roles and growth paths.",
    icon: Medal,
    iconClass: "bg-emerald-100 text-emerald-700",
  },
];

const benefits = [
  {
    icon: CheckCircle2,
    title: "Actionable output",
    description: "You get clear career matches instead of generic personality labels.",
  },
  {
    icon: Clock3,
    title: "Fast to complete",
    description: "Designed to feel lightweight on mobile and finish in one focused sitting.",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    description: "No account or admin flow surfaces in the product experience.",
  },
];

function HomePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState("");
  const existingSessionId = useMemo(() => localStorage.getItem(SESSION_STORAGE_KEY), []);

  async function handleBeginAssessment() {
    setIsStarting(true);
    setError("");

    try {
      const data = await createSession();
      localStorage.setItem(SESSION_STORAGE_KEY, data.sessionId);
      navigate("/assessment");
    } catch (requestError) {
      const message = getApiErrorMessage(requestError, "Unable to create a new assessment session.");
      setError(message);
      toast({
        title: "Session could not be created.",
        description: message,
      });
    } finally {
      setIsStarting(false);
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden">
      <section className="relative">
        <Container className="py-8 sm:py-10 lg:py-14">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="dark-banner-pattern rounded-[32px] p-6 text-white shadow-card sm:p-8 lg:p-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85">
                <Sparkles size={14} strokeWidth={2} />
                Premium psychometric guidance
              </span>

              <div className="mt-5 space-y-5">
                <h1 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                  Make career decisions with more signal and less guesswork.
                </h1>
                <p className="max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-base">
                  PathFinder turns your interests, strengths, values, and personality into a polished career-fit report
                  built for real-world decisions.
                </p>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className="w-full sm:w-auto"
                  loading={isStarting}
                  onClick={handleBeginAssessment}
                >
                  Start Assessment
                  <ArrowRight size={18} strokeWidth={2} />
                </Button>
                <Button
                  variant="light"
                  size="lg"
                  className="w-full bg-white/95 sm:w-auto"
                  onClick={() => document.getElementById("pillars")?.scrollIntoView({ behavior: "smooth" })}
                >
                  See What You Get
                </Button>
              </div>

              {existingSessionId ? (
                <button
                  type="button"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-white"
                  onClick={() => navigate("/assessment")}
                >
                  Continue existing session
                  <ArrowRight size={16} strokeWidth={2} />
                </button>
              ) : null}

              {error ? (
                <div className="mt-6">
                  <ErrorBanner message={error} />
                </div>
              ) : null}

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-white/10 p-4">
                  <p className="text-2xl font-semibold">11</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/70">Assessment steps</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/10 p-4">
                  <p className="text-2xl font-semibold">4</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/70">Psychometric pillars</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/10 p-4">
                  <p className="text-2xl font-semibold">10</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/70">Career matches</p>
                </div>
              </div>
            </div>

            <Card className="p-5 sm:p-7">
              <div className="space-y-5">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Why it feels premium
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">
                    A report experience built to be useful, not just interesting.
                  </h2>
                </div>

                <div className="space-y-4">
                  {benefits.map((benefit) => (
                    <div
                      key={benefit.title}
                      className="rounded-3xl border border-slate-200/70 bg-slate-50/80 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-brand-700 shadow-subtle">
                          <benefit.icon size={18} strokeWidth={2} />
                        </span>
                        <div className="min-w-0">
                          <h3 className="text-base font-semibold text-slate-900">{benefit.title}</h3>
                          <p className="mt-1 text-sm leading-relaxed text-slate-500">{benefit.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-3xl border border-brand-100 bg-brand-50/80 p-5">
                  <p className="text-sm font-semibold text-brand-800">What you unlock</p>
                  <ul className="mt-3 space-y-2 text-sm leading-relaxed text-brand-900">
                    <li className="flex gap-2">
                      <CheckCircle2 size={16} strokeWidth={2} className="mt-0.5 shrink-0" />
                      A tailored summary of your strongest fit signals.
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 size={16} strokeWidth={2} className="mt-0.5 shrink-0" />
                      Clear score breakdowns across every psychometric dimension.
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 size={16} strokeWidth={2} className="mt-0.5 shrink-0" />
                      Career recommendations optimized for mobile and desktop review.
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      <section className="pb-4">
        <Container>
          <div className="grid gap-4 sm:grid-cols-3">
            {benefits.map((benefit) => (
              <Card key={`overview-${benefit.title}`} className="p-5">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                    <benefit.icon size={18} strokeWidth={2} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-slate-900">{benefit.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-500">{benefit.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section id="pillars" className="py-8 sm:py-10 lg:py-12">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">How the model works</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">Four pillars. One clear signal.</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-500 sm:text-base">
              Each step feeds a single premium report, so the final recommendation balances motivation, temperament,
              aptitude, and work values.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {pillars.map((pillar) => (
              <Card key={pillar.title} className="flex h-full flex-col p-5 sm:p-6">
                <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${pillar.iconClass}`}>
                  <pillar.icon size={20} strokeWidth={2} />
                </span>
                <h3 className="mt-5 text-xl font-semibold text-slate-900">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">{pillar.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-8 sm:pb-12">
        <Container>
          <div className="dark-banner-pattern rounded-[32px] px-6 py-8 text-white shadow-card sm:px-8 sm:py-10">
            <div className="mx-auto flex max-w-4xl flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-2xl">
                <h3 className="text-3xl font-semibold sm:text-4xl">Ready to see your best-fit career paths?</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-200 sm:text-base">
                  Start on mobile, finish on desktop, and keep the same session all the way through.
                </p>
              </div>
              <Button variant="light" size="lg" className="w-full sm:w-auto" onClick={handleBeginAssessment}>
                Begin Assessment
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

export default HomePage;
