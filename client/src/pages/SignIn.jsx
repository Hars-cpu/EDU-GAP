import { useState } from "react";
import { motion } from "framer-motion";

import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiCheck,
  FiBookOpen,
  FiShield,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {serverurl} from "../main.jsx";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/authSlice";
/* =========================================================
   FAKE SIGN-IN API
========================================================= */






const validateForm = (formData) => {
  const errors = {};



  if (!formData.email.trim()) {

    errors.email = "Email is required";

  } else if (!formData.email.includes("@")) {

    errors.email =
      "Please enter a valid email address";

  }


  

  if (!formData.password) {

    errors.password =
      "Password is required";

  } else if (formData.password.length < 8) {

    errors.password =
      "Password must be at least 8 characters";

  }


  return errors;
};




export default function SignIn() {
 const dispatch = useDispatch();
  
const [showPassword, setShowPassword] =
    useState(false);

  const [rememberMe, setRememberMe] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const [errors, setErrors] =
    useState({});

  const navigate = useNavigate();
  

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;


    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));


    // Remove only this field's error
    if (errors[name]) {

      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));

    }
  };


  /* =======================================================
     HANDLE SUBMIT
  ======================================================= */

  const handleSubmit = async (e) => {

    e.preventDefault();


    // Clear old errors
    setErrors({});


    /* =====================================================
       STEP 1: FRONTEND VALIDATION
    ===================================================== */

    const frontendErrors =
      validateForm(formData);


    /*
      IMPORTANT:

      We collect ALL errors first.

      Therefore if both email and password
      are invalid, BOTH become red.
    */

    if (
      Object.keys(frontendErrors).length > 0
    ) {

      setErrors(frontendErrors);

      toast.error(
        "Please fix the errors in the form."
      );

      return;
    }


    /* =====================================================
       STEP 2: API REQUEST
    ===================================================== */

    setLoading(true);


    try {

      const payload = {
        email: formData.email.trim(),
        password: formData.password,
      };


      console.log(
        "SIGN IN REQUEST:",
        payload
      );


      

      const response =
        await axios.post(
          `${serverurl}/api/auth/signin`,
          payload,
          {
            withCredentials: true,
          }
        );

        
     

      console.log(
        "SIGN IN RESPONSE:",
        response.data
      );

dispatch(setUser(response.user));
      /* =========================
         SUCCESS
      ========================= */

      toast.success(
        response.data.message ||
          "Login successful!"
      );


     if (response.user.role === "student") {
  navigate("/student");
} else {
  navigate("/teacher");
}

    } catch (error) {

      console.log(
        "SIGN IN ERROR:",
        error
      );


      /*
        Backend returns:

        {
          success: false,
          message: "User not found"
        }

        OR

        {
          success: false,
          message: "Password does not match"
        }
      */

      const message =
        error?.response?.data?.message ||
        "Unable to sign in";


      toast.error(message);


    } finally {

      setLoading(false);

    }
  };


  return (
    <div
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#008F6B]
      "
    >

      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >

        <div
          className="
            absolute
            -bottom-[300px]
            -left-[250px]
            h-[700px]
            w-[700px]
            rounded-full
            border
            border-white/10
          "
        />

        <div
          className="
            absolute
            -bottom-[180px]
            -left-[150px]
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
            -top-[250px]
            right-[5%]
            h-[500px]
            w-[500px]
            rounded-full
            border
            border-white/[0.06]
          "
        />


        {/* Dots */}

        <div
          className="
            absolute
            left-[38%]
            top-[30%]
            grid
            grid-cols-5
            gap-4
            opacity-20
          "
        >

          {Array.from({ length: 25 }).map(
            (_, index) => (
              <div
                key={index}
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-white
                "
              />
            )
          )}

        </div>

      </div>


      {/* =================================================
          MAIN
      ================================================= */}

      <div
        className="
          relative
          z-10
          flex
          min-h-screen
          flex-col
          lg:flex-row
        "
      >


        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <motion.section
          initial={{
            opacity: 0,
            x: -40,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.7,
          }}
          className="
            w-full
            px-6
            py-8
            text-white
            sm:px-10
            lg:w-[52%]
            lg:px-[70px]
            lg:py-[50px]
          "
        >

          {/* Logo */}

          <motion.div
            initial={{
              opacity: 0,
              y: -15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.2,
            }}
            className="
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-[13px]
                bg-white
                text-[#008F6B]
                shadow-lg
              "
            >

              <FiBookOpen
                size={22}
                strokeWidth={2.5}
              />

            </div>


            <span
              className="
                text-2xl
                font-extrabold
                tracking-tight
              "
            >
              EduBridge
            </span>

          </motion.div>


          {/* Hero */}

          <div
            className="
              mt-20
              max-w-[560px]
              lg:mt-[135px]
            "
          >

            <motion.p
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.3,
              }}
              className="
                mb-5
                text-xs
                font-bold
                tracking-[3px]
                text-[#BDEADD]
              "
            >
              WELCOME BACK
            </motion.p>


            <motion.h1
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.4,
                duration: 0.7,
              }}
              className="
                text-[43px]
                font-extrabold
                leading-[1.05]
                tracking-[-2.5px]
                sm:text-5xl
                lg:text-[70px]
              "
            >

              Continue your

              <br />

              learning

              <br />

              <span
                className="
                  text-[#BCEBDC]
                "
              >
                journey.
              </span>

            </motion.h1>


            <motion.p
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 0.7,
              }}
              className="
                mt-7
                max-w-[480px]
                text-sm
                leading-7
                text-white/75
                sm:text-base
              "
            >
              Sign in to access your personalized
              learning experience and continue
              where you left off.
            </motion.p>


            {/* Features */}

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
                delay: 0.9,
              }}
              className="
                mt-9
                hidden
                space-y-4
                sm:block
              "
            >

              {[
                "Personalized learning experience",
                "Track your learning progress",
                "Learn with your community",
              ].map((feature, index) => (

                <motion.div
                  key={feature}
                  initial={{
                    opacity: 0,
                    x: -15,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: 1 + index * 0.12,
                  }}
                  className="
                    flex
                    items-center
                    gap-3
                    text-sm
                    text-white/90
                  "
                >

                  <span
                    className="
                      flex
                      h-6
                      w-6
                      items-center
                      justify-center
                      rounded-full
                      bg-white/15
                    "
                  >

                    <FiCheck
                      size={13}
                      strokeWidth={3}
                    />

                  </span>

                  {feature}

                </motion.div>

              ))}

            </motion.div>

          </div>

        </motion.section>


        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <section
          className="
            flex
            w-full
            items-center
            justify-center
            px-4
            py-8
            sm:px-8
            lg:w-[48%]
            lg:py-10
          "
        >

          <motion.div
            initial={{
              opacity: 0,
              y: 40,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.7,
              delay: 0.15,
            }}
            className="
              w-full
              max-w-[490px]
              rounded-[28px]
              bg-white
              px-5
              py-8
              shadow-[0_30px_80px_rgba(0,60,45,0.25)]
              sm:px-9
            "
          >

            {/* Card Icon */}

            <motion.div
              initial={{
                scale: 0,
              }}
              animate={{
                scale: 1,
              }}
              transition={{
                delay: 0.45,
                type: "spring",
                stiffness: 180,
              }}
              className="
                mx-auto
                mb-5
                flex
                h-[70px]
                w-[70px]
                items-center
                justify-center
                rounded-full
                bg-[#D8F3E9]
              "
            >

              <div
                className="
                  flex
                  h-[52px]
                  w-[52px]
                  items-center
                  justify-center
                  rounded-full
                  bg-[#00956F]
                  text-white
                "
              >

                <FiShield
                  size={26}
                />

              </div>

            </motion.div>


            {/* Heading */}

            <div
              className="
                mb-7
                text-center
              "
            >

              <h2
                className="
                  text-[27px]
                  font-extrabold
                  tracking-tight
                  text-[#17221F]
                "
              >
                Welcome Back
              </h2>

              <p
                className="
                  mt-2
                  text-xs
                  leading-5
                  text-[#7A8783]
                "
              >
                Sign in to continue to your
                EduBridge account.
              </p>

            </div>


            {/* =================================================
                FORM
            ================================================= */}

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* =================================================
                  EMAIL

                  IMPORTANT:
                  type="text", NOT type="email"

                  This prevents browser's native
                  "Please include an @" popup.
              ================================================= */}

              <Input
                label="Email"
                name="email"
                type="text"
                placeholder="Enter your email"
                icon={<FiMail />}
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />


              {/* =================================================
                  PASSWORD
              ================================================= */}

              <PasswordInput
                value={formData.password}
                onChange={handleChange}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                error={errors.password}
              />


              {/* =================================================
                  REMEMBER ME
              ================================================= */}

              <button
                type="button"
                onClick={() =>
                  setRememberMe(!rememberMe)
                }
                className="
                  flex
                  items-center
                  gap-2
                  pt-1
                  text-xs
                  text-[#6F7C78]
                "
              >

                <span
                  className={`
                    flex
                    h-4
                    w-4
                    items-center
                    justify-center
                    rounded
                    border

                    ${
                      rememberMe
                        ? `
                          border-[#008F6B]
                          bg-[#008F6B]
                          text-white
                        `
                        : `
                          border-[#C8D8D2]
                          bg-white
                        `
                    }
                  `}
                >

                  {rememberMe && (
                    <FiCheck
                      size={11}
                      strokeWidth={3}
                    />
                  )}

                </span>

                Remember me

              </button>


              {/* =================================================
                  SIGN IN BUTTON
              ================================================= */}

              <motion.button
                whileHover={{
                  y: loading ? 0 : -2,
                }}
                whileTap={{
                  scale: loading ? 1 : 0.98,
                }}
                disabled={loading}
                type="submit"
                className="
                  mt-2
                  flex
                  h-[50px]
                  w-full
                  items-center
                  justify-between
                  rounded-xl
                  bg-[#008F6B]
                  px-5
                  text-sm
                  font-bold
                  text-white
                  shadow-[0_8px_20px_rgba(0,143,107,0.25)]
                  transition-colors
                  hover:bg-[#007D5E]
                  disabled:cursor-not-allowed
                  disabled:opacity-70
                "
              >

                <span>
                  {loading
                    ? "Signing In..."
                    : "Sign In"}
                </span>

                {!loading && (
                  <FiArrowRight
                    size={20}
                  />
                )}

              </motion.button>

            </form>


            {/* Create Account */}

            <div
              className="
                mt-6
                border-t
                border-[#EDF0EF]
                pt-5
                text-center
                text-xs
                text-[#7D8985]
              "
            >

              Don't have an account?

              <button
                onClick={() => navigate("/signup")}
                              
                className="
                  ml-1
                  cursor-pointer
                  font-bold
                  text-[#008F6B]
                  hover:text-[#006f55]
                "
              >
                Create Account
              </button>

            </div>

          </motion.div>

        </section>

      </div>


      {/* =================================================
          TOAST
      ================================================= */}

     

    </div>
  );
}


/* =========================================================
   REUSABLE INPUT
========================================================= */

function Input({
  label,
  name,
  type = "text",
  placeholder,
  icon,
  value,
  onChange,
  error,
}) {

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.3,
      }}
    >

      {/* Label */}

      <label
        className="
          mb-1.5
          block
          text-xs
          font-bold
          text-[#36423E]
        "
      >
        {label}
      </label>


      {/* Input */}

      <div
        className={`
          flex
          h-[47px]
          items-center
          rounded-[11px]
          border
          bg-[#FBFDFC]
          px-3
          transition-all

          ${
            error
              ? `
                border-red-400
                ring-4
                ring-red-100
              `
              : `
                border-[#D6E5DF]
                focus-within:border-[#009B72]
                focus-within:ring-4
                focus-within:ring-[#009B72]/10
              `
          }
        `}
      >

        {/* Icon */}

        <span
          className={`
            flex
            w-6

            ${
              error
                ? "text-red-500"
                : "text-[#00936D]"
            }
          `}
        >
          {icon}
        </span>


        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
          className="
            h-full
            w-full
            bg-transparent
            text-sm
            text-[#1C2925]
            outline-none
            placeholder:text-[#A5B0AC]
          "
        />

      </div>


      {/* Error */}

      {error && (
        <ErrorMessage
          message={error}
        />
      )}

    </motion.div>
  );
}


/* =========================================================
   PASSWORD INPUT
========================================================= */

function PasswordInput({
  value,
  onChange,
  showPassword,
  setShowPassword,
  error,
}) {

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.3,
      }}
    >

      {/* Label */}

      <label
        className="
          mb-1.5
          block
          text-xs
          font-bold
          text-[#36423E]
        "
      >
        Password
      </label>


      {/* Input */}

      <div
        className={`
          flex
          h-[47px]
          items-center
          rounded-[11px]
          border
          bg-[#FBFDFC]
          px-3
          transition-all

          ${
            error
              ? `
                border-red-400
                ring-4
                ring-red-100
              `
              : `
                border-[#D6E5DF]
                focus-within:border-[#009B72]
                focus-within:ring-4
                focus-within:ring-[#009B72]/10
              `
          }
        `}
      >

        {/* Lock Icon */}

        <span
          className={`
            flex
            w-6

            ${
              error
                ? "text-red-500"
                : "text-[#00936D]"
            }
          `}
        >

          <FiLock size={15} />

        </span>


        {/* Password */}

        <input
          type={
            showPassword
              ? "text"
              : "password"
          }
          name="password"
          placeholder="Enter your password"
          value={value}
          onChange={onChange}
          required
          className="
            h-full
            w-full
            bg-transparent
            text-sm
            text-[#1C2925]
            outline-none
            placeholder:text-[#A5B0AC]
          "
        />


        {/* Show / Hide */}

        <button
          type="button"
          onClick={() =>
            setShowPassword(
              !showPassword
            )
          }
          className={`
            ml-2

            ${
              error
                ? "text-red-500"
                : "text-[#008F6B]"
            }
          `}
        >

          {showPassword ? (
            <FiEyeOff size={17} />
          ) : (
            <FiEye size={17} />
          )}

        </button>

      </div>


      {/* Error */}

      {error && (
        <ErrorMessage
          message={error}
        />
      )}

    </motion.div>
  );
}


/* =========================================================
   ERROR MESSAGE
========================================================= */

function ErrorMessage({
  message,
}) {

  return (
    <motion.p
      initial={{
        opacity: 0,
        y: -4,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="
        mt-1
        text-[11px]
        font-medium
        text-red-500
      "
    >
      {message}
    </motion.p>
  );
}