import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  FiMessageCircle,
  FiClipboard,
  FiBarChart2,
  FiArrowRight,
  FiBookOpen,
  FiLogOut,
} from "react-icons/fi";

import axios from "axios";
import { toast } from "react-toastify";

import { clearUser } from "../redux/slices/authSlice";
import { serverurl} from "../main.jsx";

const features = [
  {
    title: "Ask Questions",
    description:
      "Clear your doubts with an AI tutor that understands what you are studying.",
    icon: FiMessageCircle,
    path: "/student/chatbot",
  },
  {
    title: "Take Quiz",
    description:
      "Test your understanding with AI-generated quizzes based on your learning.",
    icon: FiClipboard,
    path: "/student/quiz",
    isComingSoon: true,
  },
  {
    title: "Analytics",
    description:
      "Track your progress, strengths, weak areas and recent quiz performance.",
    icon: FiBarChart2,
    path: "/student/analytics",
  },
];

const DASHBOARD_QUIZ_COMING_SOON_TOAST_ID = "dashboard-quiz-coming-soon";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${serverurl}/api/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      dispatch(clearUser());

      toast.success("Logged out successfully");

      navigate("/signin", {
        replace: true,
      });
    } catch (error) {
      console.error("Logout error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to logout. Please try again."
      );
    }
  };

  const handleFeatureClick = (feature) => {
    if (feature.isComingSoon) {
      toast.info("Coming Soon! Use Ask Questions to start a quiz from chat.", {
        toastId: DASHBOARD_QUIZ_COMING_SOON_TOAST_ID,
      });
      return;
    }

    navigate(feature.path);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#f5faf8]">

      {/* ================= BACKGROUND ================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#008f68]/10 blur-3xl" />

        <div className="absolute -left-40 top-1/2 h-96 w-96 rounded-full bg-[#00a878]/10 blur-3xl" />

        <div className="absolute inset-0 opacity-[0.035]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(30deg, #008f68 12%, transparent 12.5%, transparent 87%, #008f68 87.5%, #008f68), linear-gradient(150deg, #008f68 12%, transparent 12.5%, transparent 87%, #008f68 87.5%, #008f68)",
              backgroundSize: "80px 140px",
            }}
          />
        </div>
      </div>

      {/* ================= NAVBAR ================= */}

      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="
          relative
          z-20
          flex
          items-center
          justify-between
          px-6
          py-5
          md:px-12
        "
      >
        {/* Logo */}

        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-[#008f68]
              text-white
              shadow-lg
            "
          >
            <FiBookOpen size={21} />
          </div>

          <div>
            <h1 className="text-xl font-bold text-[#075c47]">
              EDU-GAP
            </h1>

            <p className="text-xs text-gray-500">
              Student Portal
            </p>
          </div>
        </div>

        {/* Logout */}

        <motion.button
          onClick={handleLogout}
          whileHover={{
            scale: 1.05,
            y: -2,
          }}
          whileTap={{
            scale: 0.95,
          }}
          className="
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-red-100
            bg-white
            px-4
            py-2.5
            text-sm
            font-semibold
            text-red-500
            shadow-sm
            transition
            hover:bg-red-50
            hover:shadow-md
          "
        >
          <FiLogOut size={17} />

          <span>Logout</span>
        </motion.button>
      </motion.nav>

      {/* ================= MAIN ================= */}

      <main
        className="
          relative
          z-10
          mx-auto
          max-w-6xl
          px-6
          pb-20
          pt-12
          md:px-12
        "
      >
        {/* Welcome */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="mb-12"
        >
          <div
            className="
              mb-5
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
            "
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#008f68]" />

            Student Dashboard
          </div>

          <h2
            className="
              text-4xl
              font-bold
              leading-tight
              text-gray-900
              md:text-5xl
            "
          >
            Learn smarter.
            <br />

            <span className="text-[#008f68]">
              Improve every day.
            </span>
          </h2>

          <p
            className="
              mt-4
              max-w-2xl
              text-lg
              text-gray-600
            "
          >
            Ask doubts, test your knowledge and understand
            your learning progress — all in one place.
          </p>
        </motion.div>

        {/* ================= FEATURES ================= */}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.button
                key={feature.title}
                onClick={() => handleFeatureClick(feature)}
                initial={{
                  opacity: 0,
                  y: 35,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.12,
                }}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                className="
                  group
                  rounded-3xl
                  border
                  border-[#008f68]/10
                  bg-white
                  p-7
                  text-left
                  shadow-sm
                  transition-shadow
                  duration-300
                  hover:shadow-2xl
                  hover:shadow-[#008f68]/10
                "
              >
                <div className="mb-8 flex items-center justify-between">
                  <motion.div
                    whileHover={{
                      rotate: 5,
                      scale: 1.08,
                    }}
                    className="
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-2xl
                      bg-[#008f68]/10
                      text-[#008f68]
                    "
                  >
                    <Icon size={27} />
                  </motion.div>

                  <div
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-full
                      bg-gray-50
                      text-gray-500
                      transition-all
                      duration-300
                      group-hover:bg-[#008f68]
                      group-hover:text-white
                    "
                  >
                    <FiArrowRight size={18} />
                  </div>
                </div>

                <h3
                  className="
                    mb-3
                    text-xl
                    font-bold
                    text-gray-900
                  "
                >
                  {feature.title}
                </h3>

                <p
                  className="
                    text-sm
                    leading-relaxed
                    text-gray-500
                  "
                >
                  {feature.description}
                </p>

                <div
                  className="
                    mt-7
                    h-1
                    w-12
                    rounded-full
                    bg-[#008f68]
                    transition-all
                    duration-500
                    group-hover:w-full
                  "
                />
              </motion.button>
            );
          })}
        </div>

        {/* ================= BOTTOM INFO ================= */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="
            mt-10
            flex
            flex-col
            items-start
            justify-between
            gap-4
            rounded-2xl
            bg-[#008f68]
            p-5
            text-white
            md:flex-row
            md:items-center
          "
        >
          <div>
            <p className="font-semibold">
              Your learning journey starts here.
            </p>

            <p className="mt-1 text-sm text-white/70">
              Ask questions, practice concepts and track
              your progress.
            </p>
          </div>

          <FiArrowRight
            size={24}
            className="hidden md:block"
          />
        </motion.div>
      </main>
    </div>
  );
};

export default StudentDashboard;