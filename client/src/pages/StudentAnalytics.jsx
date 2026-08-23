import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FiAlertTriangle, FiArrowLeft, FiBookOpen, FiUser } from "react-icons/fi";
import { motion } from "framer-motion";
import { serverurl } from "../main.jsx";

const formatDate = (value) => {
  if (!value) return "Unknown date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStudent = (analytics) =>
  typeof analytics?.student === "object" ? analytics.student : {};

const StudentAnalytics = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(Boolean(studentId));
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchStudentAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `${serverurl}/api/analytics/teacher/student/${studentId}/analytics`,
          { withCredentials: true }
        );

        if (isMounted) {
          setAnalytics(response.data?.analytics || null);
        }
      } catch (apiError) {
        if (isMounted) {
          setError(
            apiError?.response?.data?.message ||
              "Failed to load student analytics"
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (studentId) fetchStudentAnalytics();

    return () => {
      isMounted = false;
    };
  }, [studentId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5faf8] text-[#008f68]">
        Loading analytics...
      </div>
    );
  }

  const displayError = error || (!studentId ? "Student not found" : "");

  if (displayError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f5faf8]">
        <p className="text-red-500">{displayError}</p>
        <button
          onClick={() => navigate("/teacher/analytics")}
          className="mt-4 rounded-xl bg-[#008f68] px-5 py-2 text-white"
        >
          Back to Students
        </button>
      </div>
    );
  }

  const student = getStudent(analytics);
  const recentQuizzes = Array.isArray(analytics?.recentQuizzes)
    ? analytics.recentQuizzes
    : [];
  const weakTopics = Array.isArray(analytics?.weakTopics)
    ? analytics.weakTopics
    : [];
  const summary = String(analytics?.overallProgressSummary || "").trim();

  return (
    <div className="min-h-screen bg-[#f5faf8]">
      <main className="mx-auto max-w-6xl px-6 py-8">
        <button
          onClick={() => navigate("/teacher/analytics")}
          className="mb-8 flex items-center gap-2 text-gray-500 hover:text-[#008f68]"
        >
          <FiArrowLeft />
          Back to Students
        </button>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-white p-7 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#008f68]/10 text-[#008f68]">
              <FiUser size={25} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {student.name || "Student"}
              </h1>
              <p className="text-sm text-gray-500">
                {student.username ? `@${student.username}` : "Student Progress"}
                {student.className ? ` · Class ${student.className}` : ""}
              </p>
            </div>
          </div>
        </motion.section>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">Progress Summary</h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              {summary || "No progress summary is available yet."}
            </p>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <FiAlertTriangle className="text-[#008f68]" />
              Weak Topics
            </h2>
            {weakTopics.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {weakTopics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full bg-[#008f68]/10 px-3 py-1.5 text-sm text-[#008f68]"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-gray-500">
                No weak topics have been identified yet.
              </p>
            )}
          </section>
        </div>

        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
            <FiBookOpen className="text-[#008f68]" />
            Recent Quizzes
          </h2>
          {recentQuizzes.length ? (
            <div className="mt-4 space-y-3">
              {recentQuizzes.map((quiz) => {
                const totalQuestions = Number(quiz?.totalQuestions || 0);
                const score = Number(quiz?.score || 0);
                const percentage = totalQuestions
                  ? Math.round((score / totalQuestions) * 100)
                  : 0;

                return (
                  <div
                    key={quiz?._id || `${quiz?.createdAt}-${score}`}
                    className="flex flex-col gap-2 rounded-xl border border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">
                        {quiz?.origin === "weak_topics"
                          ? "Weak Topics Practice Quiz"
                          : "Practice Quiz"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(quiz?.completedAt || quiz?.createdAt)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-[#008f68]">
                      {score}/{totalQuestions} ({percentage}%)
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="mt-3 text-sm text-gray-500">
              No quiz history yet.
            </p>
          )}
        </section>
      </main>
    </div>
  );
};

export default StudentAnalytics;
