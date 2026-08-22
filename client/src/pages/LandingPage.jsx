import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiBookOpen,
  FiMessageCircle,
  FiFileText,
  FiTarget,
  FiBarChart2,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: FiMessageCircle,
    title: "AI Doubt Solver",
    description:
      "Ask questions and get simple, step-by-step explanations from your learning material.",
  },
  {
    icon: FiFileText,
    title: "Source-Based Learning",
    description:
      "Learn from trusted educational sources instead of relying on generic answers.",
  },
  {
    icon: FiTarget,
    title: "Adaptive AI Quiz",
    description:
      "Take quizzes generated from your current conversation and learning progress.",
  },
  {
    icon: FiBarChart2,
    title: "Progress & Analytics",
    description:
      "Understand your strengths, weak topics, quiz performance, and learning progress.",
  },
];


const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen overflow-hidden bg-[#F8FCFA]">
      {/* ================= NAVBAR ================= */}

      <nav className="relative z-20">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5">
          {/* Logo */}

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#008F6B] shadow-md">
              <FiBookOpen size={21} />
            </div>

            <span className="text-xl font-extrab800 font-extrabold text-white">
              EduBridge
            </span>
          </div>

          {/* Get Started */}

         <button
  onClick={() => navigate("/signup")}
  className="
    inline-flex
    items-center
    gap-3
    rounded-xl
    bg-white
    px-7
    py-4
    text-sm
    font-extrabold
    text-[#008F6B]
    shadow-2xl
    transition
    hover:-translate-y-1
  "
>
  Get Started
  <FiArrowRight size={18} />
</button>
        </div>
      </nav>

      {/* ================= HERO ================= */}

      <section
        className="
          relative
          -mt-20
          overflow-hidden
          bg-[#008F6B]
          px-5
          pb-24
          pt-36
          text-white
        "
      >
        {/* Green pattern */}

        <div className="pointer-events-none absolute inset-0">
          <div
            className="
              absolute
              -left-72
              -top-72
              h-[750px]
              w-[750px]
              rounded-full
              border
              border-white/10
            "
          />

          <div
            className="
              absolute
              -left-48
              -top-48
              h-[500px]
              w-[500px]
              rounded-full
              border
              border-white/10
            "
          />

          <div
            className="
              absolute
              -right-72
              -bottom-96
              h-[750px]
              w-[750px]
              rounded-full
              border
              border-white/10
            "
          />

          {/* Dots */}

          <div
            className="
              absolute
              right-[10%]
              top-[35%]
              grid
              grid-cols-6
              gap-4
              opacity-20
            "
          >
            {Array.from({ length: 30 }).map((_, index) => (
              <span
                key={index}
                className="h-1.5 w-1.5 rounded-full bg-white"
              />
            ))}
          </div>
        </div>

        {/* Hero content */}

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="
                mx-auto
                mb-6
                flex
                w-fit
                items-center
                gap-2
                rounded-full
                border
                border-white/20
                bg-white/10
                px-4
                py-2
                text-xs
                font-semibold
                text-[#D8F5EB]
              "
            >
              <FiBookOpen />

              AI-Powered Learning
            </div>

            <h1
              className="
                text-5xl
                font-extrabold
                leading-[1.05]
                tracking-tight
                sm:text-6xl
                lg:text-7xl
              "
            >
              Learn smarter.

              <br />

              <span className="text-[#BDEADD]">
                Grow stronger.
              </span>
            </h1>

            <p
              className="
                mx-auto
                mt-6
                max-w-2xl
                text-base
                leading-7
                text-white/75
                sm:text-lg
              "
            >
              An AI-powered learning platform that connects
              your educational sources, doubts, quizzes,
              and progress into one personalized experience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}

      <section className="relative z-10 mx-auto -mt-10 max-w-6xl px-5 pb-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                whileHover={{
                  y: -6,
                }}
                className="
                  rounded-2xl
                  border
                  border-[#DCECE6]
                  bg-white
                  p-5
                  shadow-[0_15px_40px_rgba(0,100,75,0.08)]
                "
              >
                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#E2F5EF]
                    text-[#008F6B]
                  "
                >
                  <Icon size={20} />
                </div>

                <h3 className="mt-4 text-base font-bold text-[#17221F]">
                  {feature.title}
                </h3>

                <p className="mt-2 text-xs leading-5 text-[#75827E]">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ================= SMALL BOTTOM CTA ================= */}

      <section className="px-5 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-[#75827E]">
            Your questions. Your sources. Your progress.
          </p>

         <button
  onClick={() => navigate("/signup")}
  className="
    inline-flex
    items-center
    gap-3
    rounded-xl
    bg-white
    px-7
    py-4
    text-sm
    font-extrabold
    text-[#008F6B]
    shadow-2xl
    transition
    hover:-translate-y-1
  "
>
  Get Started
  <FiArrowRight size={18} />
</button>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;