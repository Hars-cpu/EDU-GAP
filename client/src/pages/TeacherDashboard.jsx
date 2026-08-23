import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import {
  FiBookOpen,
  FiUsers,
  FiBarChart2,
  FiArrowRight,
  FiLogOut,
} from "react-icons/fi";

import axios from "axios";
import { toast } from "react-toastify";

import { clearUser } from "../redux/slices/authSlice";
import { serverurl } from "../main.jsx";

const TeacherDashboard = () => {
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
              Teacher Portal
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
          max-w-5xl
          px-6
          pb-20
          pt-14
          md:px-12
        "
      >

        {/* ================= HEADER ================= */}

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
          className="mb-12 text-center"
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

            Teacher Dashboard
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
            Understand your students.
            <br />

            <span className="text-[#008f68]">
              Help them grow.
            </span>
          </h2>

          <p
            className="
              mx-auto
              mt-4
              max-w-2xl
              text-lg
              leading-relaxed
              text-gray-600
            "
          >
            Monitor student performance, identify learning
            gaps, and understand where your students need
            support.
          </p>
        </motion.div>

        {/* ================= ONLY FEATURE ================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 35,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
            delay: 0.15,
          }}
          whileHover={{
            y: -8,
            scale: 1.01,
          }}
          className="mx-auto max-w-2xl"
        >
          <motion.button
            onClick={() =>
              navigate("/teacher/students")
            }
            className="
              group
              w-full
              rounded-3xl
              border
              border-[#008f68]/10
              bg-white
              p-8
              text-left
              shadow-sm
              transition-shadow
              duration-300
              hover:shadow-2xl
              hover:shadow-[#008f68]/10
              md:p-10
            "
          >
            {/* Icon */}

            <div className="flex items-center justify-between">
              <motion.div
                whileHover={{
                  rotate: 5,
                  scale: 1.08,
                }}
                className="
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[#008f68]/10
                  text-[#008f68]
                "
              >
                <FiBarChart2 size={30} />
              </motion.div>

              <div
                className="
                  flex
                  h-11
                  w-11
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
                <FiArrowRight size={20} />
              </div>
            </div>

            {/* Content */}

            <h3
              className="
                mt-8
                text-2xl
                font-bold
                text-gray-900
              "
            >
              View Student Progress
            </h3>

            <p
              className="
                mt-3
                max-w-xl
                text-sm
                leading-6
                text-gray-500
              "
            >
              View your students' performance, identify
              weak topics, track quiz results, and
              understand who may need additional support.
            </p>

            {/* Small information */}

            <div className="mt-8 flex flex-wrap gap-3">
              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-[#f5faf8]
                  px-4
                  py-3
                  text-sm
                  text-gray-600
                "
              >
                <FiUsers
                  className="text-[#008f68]"
                  size={17}
                />

                Student Performance
              </div>

              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-[#f5faf8]
                  px-4
                  py-3
                  text-sm
                  text-gray-600
                "
              >
                <FiBarChart2
                  className="text-[#008f68]"
                  size={17}
                />

                Learning Analytics
              </div>
            </div>

            {/* Bottom animation */}

            <div
              className="
                mt-8
                h-1
                w-14
                rounded-full
                bg-[#008f68]
                transition-all
                duration-500
                group-hover:w-full
              "
            />
          </motion.button>
        </motion.div>

        {/* ================= INFO ================= */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.5,
            delay: 0.7,
          }}
          className="
            mx-auto
            mt-8
            flex
            max-w-2xl
            items-center
            gap-3
            rounded-2xl
            border
            border-[#008f68]/10
            bg-[#008f68]/5
            p-5
            text-sm
            text-gray-600
          "
        >
          <FiUsers
            className="shrink-0 text-[#008f68]"
            size={20}
          />

          <p>
            Use student insights to identify learning
            gaps early and provide targeted support.
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default TeacherDashboard;