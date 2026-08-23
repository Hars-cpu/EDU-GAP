import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowLeft,
  FiBarChart2,
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiTrash2,
  FiAlertTriangle,
  FiX,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

/* =========================================================
   DUMMY DATA
   Later replace this with API data
========================================================= */

const dummyStudent = {
  name: "Rahul Kumar",

  overallProgressSummary:
    "The student is making steady progress in programming and web development. Quiz performance is good in basic concepts but some improvement is needed in data structures and asynchronous programming.",

  weakTopics: [
    "Data Structures",
    "Asynchronous JavaScript",
    "Recursion",
    "Database Concepts",
  ],

  quizzes: [
    {
      id: "quiz_001",
      title: "JavaScript Fundamentals",
      topics: [
        "JavaScript",
        "Programming",
      ],
      totalQuestions: 10,
      score: 8,
      status: "completed",
      createdAt: "20 Aug 2026",
    },

    {
      id: "quiz_002",
      title: "Data Structures Basics",
      topics: [
        "Arrays",
        "Stacks",
        "Queues",
      ],
      totalQuestions: 10,
      score: 5,
      status: "completed",
      createdAt: "21 Aug 2026",
    },

    {
      id: "quiz_003",
      title: "React Fundamentals",
      topics: [
        "React",
        "Components",
        "Hooks",
      ],
      totalQuestions: 10,
      score: 0,
      status: "in_progress",
      createdAt: "22 Aug 2026",
    },

    {
      id: "quiz_004",
      title: "Asynchronous JavaScript",
      topics: [
        "Promises",
        "Async/Await",
        "Event Loop",
      ],
      totalQuestions: 10,
      score: 0,
      status: "in_progress",
      createdAt: "23 Aug 2026",
    },

    {
      id: "quiz_005",
      title: "Database Fundamentals",
      topics: [
        "MongoDB",
        "SQL",
        "Database",
      ],
      totalQuestions: 10,
      score: 9,
      status: "completed",
      createdAt: "19 Aug 2026",
    },
  ],
};


/* =========================================================
   STUDENT PROGRESS
========================================================= */

const StudentProgress = () => {
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState(
    dummyStudent.quizzes
  );

  const [filter, setFilter] = useState("all");

  const [deleteQuiz, setDeleteQuiz] =
    useState(null);


  /* =======================================================
     FILTER QUIZZES
  ======================================================= */

  const filteredQuizzes = quizzes.filter(
    (quiz) => {
      if (filter === "all") {
        return true;
      }

      return quiz.status === filter;
    }
  );


  /* =======================================================
     DELETE QUIZ
  ======================================================= */

  const handleDeleteQuiz = () => {
    if (!deleteQuiz) return;

    setQuizzes((previousQuizzes) =>
      previousQuizzes.filter(
        (quiz) =>
          quiz.id !== deleteQuiz.id
      )
    );

    setDeleteQuiz(null);
  };


  /* =======================================================
     CONTINUE QUIZ
  ======================================================= */

  const handleContinueQuiz = (
    quizId
  ) => {
    navigate(
      `/student/quiz/${quizId}`
    );
  };


  return (
    <div className="min-h-screen bg-[#f5faf8]">

      {/* ===================================================
          BACKGROUND
      =================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="
          absolute
          -right-32
          -top-32
          h-96
          w-96
          rounded-full
          bg-[#008f68]/10
          blur-3xl
        " />

        <div className="
          absolute
          -left-40
          top-1/2
          h-96
          w-96
          rounded-full
          bg-[#00a878]/10
          blur-3xl
        " />

      </div>


      {/* ===================================================
          NAVBAR
      =================================================== */}

      <nav className="
        relative
        z-10
        flex
        items-center
        justify-between
        border-b
        border-[#008f68]/10
        bg-white/80
        px-6
        py-5
        backdrop-blur-md
        md:px-12
      ">

        <div className="
          flex
          items-center
          gap-3
        ">

          <div className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            bg-[#008f68]
            text-white
            shadow-lg
          ">
            <FiBookOpen size={21} />
          </div>

          <div>

            <h1 className="
              text-xl
              font-bold
              text-[#075c47]
            ">
              EDU-GAP
            </h1>

            <p className="
              text-xs
              text-gray-500
            ">
              Student Progress
            </p>

          </div>

        </div>

      </nav>


      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="
        relative
        z-10
        mx-auto
        max-w-6xl
        px-6
        py-10
        md:px-12
      ">

        {/* Back */}

        <button
          onClick={() =>
            navigate("/teacher")
          }
          className="
            mb-8
            flex
            items-center
            gap-2
            text-sm
            font-medium
            text-gray-500
            transition
            hover:text-[#008f68]
          "
        >
          <FiArrowLeft size={17} />

          Teacher Dashboard
        </button>


        {/* =================================================
            STUDENT HEADER
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-8"
        >

          <div className="
            flex
            flex-col
            gap-4
            md:flex-row
            md:items-center
            md:justify-between
          ">

            <div>

              <div className="
                mb-3
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-[#008f68]/10
                px-4
                py-2
                text-sm
                font-medium
                text-[#008f68]
              ">
                <FiBarChart2 size={16} />

                Student Analytics
              </div>

              <h2 className="
                text-3xl
                font-bold
                text-gray-900
                md:text-4xl
              ">
                {dummyStudent.name}
              </h2>

              <p className="
                mt-2
                text-gray-500
              ">
                Quiz performance and learning progress
              </p>

            </div>

          </div>

        </motion.div>


        {/* =================================================
            PROGRESS SUMMARY
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
          }}
          className="
            mb-8
            rounded-3xl
            border
            border-[#008f68]/10
            bg-white
            p-6
            shadow-sm
            md:p-8
          "
        >

          <div className="
            flex
            items-start
            gap-4
          ">

            <div className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-[#008f68]/10
              text-[#008f68]
            ">
              <FiBarChart2
                size={23}
              />
            </div>

            <div>

              <h3 className="
                text-lg
                font-bold
                text-gray-900
              ">
                Overall Progress Summary
              </h3>

              <p className="
                mt-2
                text-sm
                leading-6
                text-gray-500
              ">
                {
                  dummyStudent.overallProgressSummary
                }
              </p>

            </div>

          </div>

        </motion.div>


        {/* =================================================
            WEAK TOPICS
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.2,
          }}
          className="
            mb-10
            rounded-3xl
            border
            border-orange-100
            bg-white
            p-6
            shadow-sm
          "
        >

          <div className="
            flex
            items-center
            gap-3
          ">

            <div className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              bg-orange-50
              text-orange-500
            ">
              <FiAlertTriangle
                size={21}
              />
            </div>

            <div>

              <h3 className="
                font-bold
                text-gray-900
              ">
                Weak Topics
              </h3>

              <p className="
                text-xs
                text-gray-500
              ">
                Topics where the student needs more practice
              </p>

            </div>

          </div>


          <div className="
            mt-5
            flex
            flex-wrap
            gap-3
          ">

            {dummyStudent.weakTopics.map(
              (topic) => (
                <span
                  key={topic}
                  className="
                    rounded-xl
                    bg-orange-50
                    px-4
                    py-2
                    text-sm
                    font-medium
                    text-orange-600
                  "
                >
                  {topic}
                </span>
              )
            )}

          </div>

        </motion.div>


        {/* =================================================
            QUIZ HEADER + FILTER
        ================================================= */}

        <div className="
          mb-6
          flex
          flex-col
          gap-4
          md:flex-row
          md:items-center
          md:justify-between
        ">

          <div>

            <h3 className="
              text-2xl
              font-bold
              text-gray-900
            ">
              Quizzes
            </h3>

            <p className="
              mt-1
              text-sm
              text-gray-500
            ">
              View all quizzes taken by the student
            </p>

          </div>


          {/* Filters */}

          <div className="
            flex
            w-fit
            rounded-xl
            bg-white
            p-1
            shadow-sm
          ">

            {[
              {
                label: "All",
                value: "all",
              },
              {
                label: "Completed",
                value: "completed",
              },
              {
                label: "In Progress",
                value: "in_progress",
              },
            ].map(
              (item) => (

                <button
                  key={item.value}
                  onClick={() =>
                    setFilter(
                      item.value
                    )
                  }
                  className={`
                    rounded-lg
                    px-4
                    py-2
                    text-sm
                    font-medium
                    transition

                    ${
                      filter ===
                      item.value
                        ? "bg-[#008f68] text-white"
                        : "text-gray-500 hover:bg-gray-50"
                    }
                  `}
                >
                  {item.label}
                </button>

              )
            )}

          </div>

        </div>


        {/* =================================================
            QUIZ LIST
        ================================================= */}

        <div className="
          space-y-4
        ">

          <AnimatePresence>

            {filteredQuizzes.length ===
            0 ? (

              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                className="
                  rounded-3xl
                  border
                  border-dashed
                  border-gray-200
                  bg-white
                  p-10
                  text-center
                "
              >

                <FiBookOpen
                  size={35}
                  className="
                    mx-auto
                    text-gray-300
                  "
                />

                <p className="
                  mt-4
                  text-sm
                  text-gray-500
                ">
                  No quizzes found.
                </p>

              </motion.div>

            ) : (

              filteredQuizzes.map(
                (quiz) => (

                  <motion.div
                    key={quiz.id}
                    layout
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.95,
                    }}
                    className="
                      rounded-2xl
                      border
                      border-gray-100
                      bg-white
                      p-5
                      shadow-sm
                      transition
                      hover:shadow-md
                    "
                  >

                    <div className="
                      flex
                      flex-col
                      gap-5
                      md:flex-row
                      md:items-center
                      md:justify-between
                    ">

                      {/* Quiz info */}

                      <div className="
                        flex
                        items-start
                        gap-4
                      ">

                        <div className={`
                          flex
                          h-12
                          w-12
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl

                          ${
                            quiz.status ===
                            "completed"
                              ? "bg-green-50 text-green-500"
                              : "bg-blue-50 text-blue-500"
                          }
                        `}>

                          {quiz.status ===
                          "completed" ? (
                            <FiCheckCircle
                              size={22}
                            />
                          ) : (
                            <FiClock
                              size={22}
                            />
                          )}

                        </div>


                        <div>

                          <div className="
                            flex
                            flex-wrap
                            items-center
                            gap-2
                          ">

                            <h4 className="
                              font-bold
                              text-gray-900
                            ">
                              {quiz.title}
                            </h4>

                            <span className={`
                              rounded-full
                              px-2.5
                              py-1
                              text-xs
                              font-medium

                              ${
                                quiz.status ===
                                "completed"
                                  ? "bg-green-50 text-green-600"
                                  : "bg-blue-50 text-blue-600"
                              }
                            `}>
                              {quiz.status ===
                              "completed"
                                ? "Completed"
                                : "In Progress"}
                            </span>

                          </div>


                          <p className="
                            mt-1
                            text-xs
                            text-gray-400
                          ">
                            Created{" "}
                            {quiz.createdAt}
                          </p>


                          {/* Topics */}

                          <div className="
                            mt-3
                            flex
                            flex-wrap
                            gap-2
                          ">

                            {quiz.topics.map(
                              (topic) => (
                                <span
                                  key={topic}
                                  className="
                                    rounded-lg
                                    bg-gray-50
                                    px-2.5
                                    py-1
                                    text-xs
                                    text-gray-500
                                  "
                                >
                                  {topic}
                                </span>
                              )
                            )}

                          </div>

                        </div>

                      </div>


                      {/* Score + actions */}

                      <div className="
                        flex
                        items-center
                        gap-3
                      ">

                        {/* Score */}

                        {quiz.status ===
                          "completed" && (
                          <div className="
                            mr-2
                            text-right
                          ">

                            <p className="
                              text-xs
                              text-gray-400
                            ">
                              Score
                            </p>

                            <p className="
                              font-bold
                              text-[#008f68]
                            ">
                              {quiz.score}/
                              {quiz.totalQuestions}
                            </p>

                          </div>
                        )}


                        {/* Continue / Completed */}

                        <button
                          disabled={
                            quiz.status ===
                            "completed"
                          }
                          onClick={() =>
                            quiz.status !==
                              "completed" &&
                            handleContinueQuiz(
                              quiz.id
                            )
                          }
                          className={`
                            rounded-xl
                            px-4
                            py-2.5
                            text-sm
                            font-semibold
                            transition

                            ${
                              quiz.status ===
                              "completed"
                                ? "cursor-not-allowed bg-gray-100 text-gray-400"
                                : "bg-[#008f68] text-white hover:bg-[#007a59]"
                            }
                          `}
                        >
                          {quiz.status ===
                          "completed"
                            ? "Completed"
                            : "Continue Quiz"}
                        </button>


                        {/* Delete */}

                        <button
                          onClick={() =>
                            setDeleteQuiz(
                              quiz
                            )
                          }
                          className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            text-red-400
                            transition
                            hover:bg-red-50
                            hover:text-red-500
                          "
                          title="Delete quiz"
                        >
                          <FiTrash2
                            size={18}
                          />
                        </button>

                      </div>

                    </div>

                  </motion.div>

                )
              )

            )}

          </AnimatePresence>

        </div>

      </main>


      {/* ===================================================
          DELETE CONFIRMATION POPUP
      =================================================== */}

      <AnimatePresence>

        {deleteQuiz && (

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="
              fixed
              inset-0
              z-50
              flex
              items-center
              justify-center
              bg-black/40
              px-6
              backdrop-blur-sm
            "
          >

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
              }}
              className="
                relative
                w-full
                max-w-md
                rounded-3xl
                bg-white
                p-7
                shadow-2xl
              "
            >

              {/* Close */}

              <button
                onClick={() =>
                  setDeleteQuiz(null)
                }
                className="
                  absolute
                  right-4
                  top-4
                  rounded-lg
                  p-2
                  text-gray-400
                  hover:bg-gray-100
                "
              >
                <FiX />
              </button>


              {/* Icon */}

              <div className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                bg-red-50
                text-red-500
              ">
                <FiTrash2
                  size={21}
                />
              </div>


              <h3 className="
                mt-5
                text-xl
                font-bold
                text-gray-900
              ">
                Delete Quiz?
              </h3>


              <p className="
                mt-2
                text-sm
                leading-6
                text-gray-500
              ">
                Are you sure you want to delete{" "}
                <span className="
                  font-semibold
                  text-gray-700
                ">
                  {deleteQuiz.title}
                </span>
                ? This action cannot be undone.
              </p>


              {/* Actions */}

              <div className="
                mt-6
                flex
                justify-end
                gap-3
              ">

                <button
                  onClick={() =>
                    setDeleteQuiz(null)
                  }
                  className="
                    rounded-xl
                    border
                    border-gray-200
                    px-5
                    py-2.5
                    text-sm
                    font-semibold
                    text-gray-600
                    hover:bg-gray-50
                  "
                >
                  Cancel
                </button>


                <button
                  onClick={
                    handleDeleteQuiz
                  }
                  className="
                    rounded-xl
                    bg-red-500
                    px-5
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
                    hover:bg-red-600
                  "
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