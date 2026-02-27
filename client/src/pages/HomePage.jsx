import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Brain, Compass, HeartHandshake, Medal } from "lucide-react";
import { createSession } from "../api/assessmentApi";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Container from "../components/ui/Container";
import ErrorBanner from "../components/ErrorBanner";
import { getApiErrorMessage } from "../utils/errors";
import { SESSION_STORAGE_KEY } from "../utils/constants";

const pillars = [
  {
    title: "Interest Discovery",
    description: "Based on Holland's RIASEC theory to find work environments you'll enjoy.",
    icon: Compass,
    iconClass: "bg-blue-100 text-blue-700",
  },
  {
    title: "Personality Profiling",
    description: "Big Five analysis to understand your natural behavioral tendencies.",
    icon: Brain,
    iconClass: "bg-violet-100 text-violet-700",
  },
  {
    title: "Core Values",
    description: "Identify what matters most to you in a professional setting.",
    icon: HeartHandshake,
    iconClass: "bg-rose-100 text-rose-700",
  },
  {
    title: "Strengths Assessment",
    description: "Pinpoint your top innate talents and how to leverage them.",
    icon: Medal,
    iconClass: "bg-amber-100 text-amber-700",
  },
];

function HomePage() {
  const navigate = useNavigate();
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
      setError(getApiErrorMessage(requestError, "Unable to create a new assessment session."));
    } finally {
      setIsStarting(false);
    }
  }

  return (
    <div>
      <section className="relative min-h-[calc(100vh-72px)] flex items-center justify-center overflow-hidden bg-slate-50">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-40 z-0 h-[520px] w-[520px] rounded-full bg-purple-400/20 blur-3xl"
        />
        <Container className="relative z-10 text-center">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 flex justify-center">
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100/80 px-4 py-2 text-xs font-medium text-slate-700">
                <span className="mr-2 h-2 w-2 rounded-full bg-purple-500" />
                Science-backed Career Guidance
              </span>
            </div>

            <h1 className="text-6xl font-extrabold leading-[1.05] tracking-tight text-slate-900 md:text-7xl">
              Discover a career designed for{" "}
              <span className="bg-gradient-to-r from-purple-600 to-sky-500 bg-clip-text text-transparent">
                who you are
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-500 md:text-lg">
              Stop guessing. Our comprehensive multi-dimensional assessment uncovers your unique psychological profile
              to match you with careers where you'll thrive.
            </p>

            <div className="mt-10 flex justify-center">
              <div className="inline-flex flex-wrap items-center justify-center gap-6">
                <Button
                  className="h-14 rounded-full bg-[#6C63FF] px-10 text-sm font-medium text-white shadow-[0_18px_40px_-18px_rgba(108,99,255,0.75)] transition-transform duration-200 hover:-translate-y-[-1px] hover:bg-brand-600"
                  loading={isStarting}
                  onClick={handleBeginAssessment}
                >
                  <span className="inline-flex items-center leading-none">
                    <span>Start Free Assessment</span>
                    <ArrowRight size={16} strokeWidth={2} className="ml-2 shrink-0" />
                  </span>
                </Button>
                <Button
                  variant="outline"
                  className="h-14 rounded-full border border-slate-200 bg-white px-10 text-sm font-medium text-slate-900 hover:bg-slate-50"
                  onClick={() => document.getElementById("pillars")?.scrollIntoView({ behavior: "smooth" })}
                >
                  <span>Learn How It Works</span>
                </Button>
              </div>
            </div>

            {existingSessionId ? (
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  className="text-xs text-slate-400 hover:text-slate-500"
                  onClick={() => navigate("/assessment")}
                >
                  Continue existing session
                </button>
              </div>
            ) : null}
          </div>

          {error ? (
            <div className="mx-auto mt-8 max-w-3xl">
              <ErrorBanner message={error} />
            </div>
          ) : null}
        </Container>
      </section>

      <section id="pillars" className="border-t border-line py-16">
        <Container>
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-bold text-ink">The Four Pillars of Fit</h2>
            <p className="mt-3 text-sm text-slate-500">
              Most tests only look at one dimension. We combine four distinct psychological models for holistic career
              matching.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-4">
            {pillars.map((pillar) => (
              <Card key={pillar.title} className="flex h-full min-h-[160px] flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xs font-semibold ${pillar.iconClass}`}>
                  <pillar.icon size={18} strokeWidth={2} />
                </span>
                <div className="mt-5 flex flex-1 flex-col gap-3">
                  <h3 className="text-xl font-semibold text-ink">{pillar.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-500">{pillar.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="dark-banner-pattern flex min-h-[220px] items-center justify-center overflow-hidden rounded-3xl px-6 py-12 text-center text-white shadow-card md:min-h-[260px] sm:px-10">
            <div>
            <h3 className="text-4xl font-bold">Ready to find your path?</h3>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-200">
              It takes less than 15 minutes to gain insights that could change your entire career trajectory. No account
              required to start.
            </p>
            <Button variant="light" className="mt-8 h-12 rounded-full px-10 text-sm font-medium" onClick={handleBeginAssessment}>
              <span className="leading-none">Begin Assessment</span>
            </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

export default HomePage;
