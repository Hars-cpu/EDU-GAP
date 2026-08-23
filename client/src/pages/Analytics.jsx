import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowLeft,
  FiBarChart2,
  FiBookOpen,
  FiFilter,
  FiMail,
  FiSearch,
  FiUser,
  FiUsers,
  FiChevronRight,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Analytics = () => {
  const navigate = useNavigate();

  // =====================================================
  // DUMMY DATA
  // Replace this with API data later
  // =====================================================

  const [students] = useState([
    {
      _id: "student-1",
      name: "Aarav Sharma",
      username: "aarav",
      email: "aarav@gmail.com",
      className: "10A",
    },
    {
      _id: "student-2",
      name: "Ananya Singh",
      username: "ananya",
      email: "ananya@gmail.com",
      className: "10B",
    },
    {
      _id: "student-3",
      name: "Harsh Verma",
      username: "harsh",
      email: "harsh@gmail.com",
      className: "10A",
    },
    {
      _id: "student-4",
      name: "Karan Kumar",
      username: "karan",
      email: "karan@gmail.com",
      className: "9A",
    },
    {
      _id: "student-5",
      name: "Meera Patel",
      username: "meera",
      email: "meera@gmail.com",
      className: "10B",
    },
    {
      _id: "student-6",
      name: "Priya Gupta",
      username: "priya",
      email: "priya@gmail.com",
      className: "9A",
    },
    {
      _id: "student-7",
      name: "Rahul Raj",
      username: "rahul",
      email: "rahul@gmail.com",
      className: "10A",
    },
    {
      _id: "student-8",
      name: "Rohan Kumar",
      username: "rohan",
      email: "rohan@gmail.com",
      className: "9B",
    },
  ]);

  const [search, setSearch] = useState("");

  const [selectedClass, setSelectedClass] =
    useState("all");

  // =====================================================
  // GET UNIQUE CLASSES
  // =====================================================

  const classes = useMemo(() => {
    const uniqueClasses = new Set();

    students.forEach((student) => {
      if (student.className) {
        uniqueClasses.add(student.className);
      }
    });

    return Array.from(uniqueClasses).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [students]);

  // =====================================================
  // FILTER + ALPHABETICAL SORT
  // =====================================================

  const filteredStudents = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase();

    return students
      .filter((student) => {
        // Class filter
        if (
          selectedClass !== "all" &&
          student.className !== selectedClass
        ) {
          return false;
        }

        // Search filter
        if (!searchValue) {
          return true;
        }

        const name =
          student.name?.toLowerCase() || "";

        const username =
          student.username?.toLowerCase() || "";

        const email =
          student.email?.toLowerCase() || "";

        return (
          name.includes(searchValue) ||
          username.includes(searchValue) ||
          email.includes(searchValue)
        );
      })
      .sort((a, b) => {
        const nameA = (
          a.name ||
          a.username ||
          ""
        ).toLowerCase();

        const nameB = (
          b.name ||
          b.username ||
          ""
        ).toLowerCase();

        return nameA.localeCompare(nameB);
      });
  }, [
    students,
    search,
    selectedClass,
  ]);

  // =====================================================
  // STUDENT CLICK
  // =====================================================

  const handleStudentClick = (studentId) => {
    navigate(`/teacher/student/${studentId}`);
  };

  // =====================================================
  // GET INITIAL
  // =====================================================

  const getInitial = (student) => {
    const value =
      student.name ||
      student.username ||
      "S";

    return value.charAt(0).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#f5faf8]">

      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div className="
        fixed
        inset-0
        pointer-events-none
        overflow-hidden
      ">

        <div className="
          absolute
          -top-32
          -right-32
          h-96
          w-96
          rounded-full
          bg-[#008f68]/10
          blur-3xl
        " />

        <div className="
          absolute
          top-1/2
          -left-40
          h-96
          w-96
          rounded-full
          bg-[#00a878]/10
          blur-3xl
        " />

      </div>

      {/* =================================================
          NAVBAR
      ================================================= */}

      <nav className="
        relative
        z-10
        border-b
        border-[#008f68]/10
        bg-white/80
        backdrop-blur-xl
      ">

        <div className="
          mx-auto
          flex
          max-w-6xl
          items-center
          px-6
          py-5
          md:px-10
        ">

          <div className="
            flex
            items-center
            gap-3
          ">

            <motion.div
              whileHover={{
                rotate: 5,
                scale: 1.05,
              }}
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-[#008f68]
                text-white
                shadow-lg
                shadow-[#008f68]/20
              "
            >
              <FiBarChart2 size={22} />
            </motion.div>

            <div>
              <h1 className="
                text-lg
                font-bold
                text-[#075c47]
              ">
                Student Analytics
              </h1>

              <p className="
                text-xs
                text-gray-500
              ">
                Monitor your students
              </p>
            </div>

          </div>

        </div>

      </nav>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="
        relative
        z-10
        mx-auto
        max-w-6xl
        px-6
        py-8
        md:px-10
        md:py-10
      ">

        {/* BACK */}

        <motion.button
          whileHover={{ x: -3 }}
          onClick={() => navigate("/teacher")}
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
        </motion.button>

        {/* =================================================
            HEADER
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
            mb-4
            inline-flex
            items-center
            gap-2
            rounded-full
            bg-[#008f68]/10
            px-4
            py-2
            text-sm
            font-semibold
            text-[#008f68]
          ">

            <FiUsers size={15} />

            Your Students

          </div>

          <h2 className="
            text-3xl
            font-bold
            tracking-tight
            text-gray-900
            md:text-4xl
          ">
            Student Progress
          </h2>

          <p className="
            mt-2
            max-w-xl
            text-gray-500
          ">
            Find a student to view their
            learning progress and analytics.
          </p>

        </motion.div>

        {/* =================================================
            SEARCH + FILTER
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
            p-5
            shadow-sm
          "
        >

          <div className="
            flex
            flex-col
            gap-4
            md:flex-row
          ">

            {/* SEARCH */}

            <div className="
              relative
              flex-1
            ">

              <FiSearch
                size={19}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="
                  Search by name, username or email...
                "
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  py-3.5
                  pl-11
                  pr-4
                  text-sm
                  text-gray-800
                  outline-none
                  transition
                  placeholder:text-gray-400
                  focus:border-[#008f68]
                  focus:bg-white
                  focus:ring-4
                  focus:ring-[#008f68]/10
                "
              />

            </div>

            {/* CLASS FILTER */}

            <div className="
              relative
              md:w-56
            ">

              <FiFilter
                size={17}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              />

              <select
                value={selectedClass}
                onChange={(e) =>
                  setSelectedClass(
                    e.target.value
                  )
                }
                className="
                  w-full
                  appearance-none
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  py-3.5
                  pl-11
                  pr-4
                  text-sm
                  text-gray-700
                  outline-none
                  transition
                  focus:border-[#008f68]
                  focus:bg-white
                  focus:ring-4
                  focus:ring-[#008f68]/10
                "
              >

                <option value="all">
                  All Classes
                </option>

                {classes.map((className) => (
                  <option
                    key={className}
                    value={className}
                  >
                    Class {className}
                  </option>
                ))}

              </select>

            </div>

          </div>

        </motion.div>

        {/* =================================================
            SUMMARY
        ================================================= */}

        <div className="
          mb-5
          flex
          items-end
          justify-between
        ">

          <div>

            <h3 className="
              text-xl
              font-bold
              text-gray-900
            ">
              Students
            </h3>

            <p className="
              mt-1
              text-sm
              text-gray-500
            ">
              {filteredStudents.length}{" "}
              student
              {filteredStudents.length !== 1
                ? "s"
                : ""}{" "}
              found
            </p>

          </div>

          {selectedClass !== "all" && (
            <div className="
              rounded-full
              bg-[#008f68]/10
              px-3
              py-1.5
              text-xs
              font-semibold
              text-[#008f68]
            ">
              Class {selectedClass}
            </div>
          )}

        </div>

        {/* =================================================
            STUDENT CARDS
        ================================================= */}

        {filteredStudents.length > 0 ? (

          <div className="
            grid
            gap-4
            md:grid-cols-2
          ">

            <AnimatePresence mode="popLayout">

              {filteredStudents.map(
                (student, index) => (

                  <motion.button
                    key={student._id}
                    layout
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.95,
                    }}
                    transition={{
                      delay: index * 0.04,
                    }}
                    whileHover={{
                      y: -4,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    onClick={() =>
                      handleStudentClick(
                        student._id
                      )
                    }
                    className="
                      group
                      rounded-2xl
                      border
                      border-gray-100
                      bg-white
                      p-5
                      text-left
                      shadow-sm
                      transition
                      hover:border-[#008f68]/20
                      hover:shadow-xl
                      hover:shadow-[#008f68]/5
                    "
                  >

                    <div className="
                      flex
                      items-center
                      gap-4
                    ">

                      {/* AVATAR */}

                      <div className="
                        flex
                        h-14
                        w-14
                        shrink-0
                        items-center
                        justify-center
                        rounded-2xl
                        bg-[#008f68]/10
                        text-lg
                        font-bold
                        text-[#008f68]
                        transition
                        group-hover:bg-[#008f68]
                        group-hover:text-white
                      ">
                        {getInitial(student)}
                      </div>

                      {/* INFO */}

                      <div className="
                        min-w-0
                        flex-1
                      ">

                        <h4 className="
                          truncate
                          font-bold
                          text-gray-900
                          transition
                          group-hover:text-[#008f68]
                        ">
                          {student.name}
                        </h4>

                        <p className="
                          mt-1
                          flex
                          items-center
                          gap-1.5
                          truncate
                          text-xs
                          text-gray-400
                        ">
                          <FiUser size={12} />

                          @{student.username}
                        </p>

                        <p className="
                          mt-1
                          flex
                          items-center
                          gap-1.5
                          truncate
                          text-xs
                          text-gray-400
                        ">
                          <FiMail size={12} />

                          {student.email}
                        </p>

                      </div>

                      {/* CLASS + ARROW */}

                      <div className="
                        flex
                        shrink-0
                        flex-col
                        items-end
                        gap-3
                      ">

                        <div className="
                          flex
                          items-center
                          gap-1.5
                          rounded-lg
                          bg-[#008f68]/10
                          px-3
                          py-1.5
                          text-xs
                          font-semibold
                          text-[#008f68]
                        ">

                          <FiBookOpen
                            size={12}
                          />

                          {student.className}

                        </div>

                        <FiChevronRight
                          size={18}
                          className="
                            text-gray-300
                            transition
                            group-hover:translate-x-1
                            group-hover:text-[#008f68]
                          "
                        />

                      </div>

                    </div>

                  </motion.button>

                )
              )}

            </AnimatePresence>

          </div>

        ) : (

          /* =================================================
             EMPTY STATE
          ================================================= */

          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="
              rounded-3xl
              border
              border-dashed
              border-gray-200
              bg-white
              px-6
              py-16
              text-center
            "
          >

            <div className="
              mx-auto
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              bg-[#008f68]/10
              text-[#008f68]
            ">
              <FiUsers size={27} />
            </div>

            <h3 className="
              mt-5
              text-lg
              font-bold
              text-gray-900
            ">
              No students found
            </h3>

            <p className="
              mt-2
              text-sm
              text-gray-500
            ">
              Try changing your search
              or class filter.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setSelectedClass("all");
              }}
              className="
                mt-5
                rounded-xl
                bg-[#008f68]
                px-5
                py-2.5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#007a59]
              "
            >
              Clear Filters
            </button>

          </motion.div>

        )}

      </main>
    </div>
  );
};

export default Analytics;