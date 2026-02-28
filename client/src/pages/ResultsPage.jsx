import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Award, Briefcase, Download, Gauge, RefreshCcw, Scale, Sparkles } from "lucide-react";
import { createSession, getAssessmentResults } from "../api/assessmentApi";
import ErrorBanner from "../components/ErrorBanner";
import ResultsSkeleton from "../components/ResultsSkeleton";
import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import { useToast } from "../components/ui/ToastProvider";
import CareerMatchCard from "../components/results/CareerMatchCard";
import InsightText from "../components/results/InsightText";
import ResultCard from "../components/results/ResultCard";
import ResultHeader from "../components/results/ResultHeader";
import { SESSION_STORAGE_KEY } from "../utils/constants";
import { getApiErrorMessage } from "../utils/errors";
import { formatDateFileStamp } from "../utils/formatters";

function SummaryCard({ icon: Icon, title, value, description, toneClass }) {
  return (
    <ResultCard className="space-y-4">
      <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${toneClass}`}>
        <Icon size={20} strokeWidth={2} />
      </span>
      <div className="space-y-1.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{title}</p>
        <p className="text-xl font-semibold text-slate-900">{value}</p>
        <p className="text-sm leading-relaxed text-slate-500">{description}</p>
      </div>
    </ResultCard>
  );
}

function ScoreBreakdownCard({ title, subtitle, items }) {
  return (
    <ResultCard className="space-y-5">
      <header className="space-y-1">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </header>

      <div className="space-y-4">
        {items?.slice(0, 5).map((item) => (
          <div key={item.traitKey} className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="min-w-0 text-sm font-semibold text-slate-700">{item.trait}</span>
              <span className="text-sm font-semibold text-brand-700">{item.score}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-200/80">
              <div
                className="h-full rounded-full bg-brand-500 transition-all duration-700"
                style={{ width: `${item.score}%` }}
                aria-hidden="true"
              />
            </div>
          </div>
        ))}
      </div>
    </ResultCard>
  );
}

function ResultsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resetting, setResetting] = useState(false);
  const [reloadCounter, setReloadCounter] = useState(0);
  const sessionId = useMemo(() => localStorage.getItem(SESSION_STORAGE_KEY), []);

  const showRequestError = useCallback(
    (requestError, fallbackMessage) => {
      const message = getApiErrorMessage(requestError, fallbackMessage);
      setError(message);
      toast({
        title: "Unable to load results.",
        description: message,
      });
    },
    [toast]
  );

  const loadResults = useCallback(async () => {
    if (!sessionId) {
      navigate("/", { replace: true });
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await getAssessmentResults(sessionId);
      setResults(data.results);
    } catch (requestError) {
      if (requestError?.response?.status === 400) {
        navigate("/assessment");
        return;
      }

      showRequestError(requestError, "Unable to load your results.");
    } finally {
      setLoading(false);
    }
  }, [navigate, sessionId, showRequestError]);

  useEffect(() => {
    loadResults();
  }, [loadResults, reloadCounter]);

  function handleSaveReport() {
    if (!results) {
      return;
    }

    const blob = new Blob([JSON.stringify(results, null, 2)], {
      type: "application/json",
    });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `psychometric-report-${formatDateFileStamp()}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(downloadUrl);
  }

  async function handleStartNewAssessment() {
    setResetting(true);
    setError("");

    try {
      const data = await createSession();
      localStorage.setItem(SESSION_STORAGE_KEY, data.sessionId);
      navigate("/assessment");
    } catch (requestError) {
      const message = getApiErrorMessage(requestError, "Unable to start a new assessment.");
      setError(message);
      toast({
        title: "A new session could not be started.",
        description: message,
      });
    } finally {
      setResetting(false);
    }
  }

  const topCareer = results?.topCareerMatches?.[0];
  const topStrength = results?.topStrengths?.[0];
  const topValue = results?.coreValues?.[0];
  const generatedLabel = results?.generatedAt
    ? new Date(results.generatedAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })
    : "Ready now";
  const breakdownSections = results
    ? [
        {
          title: "Interest profile",
          subtitle: "Which work environments energize you most.",
          items: results.charts?.interestRadar || [],
        },
        {
          title: "Personality profile",
          subtitle: "How you operate and collaborate under pressure.",
          items: results.charts?.personalityBars || [],
        },
        {
          title: "Top strengths",
          subtitle: "Capabilities you should lean on in role selection.",
          items: results.topStrengths || [],
        },
        {
          title: "Core values",
          subtitle: "Motivators that keep a role sustainable for you.",
          items: results.coreValues || [],
        },
      ]
    : [];

  if (loading) {
    return (
      <Container className="py-10 sm:py-12">
        <ResultsSkeleton />
      </Container>
    );
  }

  return (
    <Container className="space-y-6 py-6 sm:space-y-8 sm:py-8">
      <ResultHeader />

      {error ? <ErrorBanner message={error} onRetry={() => setReloadCounter((count) => count + 1)} /> : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={Briefcase}
          title="Top match"
          value={topCareer?.title || "No match yet"}
          description={
            topCareer
              ? `${topCareer.matchScore}% alignment with your strongest signal set.`
              : "Complete the full assessment to unlock career matches."
          }
          toneClass="bg-brand-100 text-brand-700"
        />
        <SummaryCard
          icon={Award}
          title="Strongest skill"
          value={topStrength?.trait || "Not available"}
          description={
            topStrength
              ? `${topStrength.score}% score in your highest-ranked strength trait.`
              : "Your strengths summary will appear here."
          }
          toneClass="bg-amber-100 text-amber-700"
        />
        <SummaryCard
          icon={Scale}
          title="Core driver"
          value={topValue?.trait || "Not available"}
          description={
            topValue
              ? `${topValue.score}% alignment with your strongest work value.`
              : "Your work-value summary will appear here."
          }
          toneClass="bg-slate-100 text-slate-700"
        />
        <SummaryCard
          icon={Gauge}
          title="Generated"
          value={generatedLabel}
          description="This report is ready for review on mobile and desktop."
          toneClass="bg-emerald-100 text-emerald-700"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        {breakdownSections.map((section) => (
          <ScoreBreakdownCard
            key={section.title}
            title={section.title}
            subtitle={section.subtitle}
            items={section.items}
          />
        ))}
      </section>

      {topCareer ? (
        <section className="dark-banner-pattern rounded-[32px] p-6 text-white shadow-card sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85">
                <Sparkles size={14} strokeWidth={2} />
                Best-fit recommendation
              </span>
              <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">{topCareer.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-200 sm:text-base">{topCareer.description}</p>
            </div>

            <div className="rounded-3xl bg-white/10 px-5 py-4">
              <p className="text-4xl font-semibold">{topCareer.matchScore}%</p>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/70">Overall match</p>
            </div>
          </div>

          <div className="mt-5">
            <InsightText>
              Your report is strongest where your top interests, strengths, and work values overlap with this role.
            </InsightText>
          </div>
        </section>
      ) : null}

      <section className="space-y-4">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Recommended careers</h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-500">
              Ranked roles that best align with your full psychometric profile.
            </p>
          </div>
          <span className="text-sm font-semibold text-slate-500">
            {results?.topCareerMatches?.length || 0} roles ranked
          </span>
        </header>

        <div className="space-y-3">
          {results?.topCareerMatches?.map((career, index) => (
            <CareerMatchCard key={career.title} career={career} highlight={index === 0} />
          ))}
        </div>
      </section>

      <section className="pb-4 sm:pb-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
          <Button
            variant="outline"
            size="lg"
            className="h-12 w-full sm:w-auto"
            disabled={!results}
            onClick={handleSaveReport}
          >
            <span className="inline-flex items-center gap-2 leading-none">
              <Download size={16} strokeWidth={2} className="leading-none text-slate-500" />
              <span className="leading-none">Save Report</span>
            </span>
          </Button>
          <Button size="lg" loading={resetting} className="h-12 w-full sm:w-auto" onClick={handleStartNewAssessment}>
            <span className="inline-flex items-center gap-2 leading-none">
              <RefreshCcw size={16} strokeWidth={2} />
              <span className="leading-none">Start New Assessment</span>
            </span>
          </Button>
        </div>
      </section>
    </Container>
  );
}

export default ResultsPage;
