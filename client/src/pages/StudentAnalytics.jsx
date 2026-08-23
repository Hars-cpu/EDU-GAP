import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiArrowLeft,
  FiUser,
  FiBarChart2,
} from "react-icons/fi";
import { motion } from "framer-motion";

import SERVER_URL from "../main.jsx";

const StudentAnalytics = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [analytics, setAnalytics] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchStudentAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `${SERVER_URL}/api/teacher/student/${studentId}/analytics`,
          {
            withCredentials: true,
          }
        );

        setAnalytics(
          response.data.analytics
        );
      } catch (error) {
        console.error(
          "Student analytics error:",
          error
        );

        setError(
          error?.response?.data?.message ||
            "Failed to load student analytics"
        );
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchStudentAnalytics();
    }
  }, [studentId]);

  if (loading) {
    return (
      <div className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-[#f5faf8]
      ">
        <p className="text-[#008f68]">
          Loading analytics...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="
        min-h-screen
        flex
        flex-col
        items-center
        justify-center
        bg-[#f5faf8]
      ">
        <p className="text-red-500">
          {error}
        </p>

        <button
          onClick={() =>
            navigate("/teacher/analytics")
          }
          className="
            mt-4
            rounded-xl
            bg-[#008f68]
            px-5
            py-2
            text-white
          "
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="
      min-h-screen
      bg-[#f5faf8]
    ">

      <main className="
        mx-auto
        max-w-6xl
        px-6
        py-8
      ">

        {/* BACK */}

        <button
          onClick={() =>
            navigate("/teacher/analytics")
          }
          className="
            mb-8
            flex
            items-center
            gap-2
            text-gray-500
            hover:text-[#008f68]
          "
        >
          <FiArrowLeft />

          Back to Students
        </button>

        {/* HEADER */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
            rounded-3xl
            bg-white
            p-7
            shadow-sm
          "
        >

          <div className="
            flex
            items-center
            gap-4
          ">

            <div className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-[#008f68]/10
              text-[#008f68]
            ">
              <FiUser size={25} />
            </div>

            <div>

              <h1 className="
                text-2xl
                font-bold
                text-gray-900
              ">
                {analytics?.student?.name ||
                  "Student"}
              </h1>

              <p className="
                text-sm
                text-gray-500
              ">
                Student Progress
              </p>

            </div>

          </div>

        </motion.div>

        {/* ANALYTICS */}

        <div className="
          mt-6
          grid
          gap-5
          md:grid-cols-3
        ">

          <div className="
            rounded-2xl
            bg-white
            p-6
            shadow-sm
          ">
            <p className="
              text-sm
              text-gray-500
            ">
              Overall Progress
            </p>

            <h2 className="
              mt-2
              text-3xl
              font-bold
              text-[#008f68]
            ">
              {analytics?.overallProgress ?? 0}%
            </h2>
          </div>

          <div className="
            rounded-2xl
            bg-white
            p-6
            shadow-sm
          ">
            <p className="
              text-sm
              text-gray-500
            ">
              Quizzes Completed
            </p>

            <h2 className="
              mt-2
              text-3xl
              font-bold
              text-[#008f68]
            ">
              {analytics?.completedQuizzes ?? 0}
            </h2>
          </div>

          <div className="
            rounded-2xl
            bg-white
            p-6
            shadow-sm
          ">
            <p className="
              text-sm
              text-gray-500
            ">
              Weak Topics
            </p>

            <h2 className="
              mt-2
              text-3xl
              font-bold
              text-[#008f68]
            ">
              {analytics?.weakTopics?.length ?? 0}
            </h2>
          </div>

        </div>

      </main>

    </div>
  );
};

export default StudentAnalytics;