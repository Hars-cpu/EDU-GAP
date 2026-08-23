import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FiArrowLeft,
  FiBarChart2,
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiTrash2,
  FiAlertTriangle,
  FiX,
  FiLoader,
} from "react-icons/fi";
import { serverurl } from "../main.jsx";

const formatCreatedAt = (value) => {
  if (!value) return "Unknown date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const buildQuizTitle = (quiz) => {
  if (quiz?.status === "completed") return "Completed Practice Quiz";
  if (quiz?.origin === "weak_topics") return "Weak Topics Practice Quiz";
  return "Chat Practice Quiz";
};

const buildQuizTopics = (quiz) => {
  const topics = Array.isArray(quiz?.weakTopics)
    ? quiz.weakTopics.filter((topic) => String(topic || "").trim().length > 0)
    : [];

  if (topics.length) return topics.slice(0, 4);
  return quiz?.origin === "weak_topics" ? ["Weak Topics"] : ["Chat"];
};

const mapQuizForCard = (quiz) => ({
  id: String(quiz?._id || ""),
  title: buildQuizTitle(quiz),
  topics: buildQuizTopics(quiz),
  totalQuestions: Number(quiz?.totalQuestions || 0),
  score: Number(quiz?.score || 0),
  status: quiz?.status === "completed" ? "completed" : "in_progress",
  createdAt: formatCreatedAt(quiz?.createdAt),
  createdAtRaw: quiz?.createdAt || null,
});

const buildQuizList = ({ completedQuizzes, inProgressQuizzes }) => {
  const byId = new Map();

  [...inProgressQuizzes, ...completedQuizzes].forEach((quiz) => {
    if (!quiz?._id) return;
    byId.set(String(quiz._id), mapQuizForCard(quiz));
  });

  return [...byId.values()].sort((a, b) => {
    const aTime = new Date(a.createdAtRaw || 0).getTime();
    const bTime = new Date(b.createdAtRaw || 0).getTime();
    return bTime - aTime;
  });
};

const StudentProgress = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all");
  const [deleteQuiz, setDeleteQuiz] = useState(null);
  const [deletingQuizId, setDeletingQuizId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [overallProgressSummary, setOverallProgressSummary] = useState("");
  const [weakTopics, setWeakTopics] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  const backPath = user?.role === "teacher" ? "/teacher" : "/student";
  const backLabel = user?.role === "teacher" ? "Teacher Dashboard" : "Student Dashboard";

  const applyProgressData = useCallback(
    (analyticsPayload, inProgressPayload) => {
      const analytics = analyticsPayload?.analytics || {};
      const completedQuizzes = Array.isArray(analytics.recentQuizzes) ? analytics.recentQuizzes : [];
      const inProgressQuizzes = Array.isArray(inProgressPayload?.quizzes)
        ? inProgressPayload.quizzes
        : [];

      setStudentName(user?.name || "Student");
      setOverallProgressSummary(String(analytics.overallProgressSummary || "").trim());
      setWeakTopics(Array.isArray(analytics.weakTopics) ? analytics.weakTopics : []);
      setQuizzes(buildQuizList({ completedQuizzes, inProgressQuizzes }));
    },
    [user]
  );

  const fetchProgressData = useCallback(async () => {
    const [analyticsResponse, inProgressResponse] = await Promise.all([
      axios.get(`${serverurl}/api/analytics`, { withCredentials: true }),
      axios.get(`${serverurl}/api/analytics/quizzes`, { withCredentials: true }),
    ]);

    return {
      analyticsPayload: analyticsResponse?.data || {},
      inProgressPayload: inProgressResponse?.data || {},
    };
  }, []);

  const refreshProgressData = useCallback(
    async ({ silent = false } = {}) => {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const { analyticsPayload, inProgressPayload } = await fetchProgressData();
        setError("");
        applyProgressData(analyticsPayload, inProgressPayload);
      } catch (apiError) {
        console.error("Load Student Progress Error:", apiError);
        setError(apiError?.response?.data?.message || "Failed to load student progress");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [applyProgressData, fetchProgressData]
  );

  useEffect(() => {
    let isMounted = true;

    const loadInitialProgress = async () => {
      try {
        const { analyticsPayload, inProgressPayload } = await fetchProgressData();
        if (!isMounted) return;
        setError("");
        applyProgressData(analyticsPayload, inProgressPayload);
      } catch (apiError) {
        if (!isMounted) return;
        console.error("Load Student Progress Error:", apiError);
        setError(apiError?.response?.data?.message || "Failed to load student progress");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadInitialProgress();

    return () => {
      isMounted = false;
    };
  }, [applyProgressData, fetchProgressData]);

  const filteredQuizzes = useMemo(
    () =>
      quizzes.filter((quiz) => {
        if (filter === "all") return true;
        return quiz.status === filter;
      }),
    [filter, quizzes]
  );

  const handleContinueQuiz = (quizId) => {
    navigate(`/student/quiz/${quizId}`);
  };

  const handleDeleteQuiz = async () => {
    if (!deleteQuiz || deletingQuizId) return;

    const previousQuizzes = quizzes;
    const previousSummary = overallProgressSummary;
    const previousWeakTopics = weakTopics;
    const targetQuizId = deleteQuiz.id;

    setDeletingQuizId(targetQuizId);
    setDeleteQuiz(null);
    setQuizzes((previous) => previous.filter((quiz) => quiz.id !== targetQuizId));

    try {
      await axios.delete(`${serverurl}/api/quiz/${targetQuizId}`, {
        withCredentials: true,
      });

      toast.success("Quiz deleted successfully");
      await refreshProgressData({ silent: true });
    } catch (apiError) {
      console.error("Delete Quiz Error:", apiError);
      setQuizzes(previousQuizzes);
      setOverallProgressSummary(previousSummary);
      setWeakTopics(previousWeakTopics);
      toast.error(apiError?.response?.data?.message || "Failed to delete quiz");
    } finally {
      setDeletingQuizId("");
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
          <p className="text-sm font-medium text-gray-500">Loading student progress...</p>
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
          <h2 className="mt-5 text-xl font-bold text-gray-900">Unable to load analytics</h2>
          <p className="mt-2 text-sm text-gray-500">{error}</p>
          <button
            onClick={() => refreshProgressData()}
            className="mt-6 rounded-xl bg-[#008f68] px-6 py-3 text-sm font-semibold text-white hover:bg-[#007a59]"
          >
            Retry
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

      <nav className="relative z-10 flex items-center justify-between border-b border-[#008f68]/10 bg-white/80 px-6 py-5 backdrop-blur-md md:px-12">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#008f68] text-white shadow-lg">
            <FiBookOpen size={21} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#075c47]">EDU-GAP</h1>
            <p className="text-xs text-gray-500">Student Progress</p>
          </div>
        </div>
      </nav>

      <main className="relative z-10 mx-auto max-w-6xl px-6 py-10 md:px-12">
        <button
          onClick={() => navigate(backPath)}
          className="mb-8 flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#008f68]"
        >
          <FiArrowLeft size={17} />
          {backLabel}
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#008f68]/10 px-4 py-2 text-sm font-medium text-[#008f68]">
            <FiBarChart2 size={16} />
            Student Analytics
          </div>

          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">{studentName}</h2>
          <p className="mt-2 text-gray-500">Quiz performance and learning progress</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 rounded-3xl border border-[#008f68]/10 bg-white p-6 shadow-sm md:p-8"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#008f68]/10 text-[#008f68]">
              <FiBarChart2 size={23} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Overall Progress Summary</h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                {overallProgressSummary || "Complete quizzes to generate your personalized summary."}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10 rounded-3xl border border-orange-100 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
              <FiAlertTriangle size={21} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Weak Topics</h3>
              <p className="text-xs text-gray-500">Topics where the student needs more practice</p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            {weakTopics.length ? (
              weakTopics.map((topic) => (
                <span
                  key={topic}
                  className="rounded-xl bg-orange-50 px-4 py-2 text-sm font-medium text-orange-600"
                >
                  {topic}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-400">No weak topics yet.</span>
            )}
          </div>
        </motion.div>

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Quizzes</h3>
            <p className="mt-1 text-sm text-gray-500">View all quizzes taken by the student</p>
          </div>

          <div className="flex w-fit rounded-xl bg-white p-1 shadow-sm">
            {[
              { label: "All", value: "all" },
              { label: "Completed", value: "completed" },
              { label: "In Progress", value: "in_progress" },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setFilter(item.value)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  filter === item.value
                    ? "bg-[#008f68] text-white"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {refreshing && (
          <p className="mb-4 text-xs font-medium text-gray-400">Refreshing analytics...</p>
        )}

        <div className="space-y-4">
          <AnimatePresence>
            {filteredQuizzes.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-3xl border border-dashed border-gray-200 bg-white p-10 text-center"
              >
                <FiBookOpen size={35} className="mx-auto text-gray-300" />
                <p className="mt-4 text-sm text-gray-500">No quizzes found.</p>
              </motion.div>
            ) : (
              filteredQuizzes.map((quiz) => (
                <motion.div
                  key={quiz.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                          quiz.status === "completed"
                            ? "bg-green-50 text-green-500"
                            : "bg-blue-50 text-blue-500"
                        }`}
                      >
                        {quiz.status === "completed" ? <FiCheckCircle size={22} /> : <FiClock size={22} />}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-gray-900">{quiz.title}</h4>
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                              quiz.status === "completed"
                                ? "bg-green-50 text-green-600"
                                : "bg-blue-50 text-blue-600"
                            }`}
                          >
                            {quiz.status === "completed" ? "Completed" : "In Progress"}
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-gray-400">Created {quiz.createdAt}</p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {quiz.topics.map((topic) => (
                            <span
                              key={`${quiz.id}-${topic}`}
                              className="rounded-lg bg-gray-50 px-2.5 py-1 text-xs text-gray-500"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {quiz.status === "completed" && (
                        <div className="mr-2 text-right">
                          <p className="text-xs text-gray-400">Score</p>
                          <p className="font-bold text-[#008f68]">
                            {quiz.score}/{quiz.totalQuestions}
                          </p>
                        </div>
                      )}

                      <button
                        disabled={quiz.status === "completed"}
                        onClick={() => quiz.status !== "completed" && handleContinueQuiz(quiz.id)}
                        className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                          quiz.status === "completed"
                            ? "cursor-not-allowed bg-gray-100 text-gray-400"
                            : "bg-[#008f68] text-white hover:bg-[#007a59]"
                        }`}
                      >
                        {quiz.status === "completed" ? "Completed" : "Continue Quiz"}
                      </button>

                      <button
                        disabled={deletingQuizId === quiz.id}
                        onClick={() => setDeleteQuiz(quiz)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-red-400 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                        title="Delete quiz"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {deleteQuiz && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl"
            >
              <button
                onClick={() => setDeleteQuiz(null)}
                className="absolute right-4 top-4 rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <FiX />
              </button>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
                <FiTrash2 size={21} />
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">Delete Quiz Attempt?</h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-700">{deleteQuiz.title}</span>? This action
                cannot be undone.
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setDeleteQuiz(null)}
                  className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDeleteQuiz}
                  className="rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentProgress;
