import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiLock,
  FiBookOpen,
  FiAtSign,
  FiArrowRight,
  FiUsers,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    className: "",
    email: "",
    password: "",
    role: "student",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove only that field's error
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // ==========================================
  // FRONTEND VALIDATION
  // ==========================================

  const validateForm = () => {
    const newErrors = {};

    // Name
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Username
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.trim().length < 3) {
      newErrors.username =
        "Username must be at least 3 characters";
    }

    // Class
    if (!formData.className.trim()) {
      newErrors.className = "Class is required";
    } else if (!/^\d+$/.test(formData.className.trim())) {
      newErrors.className =
        "Class must contain only numbers";
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim()
      )
    ) {
      newErrors.email = "Enter a valid email";
    }

    // Password
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password =
        "Password must be at least 8 characters";
    }

    // Role
    if (!formData.role) {
      newErrors.role = "Please select a role";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // First validate frontend
    const isValid = validateForm();

    // DO NOT SEND API REQUEST
    // if frontend validation fails
    if (!isValid) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      setLoading(true);

      // ========================================
      // FAKE API REQUEST
      // Replace with real API later
      // ========================================

      const response = await fakeSignupApi(formData);

      toast.success(response.message);

      // Navigate to signin after success
      setTimeout(() => {
        navigate("/signin");
      }, 1000);
    } catch (error) {
      // ========================================
      // BACKEND ERROR
      // ========================================

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Signup failed";

      toast.error(message);

      // If backend sends field-specific errors
      if (error?.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#008F6B]">
      {/* ========================================
          BACKGROUND PATTERN
      ======================================== */}

      <div className="pointer-events-none absolute inset-0">
        {/* Large circle */}

        <div
          className="
            absolute
            -left-64
            -top-64
            h-[650px]
            w-[650px]
            rounded-full
            border
            border-white/10
          "
        />

        {/* Small circle */}

        <div
          className="
            absolute
            -left-40
            -top-40
            h-[430px]
            w-[430px]
            rounded-full
            border
            border-white/10
          "
        />

        {/* Bottom right */}

        <div
          className="
            absolute
            -bottom-72
            -right-72
            h-[650px]
            w-[650px]
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
            top-[20%]
            grid
            grid-cols-5
            gap-4
            opacity-20
          "
        >
          {Array.from({ length: 25 }).map((_, index) => (
            <span
              key={index}
              className="h-1.5 w-1.5 rounded-full bg-white"
            />
          ))}
        </div>
      </div>

      {/* ========================================
          CONTENT
      ======================================== */}

      <div
        className="
          relative
          z-10
          flex
          min-h-screen
          items-center
          justify-center
          px-4
          py-10
        "
      >
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="
            w-full
            max-w-[500px]
            rounded-3xl
            bg-white
            p-6
            shadow-2xl
            sm:p-8
          "
        >
          {/* ======================================
              HEADER
          ====================================== */}

          <div className="mb-7 text-center">
            <div
              className="
                mx-auto
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                bg-[#E2F5EF]
                text-[#008F6B]
              "
            >
              <FiBookOpen size={24} />
            </div>

            <h1
              className="
                mt-4
                text-2xl
                font-extrabold
                text-[#17221F]
              "
            >
              Create your account
            </h1>

            <p
              className="
                mt-2
                text-sm
                text-[#7A8783]
              "
            >
              Start your personalized learning journey
            </p>
          </div>

          {/* ======================================
              FORM
          ====================================== */}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* NAME */}

            <InputField
              icon={FiUser}
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              error={errors.name}
            />

            {/* USERNAME */}

            <InputField
              icon={FiAtSign}
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              error={errors.username}
            />

            {/* CLASS */}

            <InputField
              icon={FiBookOpen}
              label="Class"
              name="className"
              value={formData.className}
              onChange={handleChange}
              placeholder="Enter your class"
              error={errors.className}
            />

            {/* EMAIL */}

            <InputField
              icon={FiMail}
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              type="text"
              error={errors.email}
            />

            {/* PASSWORD */}

            <InputField
              icon={FiLock}
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 8 characters"
              type="password"
              error={errors.password}
            />

            {/* ====================================
                ROLE
            ==================================== */}

            <div>
              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-[#34423D]
                "
              >
                Role
              </label>

              <div className="grid grid-cols-2 gap-3">
                {/* STUDENT */}

                <RoleButton
                  active={formData.role === "student"}
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      role: "student",
                    }));

                    setErrors((prev) => ({
                      ...prev,
                      role: "",
                    }));
                  }}
                  icon={FiBookOpen}
                  title="Student"
                />

                {/* TEACHER */}

                <RoleButton
                  active={formData.role === "teacher"}
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      role: "teacher",
                    }));

                    setErrors((prev) => ({
                      ...prev,
                      role: "",
                    }));
                  }}
                  icon={FiUsers}
                  title="Teacher"
                />
              </div>

              {errors.role && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.role}
                </p>
              )}
            </div>

            {/* ====================================
                SUBMIT BUTTON
            ==================================== */}

            <button
              type="submit"
              disabled={loading}
              className="
                mt-3
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#008F6B]
                py-3.5
                text-sm
                font-bold
                text-white
                shadow-lg
                transition
                hover:bg-[#007A5B]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading ? (
                "Creating account..."
              ) : (
                <>
                  Create Account
                  <FiArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* ======================================
              SIGN IN LINK
          ====================================== */}

          <p
            className="
              mt-6
              text-center
              text-sm
              text-[#7A8783]
            "
          >
            Already have an account?{" "}
            <Link
              to="/signin"
              className="
                font-bold
                text-[#008F6B]
                hover:underline
              "
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

// ==================================================
// INPUT FIELD
// ==================================================

const InputField = ({
  icon: Icon,
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
}) => {
  return (
    <div>
      <label
        className="
          mb-2
          block
          text-sm
          font-semibold
          text-[#34423D]
        "
      >
        {label}
      </label>

      <div className="relative">
        <Icon
          size={17}
          className={`
            absolute
            left-3
            top-1/2
            -translate-y-1/2

            ${
              error
                ? "text-red-500"
                : "text-[#8B9893]"
            }
          `}
        />

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            w-full
            rounded-xl
            border
            bg-white
            py-3
            pl-10
            pr-4
            text-sm
            text-[#17221F]
            outline-none
            transition

            placeholder:text-[#A6B0AC]

            ${
              error
                ? `
                  border-red-500
                  focus:border-red-500
                  focus:ring-2
                  focus:ring-red-100
                `
                : `
                  border-[#DCE7E3]
                  focus:border-[#008F6B]
                  focus:ring-2
                  focus:ring-[#008F6B]/10
                `
            }
          `}
        />
      </div>

      {error && (
        <p className="mt-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

// ==================================================
// ROLE BUTTON
// ==================================================

const RoleButton = ({
  active,
  onClick,
  icon: Icon,
  title,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex
        items-center
        justify-center
        gap-2
        rounded-xl
        border
        py-3
        text-sm
        font-semibold
        transition

        ${
          active
            ? `
              border-[#008F6B]
              bg-[#E8F7F2]
              text-[#008F6B]
            `
            : `
              border-[#DCE7E3]
              bg-white
              text-[#697671]
              hover:border-[#9BCDBE]
            `
        }
      `}
    >
      <Icon size={17} />

      {title}
    </button>
  );
};

// ==================================================
// FAKE API
// ==================================================

const fakeSignupApi = async (data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("Signup payload:", data);

      
        // To test backend-style errors, uncomment this:

        reject({
          response: {
            data: {
              message: "Username already exists",
              errors: {
                username: "Username already exists",
              },
            },
          },
        });
      
      
      resolve({
        message: "Signup successful!",
      });
    }, 1000);
  });
};

export default SignUp;