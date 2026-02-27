import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Brain, Compass, HeartHandshake, Medal } from "lucide-react";
import { createSession } from "../api/assessmentApi";
import Button from "../components/ui/Button";
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
    <main className="min-h-screen overflow-x-hidden bg-slate-50">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-32 -right-40 h-[520px] w-[520px] rounded-full bg-purple-400/20 blur-3xl" />

        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 mx-auto max-w-4xl pt-16 pb-12 text-center sm:pt-20 sm:pb-14 lg:pt-24 lg:pb-16">
            <div className="mb-6 flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100/80 px-4 py-2 text-xs font-medium text-slate-700">
                <span className="h-2 w-2 rounded-full bg-purple-500" />
                Science-backed Career Guidance
              </span>
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl lg:leading-[1.05]">
              Discover a career designed for{" "}
              <span className="bg-gradient-to-r from-purple-600 to-sky-500 bg-clip-text text-transparent">
                who you are
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base md:text-lg">
              Stop guessing. Our comprehensive multi-dimensional assessment uncovers your unique psychological profile
              to match you with careers where you&apos;ll thrive.
            </p>

            <div className="mx-auto mt-8 flex flex-col items-stretch gap-3 sm:mt-10 sm:inline-flex sm:flex-row sm:items-center sm:justify-center sm:gap-5">
                <Button
                  className="h-12 w-full rounded-full bg-[#5B54F6] px-6 text-sm font-medium text-white shadow-[0_22px_50px_-22px_rgba(91,84,246,0.9)] transition-transform duration-200 hover:-translate-y-[-1px] hover:bg-[#4C46E5] sm:h-14 sm:w-auto sm:px-10"
                  loading={isStarting}
                  onClick={handleBeginAssessment}
                >
                  <span className="inline-flex items-center gap-2 leading-none">
                    Start Free Assessment
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </span>
                </Button>

                <Button
                  variant="outline"
                  className="h-12 w-full rounded-full border border-slate-200 bg-white px-6 text-sm font-medium text-slate-900 hover:bg-slate-50 sm:h-14 sm:w-auto sm:px-10"
                  onClick={() => document.getElementById("pillars")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Learn How It Works
                </Button>
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

            {error ? (
              <div className="mx-auto mt-6 max-w-3xl">
                <ErrorBanner message={error} />
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section id="pillars" className="py-14 sm:py-16 lg:py-20">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-bold text-slate-900">The Four Pillars of Fit</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500">
              Most tests only look at one dimension. We combine four distinct psychological models for holistic career
              matching.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((pillar) => (
              <article
                key={pillar.title}
                className="flex h-full min-h-[160px] flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <span
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${pillar.iconClass}`}
                >
                  <pillar.icon size={18} strokeWidth={2} />
                </span>

                <div className="mt-4 flex flex-1 flex-col">
                  <h3 className="text-xl font-semibold text-slate-900">{pillar.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-500">{pillar.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="dark-banner-pattern flex min-h-[200px] items-center justify-center rounded-3xl px-6 py-12 text-center text-white shadow-card sm:min-h-[220px] sm:px-10 lg:min-h-[260px]">
            <div className="mx-auto max-w-3xl">
              <h3 className="text-4xl font-bold">Ready to find your path?</h3>
              <p className="mx-auto mt-4 max-w-2xl text-base text-slate-200">
                It takes less than 15 minutes to gain insights that could change your entire career trajectory. No
                account required to start.
              </p>
              <Button
                variant="light"
                className="mt-8 h-12 w-full max-w-xs rounded-full px-6 text-sm font-medium sm:h-14 sm:w-auto sm:px-10"
                onClick={handleBeginAssessment}
              >
                Begin Assessment
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
