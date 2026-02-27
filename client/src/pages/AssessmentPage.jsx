import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, ClipboardList } from "lucide-react";
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
import { SESSION_STORAGE_KEY, TOTAL_STEPS } from "../utils/constants";
import { getApiErrorMessage } from "../utils/errors";
import { stepSubmissionSchema } from "../validation/assessmentSchemas";

function AssessmentPage() {
  const navigate = useNavigate();
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
      setError(getApiErrorMessage(requestError, "Unable to load your session."));
    } finally {
      setLoadingSession(false);
    }
  }, [sessionId]);

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
          setError(getApiErrorMessage(requestError, "Unable to load questions for this step."));
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
  }, [sessionId, currentStep, loadingSession]);

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

  function handleAnswerSelect(questionId, value) {
    setStepAnswers((previous) => ({
      ...previous,
      [questionId]: value,
    }));
  }

  async function handlePreviousStep() {
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
      setError(getApiErrorMessage(requestError, "Unable to move to the previous step."));
    } finally {
      setSaving(false);
    }
  }

  async function handleNextStep() {
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
      setError(getApiErrorMessage(requestError, "Unable to save this step."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Container className="max-w-[860px] py-10 sm:py-12">
      <div className="space-y-6">
        <header className="space-y-4">
          <h1 className="flex items-center gap-3 text-4xl font-bold tracking-tight text-ink">
            <ClipboardList size={24} strokeWidth={2} className="text-brand-600" />
            Assessment in Progress
          </h1>
          <ProgressBar currentStep={currentStep} />
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

        <footer className="border-t border-line pt-6">
          <div className="flex items-center justify-between">
            <Button variant="ghost" disabled={currentStep === 1 || loadingQuestions || saving} onClick={handlePreviousStep}>
              <ArrowLeft size={16} strokeWidth={2} />
              Previous
            </Button>

            <Button
              loading={saving}
              disabled={!allQuestionsAnswered || loadingQuestions || loadingSession}
              onClick={handleNextStep}
            >
              {currentStep === TOTAL_STEPS ? "See Results" : "Next Step"}
              <ArrowRight size={16} strokeWidth={2} />
            </Button>
          </div>
        </footer>
      </div>
    </Container>
  );
}

export default AssessmentPage;
