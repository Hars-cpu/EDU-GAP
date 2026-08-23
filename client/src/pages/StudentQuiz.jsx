import { useEffect, useMemo, useState,useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  FiArrowLeft,
  FiArrowRight,
  FiBookOpen,
  FiCheckCircle,
  FiX,
  FiLoader,
} from "react-icons/fi";
import { serverurl } from "../main.jsx";

const createQuizApi = async () => {
  const response = await axios.post(
    `${serverurl}/api/quiz`,
    {},
    { withCredentials: true }
  );
  return response.data;
};

const getQuizByIdApi = async (quizId) => {
  const response = await axios.get(`${serverurl}/api/quiz/${quizId}`, {
    withCredentials: true,
  });
  return response.data;
};

const submitAnswerApi = async ({ quizId, questionIndex, answer }) => {
  const response = await axios.post(
    `${serverurl}/api/quiz/${quizId}/question/${questionIndex}/answer`,
    { answer },
    { withCredentials: true }
  );
  return response.data;
};

const completeQuizApi = async (quizId) => {
  const response = await axios.post(
    `${serverurl}/api/quiz/${quizId}/complete`,
    {},
    { withCredentials: true }
  );
  return response.data;
};

const getInitialIndex = (quizData) => {
  const total = quizData?.questions?.length || 0;
  if (!total) return 0;
  const raw = Number(quizData?.currentQuestionIndex ?? 0);
  if (!Number.isInteger(raw)) return 0;
  return Math.max(0, Math.min(raw, total - 1));
};

const StudentQuiz = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
   const quizCreationStarted = useRef(false);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [showCompletePopup, setShowCompletePopup] = useState(false);
  const [result, setResult] = useState(null);

  const hydrateQuestionState = (quizData, index) => {
    const question = quizData?.questions?.[index];
    setSelectedAnswer(question?.selectedAnswer || null);
    setSubmitted(Boolean(question?.selectedAnswer));
  };

 useEffect(() => {
  const loadQuiz = async () => {
    // Prevent duplicate API call
   

    setLoading(true);
    setError("");

    try {
      // =========================
      // CREATE QUIZ
      // =========================
      if (!quizId) {
         if (quizCreationStarted.current) {
          return;
        }

        quizCreationStarted.current = true;
        
        const createResponse = await createQuizApi();

        const newQuizId = createResponse?.quiz?._id;

        if (!newQuizId) {
          throw new Error("Quiz id missing in create response");
        }

        // Move to /student/quiz/:id
        navigate(`/student/quiz/${newQuizId}`, {
          replace: true,
        });

        return;
      }

      // =========================
      // GET EXISTING QUIZ
      // =========================
      const response = await getQuizByIdApi(quizId);

      const fetchedQuiz = response.quiz;

      const initialIndex = getInitialIndex(fetchedQuiz);

      setQuiz(fetchedQuiz);
      setCurrentQuestionIndex(initialIndex);

      hydrateQuestionState(
        fetchedQuiz,
        initialIndex
      );

    } catch (err) {
      console.error("Start Quiz Error:", err);

      setError(
        err?.response?.data?.message ||
        "Failed to start quiz"
      );

      // Allow retry if API actually failed
      quizCreationStarted.current = false;

    } finally {
      setLoading(false);
    }
  };

  loadQuiz();

}, [quizId, navigate]);

  const questions = quiz?.questions || [];
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = totalQuestions > 0 && currentQuestionIndex === totalQuestions - 1;

  const progressPercent = useMemo(() => {
    if (!totalQuestions) return 0;
    return Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);
  }, [currentQuestionIndex, totalQuestions]);

  const handleSelectAnswer = (answer) => {
    if (submitted || quiz?.status === "completed") return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || submitting || submitted || !quizId) return;

    try {
      setSubmitting(true);
      setError("");

      const response = await submitAnswerApi({
        quizId,
        questionIndex: currentQuestionIndex,
        answer: selectedAnswer,
      });

      const updatedQuiz = response?.quiz;
      if (updatedQuiz) {
        setQuiz(updatedQuiz);
      } else {
        setQuiz((previous) => {
          if (!previous) return previous;
          const updatedQuestions = [...previous.questions];
          updatedQuestions[currentQuestionIndex] = {
            ...updatedQuestions[currentQuestionIndex],
            selectedAnswer,
          };
          return { ...previous, questions: updatedQuestions };
        });
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Submit Answer Error:", err);
      setError(err?.response?.data?.message || "Failed to submit answer");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex === 0) return;
    const previousIndex = currentQuestionIndex - 1;
    setCurrentQuestionIndex(previousIndex);
    hydrateQuestionState(quiz, previousIndex);
  };

  const handleNext = async () => {
    if (!submitted && quiz?.status !== "completed") return;

    if (isLastQuestion) {
      await handleCompleteQuiz();
      return;
    }

    const nextIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIndex);
    hydrateQuestionState(quiz, nextIndex);
  };

  const handleCompleteQuiz = async () => {
    if (completing || !quizId) return;

    try {
      setCompleting(true);
      setError("");

      const response = await completeQuizApi(quizId);
      setResult(response.result);
      setQuiz((previous) =>
        previous
          ? {
              ...previous,
              status: "completed",
              score: response?.result?.score ?? previous.score,
            }
          : previous
      );
      setShowCompletePopup(true);
    } catch (err) {
      console.error("Complete Quiz Error:", err);
      setError(err?.response?.data?.message || "Failed to complete quiz");
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5faf8]">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <FiLoader size={35} className="text-[#008f68]" />
          </motion.div>
          <p className="text-sm font-medium text-gray-500">Preparing your quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5faf8] px-6">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-lg">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
            <FiX size={25} />
          </div>
          <h2 className="mt-5 text-xl font-bold text-gray-900">Something went wrong</h2>
          <p className="mt-2 text-sm text-gray-500">{error}</p>
          <button
            onClick={() => navigate("/student")}
            className="mt-6 rounded-xl bg-[#008f68] px-6 py-3 text-sm font-semibold text-white hover:bg-[#007a59]"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5faf8]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#008f68]/10 blur-3xl" />
        <div className="absolute -left-40 top-1/2 h-96 w-96 rounded-full bg-[#00a878]/10 blur-3xl" />
      </div>

      <nav className="relative z-10 flex items-center justify-between border-b border-[#008f68]/10 bg-white/80 px-6 py-4 backdrop-blur-md md:px-12">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#008f68] text-white">
            <FiBookOpen size={21} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#075c47]">EDU-GAP</h1>
            <p className="text-xs text-gray-500">AI Generated Quiz</p>
          </div>
        </div>

        <div className="rounded-xl bg-[#008f68]/10 px-4 py-2 text-sm font-semibold text-[#008f68]">
          {totalQuestions ? currentQuestionIndex + 1 : 0} / {totalQuestions}
        </div>
      </nav>

      <main className="relative z-10 mx-auto max-w-4xl px-6 py-10">
        <button
          onClick={() => navigate("/student")}
          className="mb-8 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#008f68]"
        >
          <FiArrowLeft />
          Dashboard
        </button>

        <div className="mb-8">
          <div className="mb-2 flex justify-between text-sm text-gray-500">
            <span>Quiz Progress</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <motion.div
              animate={{ width: `${progressPercent}%` }}
              className="h-full rounded-full bg-[#008f68]"
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion?._id || "empty-question"}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="rounded-3xl border border-[#008f68]/10 bg-white p-6 shadow-sm md:p-10"
          >
            <span className="inline-flex rounded-lg bg-[#008f68]/10 px-3 py-1.5 text-xs font-bold text-[#008f68]">
              QUESTION {currentQuestionIndex + 1}
            </span>

            <h2 className="mt-6 text-2xl font-bold leading-relaxed text-gray-900 md:text-3xl">
              {currentQuestion?.questionText}
            </h2>

            <div className="mt-8 space-y-4">
              {currentQuestion?.options?.map((option, index) => {
                const letter = String.fromCharCode(65 + index);
                const isSelected = selectedAnswer === option;

                return (
                  <motion.button
                    key={option}
                    whileHover={!submitted ? { x: 3 } : {}}
                    whileTap={!submitted ? { scale: 0.99 } : {}}
                    disabled={submitted || quiz?.status === "completed"}
                    onClick={() => handleSelectAnswer(option)}
                    className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                      isSelected
                        ? "border-[#008f68] bg-[#008f68]/10"
                        : "border-gray-200 hover:border-[#008f68]/40"
                    } ${
                      submitted || quiz?.status === "completed"
                        ? "cursor-default"
                        : "cursor-pointer"
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                        isSelected ? "bg-[#008f68] text-white" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="flex-1 font-medium text-gray-800">{option}</span>
                  </motion.button>
                );
              })}
            </div>

            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex items-center gap-2 rounded-xl bg-green-50 p-4 text-sm font-medium text-green-700"
              >
                <FiCheckCircle />
                Answer submitted successfully.
              </motion.div>
            )}

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FiArrowLeft />
                Previous
              </button>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer || submitted || submitting || quiz?.status === "completed"}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#008f68] px-6 py-3 text-sm font-semibold text-white hover:bg-[#007a59] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {submitting ? (
                    <>
                      <FiLoader className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FiCheckCircle />
                      Submit Answer
                    </>
                  )}
                </button>

                <button
                  onClick={handleNext}
                  disabled={(!submitted && quiz?.status !== "completed") || completing}
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#008f68]/20 bg-[#008f68]/5 px-6 py-3 text-sm font-semibold text-[#008f68] hover:bg-[#008f68]/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {completing ? (
                    <>
                      <FiLoader className="animate-spin" />
                      Completing...
                    </>
                  ) : (
                    <>
                      {isLastQuestion ? "Complete Quiz" : "Next Question"}
                      <FiArrowRight />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {showCompletePopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl"
            >
              <button
                onClick={() => setShowCompletePopup(false)}
                className="absolute right-4 top-4 rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <FiX />
              </button>

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#008f68]/10 text-[#008f68]">
                <FiCheckCircle size={32} />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-gray-900">Quiz Completed!</h2>
              <p className="mt-2 text-gray-500">You have completed all the questions.</p>

              <div className="mt-6 rounded-2xl bg-[#f5faf8] p-6">
                <p className="text-sm text-gray-500">Your Score</p>
                <p className="mt-1 text-4xl font-bold text-[#008f68]">
                  {result?.score} / {result?.totalQuestions}
                </p>
              </div>

              <button
                onClick={() => navigate("/student")}
                className="mt-6 w-full rounded-xl bg-[#008f68] px-6 py-3 text-sm font-semibold text-white hover:bg-[#007a59]"
              >
                Go to Dashboard
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentQuiz;
