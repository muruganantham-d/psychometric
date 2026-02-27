import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Download } from "lucide-react";
import { createSession, getAssessmentResults } from "../api/assessmentApi";
import ErrorBanner from "../components/ErrorBanner";
import ResultsSkeleton from "../components/ResultsSkeleton";
import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import ResultHeader from "../components/results/ResultHeader";
import ResultCard from "../components/results/ResultCard";
import InsightText from "../components/results/InsightText";
import CareerMatchCard from "../components/results/CareerMatchCard";
import { SESSION_STORAGE_KEY } from "../utils/constants";
import { getApiErrorMessage } from "../utils/errors";
import { formatDateFileStamp } from "../utils/formatters";

const personalityColors = ["#8e8be7", "#7cc4a0", "#edc36d", "#ec8c58", "#5b9de4"];

function NumberedListCard({ number, title, items, tone = "brand" }) {
  const badgeTone = tone === "brand" ? "bg-brand-100 text-brand-600" : "bg-violet-100 text-violet-600";

  return (
    <ResultCard className="space-y-4">
      <div className="flex items-center gap-2">
        <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold ${badgeTone}`}>
          {number}
        </span>
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      </div>

      <ul className="space-y-1.5 text-sm text-slate-700">
        {items?.slice(0, 5).map((item) => (
          <li key={item.traitKey} className="flex items-center gap-2">
            <span className="inline-block h-1 w-1 rounded-full bg-brand-500" />
            <span>{item.trait}</span>
          </li>
        ))}
      </ul>
    </ResultCard>
  );
}

function PersonalityBars({ data }) {
  return (
    <div className="space-y-4 py-2">
      {data?.map((item, index) => (
        <div key={item.traitKey} className="grid grid-cols-[136px_1fr] items-center gap-3">
          <span className="text-[13px] font-medium text-slate-600">{item.trait}</span>
          <div className="h-[15px] rounded-md bg-slate-100">
            <div
              className="h-full rounded-md"
              style={{
                width: `${item.score}%`,
                backgroundColor: personalityColors[index % personalityColors.length],
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function ResultsPage() {
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resetting, setResetting] = useState(false);
  const [reloadCounter, setReloadCounter] = useState(0);
  const sessionId = useMemo(() => localStorage.getItem(SESSION_STORAGE_KEY), []);

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

      setError(getApiErrorMessage(requestError, "Unable to load your results."));
    } finally {
      setLoading(false);
    }
  }, [navigate, sessionId]);

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
      setError(getApiErrorMessage(requestError, "Unable to start a new assessment."));
    } finally {
      setResetting(false);
    }
  }

  if (loading) {
    return (
      <Container className="py-10 sm:py-12">
        <ResultsSkeleton />
      </Container>
    );
  }

  return (
    <Container className="space-y-8 py-10 sm:py-12">
      <ResultHeader />

      {error ? <ErrorBanner message={error} onRetry={() => setReloadCounter((count) => count + 1)} /> : null}

      <section className="grid items-stretch gap-6 lg:grid-cols-2">
        <ResultCard className="flex h-full min-h-[430px] flex-col space-y-4">
          <header className="space-y-1">
            <h2 className="text-base font-semibold text-slate-900">Interest Profile</h2>
            <p className="text-xs text-slate-500">Your vocational interests (RIASEC)</p>
          </header>

          <div className="h-[300px] flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={results?.charts?.interestRadar} outerRadius="74%" margin={{ top: 8, right: 18, bottom: 8, left: 18 }}>
                <PolarGrid stroke="#e8edf7" />
                <PolarAngleAxis dataKey="trait" tick={{ fill: "#475569", fontSize: 11 }} />
                <Tooltip formatter={(value) => [`${value}%`, "Score"]} />
                <Radar
                  dataKey="score"
                  fill="#6c63ff"
                  fillOpacity={0.25}
                  stroke="#6c63ff"
                  strokeWidth={2}
                  animationDuration={900}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <InsightText>Your highest scores indicate the type of work environments you naturally gravitate towards.</InsightText>
        </ResultCard>

        <ResultCard className="flex h-full min-h-[430px] flex-col space-y-4">
          <header className="space-y-1">
            <h2 className="text-base font-semibold text-slate-900">Personality Traits</h2>
            <p className="text-xs text-slate-500">Big Five personality dimensions</p>
          </header>

          <div className="flex-1">
            <PersonalityBars data={results?.charts?.personalityBars} />
          </div>

          <InsightText>These traits predict how you interact with others and handle workplace stress.</InsightText>
        </ResultCard>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <NumberedListCard number="1" title="Top Strengths" items={results?.topStrengths} tone="brand" />
        <NumberedListCard number="2" title="Core Values" items={results?.coreValues} tone="violet" />
      </section>

      <section className="space-y-4">
        <header>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-[40px]">Top Career Matches</h2>
          <p className="mt-1 text-sm text-slate-500">Jobs that align best with your unique profile</p>
        </header>

        <div className="space-y-3">
          {results?.topCareerMatches?.map((career, index) => (
            <CareerMatchCard key={career.title} career={career} highlight={index === 0} />
          ))}
        </div>
      </section>

      <section className="mt-10 pb-12">
        <div className="flex items-center justify-center gap-4">
          <div className="inline-flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-medium text-slate-900 shadow-none hover:bg-slate-50"
              onClick={handleSaveReport}
            >
              <span className="inline-flex items-center gap-2 leading-none">
                <Download size={16} strokeWidth={2} className="leading-none text-slate-500" />
                <span className="leading-none">Save Report</span>
              </span>
            </Button>
            <Button
              size="sm"
              loading={resetting}
              className="h-11 rounded-xl border border-transparent bg-[#6C63FF] px-5 text-sm font-medium text-white shadow-none hover:bg-[#5B54F6] focus-visible:ring-brand-200"
              onClick={handleStartNewAssessment}
            >
              <span className="leading-none">Start New Assessment</span>
            </Button>
          </div>
        </div>
      </section>
    </Container>
  );
}

export default ResultsPage;
