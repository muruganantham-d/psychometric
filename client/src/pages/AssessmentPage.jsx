import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, BadgeCheck, ClipboardList, Command } from "lucide-react";
import {
  completeAssessment,
  createSession,
  getQuestions,
  getSession,
  submitStepAnswers,
  updateSessionStep,
} from "../api/assessmentApi";
import AssessmentSkeleton from "../components/AssessmentSkeleton";
import ErrorBanner from "../components/ErrorBanner";
import QuestionCard from "../components/QuestionCard";
import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import ProgressBar from "../components/ui/ProgressBar";
import { useToast } from "../components/ui/ToastProvider";
import { SESSION_STORAGE_KEY, TOTAL_STEPS } from "../utils/constants";
import { getApiErrorMessage } from "../utils/errors";
import { stepSubmissionSchema } from "../validation/assessmentSchemas";

function AssessmentPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sessionId, setSessionId] = useState(() => localStorage.getItem(SESSION_STORAGE_KEY));
  const [currentStep, setCurrentStep] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [allAnswers, setAllAnswers] = useState({});
  const [stepAnswers, setStepAnswers] = useState({});
  const [loadingSession, setLoadingSession] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [reloadCounter, setReloadCounter] = useState(0);

  const showRequestError = useCallback(
    (requestError, fallbackMessage) => {
      const message = getApiErrorMessage(requestError, fallbackMessage);
      setError(message);
      toast({
        title: "Request failed.",
        description: message,
      });
    },
    [toast]
  );

  const hydrateSession = useCallback(async () => {
    setLoadingSession(true);
    setError("");

    try {
      let activeSessionId = sessionId;
      let sessionData;

      if (!activeSessionId) {
        const newSession = await createSession();
        activeSessionId = newSession.sessionId;
        localStorage.setItem(SESSION_STORAGE_KEY, activeSessionId);
        setSessionId(activeSessionId);
      }

      try {
        sessionData = await getSession(activeSessionId);
      } catch (requestError) {
        if (requestError?.response?.status !== 404) {
          throw requestError;
        }

        const newSession = await createSession();
        activeSessionId = newSession.sessionId;
        localStorage.setItem(SESSION_STORAGE_KEY, activeSessionId);
        setSessionId(activeSessionId);
        sessionData = await getSession(activeSessionId);
      }

      const mappedAnswers = sessionData.answers.reduce((acc, answer) => {
        acc[answer.questionId] = answer.value;
        return acc;
      }, {});

      setAllAnswers(mappedAnswers);
      setCurrentStep(Math.max(1, Math.min(TOTAL_STEPS, sessionData.currentStep || 1)));
    } catch (requestError) {
      showRequestError(requestError, "Unable to load your session.");
    } finally {
      setLoadingSession(false);
    }
  }, [sessionId, showRequestError]);

  useEffect(() => {
    hydrateSession();
  }, [hydrateSession, reloadCounter]);

  useEffect(() => {
    if (!sessionId || loadingSession) {
      return;
    }

    let cancelled = false;

    async function loadQuestions() {
      setLoadingQuestions(true);
      setError("");

      try {
        const data = await getQuestions(currentStep);
        if (!cancelled) {
          setQuestions(data.questions);
        }
      } catch (requestError) {
        if (!cancelled) {
          showRequestError(requestError, "Unable to load questions for this step.");
        }
      } finally {
        if (!cancelled) {
          setLoadingQuestions(false);
        }
      }
    }

    loadQuestions();

    return () => {
      cancelled = true;
    };
  }, [sessionId, currentStep, loadingSession, showRequestError]);

  useEffect(() => {
    const nextStepAnswers = questions.reduce((acc, question) => {
      const answerValue = allAnswers[question._id];
      if (answerValue) {
        acc[question._id] = answerValue;
      }
      return acc;
    }, {});

    setStepAnswers(nextStepAnswers);
  }, [questions, allAnswers]);

  const allQuestionsAnswered = useMemo(
    () => questions.length > 0 && questions.every((question) => Number.isInteger(stepAnswers[question._id])),
    [questions, stepAnswers]
  );

  const answeredCount = useMemo(
    () => questions.filter((question) => Number.isInteger(stepAnswers[question._id])).length,
    [questions, stepAnswers]
  );

  function handleAnswerSelect(questionId, value) {
    setStepAnswers((previous) => ({
      ...previous,
      [questionId]: value,
    }));
  }

  const handlePreviousStep = useCallback(async () => {
    if (!sessionId || currentStep <= 1 || saving) {
      return;
    }

    const previousStep = currentStep - 1;
    setSaving(true);
    setError("");

    try {
      await updateSessionStep(sessionId, { currentStep: previousStep });
      setCurrentStep(previousStep);
    } catch (requestError) {
      showRequestError(requestError, "Unable to move to the previous step.");
    } finally {
      setSaving(false);
    }
  }, [currentStep, saving, sessionId, showRequestError]);

  const handleNextStep = useCallback(async () => {
    if (!sessionId || saving || loadingQuestions) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = stepSubmissionSchema.parse({
        stepNumber: currentStep,
        answers: questions.map((question) => ({
          questionId: question._id,
          value: stepAnswers[question._id],
        })),
      });

      await submitStepAnswers(sessionId, payload);

      setAllAnswers((previous) => ({
        ...previous,
        ...Object.fromEntries(payload.answers.map((answer) => [answer.questionId, answer.value])),
      }));

      if (currentStep === TOTAL_STEPS) {
        await completeAssessment(sessionId);
        navigate("/results");
        return;
      }

      const nextStep = currentStep + 1;
      await updateSessionStep(sessionId, { currentStep: nextStep });
      setCurrentStep(nextStep);
    } catch (requestError) {
      showRequestError(requestError, "Unable to save this step.");
    } finally {
      setSaving(false);
    }
  }, [
    currentStep,
    loadingQuestions,
    navigate,
    questions,
    saving,
    sessionId,
    showRequestError,
    stepAnswers,
  ]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.defaultPrevented) {
        return;
      }

      const target = event.target;
      const tagName = target?.tagName;
      const isTyping =
        target?.isContentEditable ||
        tagName === "INPUT" ||
        tagName === "TEXTAREA" ||
        tagName === "SELECT";

      if (isTyping) {
        return;
      }

      if (event.key === "ArrowLeft" && currentStep > 1 && !saving && !loadingQuestions) {
        event.preventDefault();
        void handlePreviousStep();
      }

      if (
        event.key === "ArrowRight" &&
        allQuestionsAnswered &&
        !saving &&
        !loadingQuestions &&
        !loadingSession
      ) {
        event.preventDefault();
        void handleNextStep();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    allQuestionsAnswered,
    currentStep,
    handleNextStep,
    handlePreviousStep,
    loadingQuestions,
    loadingSession,
    saving,
  ]);

  return (
    <>
      <Container className="max-w-[960px] py-6 pb-36 sm:py-8 sm:pb-40 md:pb-10">
        <div className="space-y-6">
          <header className="rounded-[32px] border border-white/70 bg-white/85 p-5 shadow-card backdrop-blur-sm sm:p-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0">
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                  <ClipboardList size={14} strokeWidth={2} className="text-brand-600" />
                  Assessment flow
                </span>
                <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">Stay in one focused flow.</h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
                  Each step is optimized for touch and keyboard input, so you can move quickly without losing context.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:max-w-sm">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Answered</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{answeredCount}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Remaining</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">
                    {Math.max(questions.length - answeredCount, 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <ProgressBar currentStep={currentStep} />
            </div>

            <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium text-slate-500">
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2">
                <Command size={14} strokeWidth={2} className="text-brand-600" />
                Left and right arrows move between steps
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2">
                <BadgeCheck size={14} strokeWidth={2} className="text-brand-600" />
                Arrow keys inside a question change the selected response
              </span>
            </div>
          </header>

          {error ? <ErrorBanner message={error} onRetry={() => setReloadCounter((count) => count + 1)} /> : null}

          {loadingSession || loadingQuestions ? (
            <AssessmentSkeleton />
          ) : (
            <section className="space-y-4">
              {questions.map((question, index) => (
                <QuestionCard
                  key={question._id}
                  question={question}
                  number={(currentStep - 1) * 5 + index + 1}
                  value={stepAnswers[question._id]}
                  disabled={saving}
                  onChange={(value) => handleAnswerSelect(question._id, value)}
                />
              ))}
            </section>
          )}
        </div>
      </Container>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/70 bg-[#f8f6ef]/95 backdrop-blur-xl md:static md:border-t-0 md:bg-transparent md:backdrop-blur-0">
        <Container className="max-w-[960px] py-3 md:py-0">
          <div className="rounded-[28px] border border-white/80 bg-white/92 p-3 shadow-card md:mt-2 md:p-4">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="lg"
                className="h-14 w-full"
                disabled={currentStep === 1 || loadingQuestions || saving}
                onClick={handlePreviousStep}
              >
                <ArrowLeft size={18} strokeWidth={2} />
                Previous
              </Button>

              <Button
                size="lg"
                className="h-14 w-full"
                loading={saving}
                disabled={!allQuestionsAnswered || loadingQuestions || loadingSession}
                onClick={handleNextStep}
              >
                {currentStep === TOTAL_STEPS ? "See Results" : "Next Step"}
                <ArrowRight size={18} strokeWidth={2} />
              </Button>
            </div>

            <p className="mt-3 text-center text-xs leading-relaxed text-slate-500">
              Large tap targets on mobile. Keyboard shortcuts stay enabled on desktop.
            </p>
          </div>
        </Container>
      </div>
    </>
  );
}

export default AssessmentPage;
