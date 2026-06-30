import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addItemToLocal,
  getItemFromLocal,
  showPopups,
  getCurrentDateTime,
  encryptPassword,
} from "../../../utils/utils";

export const Register = () => {
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const rules = {
    fullname: (value) => {
      if (!value.trim()) return "Name required";
      return "";
    },

    username: (value) => {
      if (!value.trim()) return "Username required";

      if (value.length < 4) return "Username must contain minimum 4 characters";

      return "";
    },

    email: (value) => {
      if (!value.trim()) return "Email required";

      if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email";

      return "";
    },

    password: (value) => {
      if (!value) return "Password required";

      if (value.length < 6) return "Password must contain minimum 6 characters";

      return "";
    },

    confirmPassword: (value) => {
      const password = document.getElementById("password").value;

      if (!value) return "Confirm password required";

      if (value !== password) return "Passwords do not match";

      return "";
    },

    termsAgree: (value) => {
      if (!value) return "Accept terms and conditions";

      return "";
    },
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    const fieldValue = type === "checkbox" ? checked : value;

    if (rules[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: rules[name](fieldValue),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const data = Object.fromEntries(formData);

    data.termsAgree = formData.has("termsAgree");

    const validationErrors = {};

    Object.keys(rules).forEach((field) => {
      const value = data[field] || "";

      const error = rules[field](value);

      if (error) {
        validationErrors[field] = error;
      }
    });

    const users = getItemFromLocal("Users");

    const usernameAlreadyExists = users.some(
      (user) =>
        user.username.toLowerCase() === data.username.trim().toLowerCase(),
    );

    if (usernameAlreadyExists) {
      validationErrors.username = "Username already exists";
    }

    const emailAlreadyExists = users.some(
      (user) => user.email.toLowerCase() === data.email.trim().toLowerCase(),
    );

    if (emailAlreadyExists) {
      validationErrors.email = "Email already exists";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const encryptedPassword = await encryptPassword(data.password);

    const user = {
      fullname: data.fullname.trim(),
      username: data.username.trim(),
      email: data.email.trim().toLowerCase(),
      password: encryptedPassword,
      createdAt: getCurrentDateTime(),
    };

    const result = addItemToLocal("Users", user);

    if (result) {
      showPopups("Account created successfully", true);
      e.target.reset();
      setErrors({});
      navigate("/login");
    } else {
      showPopups("Unable to create account", false);
    }

    console.log("SUCCESS", user);
  };

  const fieldClass =
    "relative mt-1 flex h-10 w-full items-center overflow-hidden rounded-lg border border-[#e3dcdc]";
  const inputClass = "h-full w-full border-none pl-3 outline-none text-[11px]";
  const errorClass = "mb-3 min-h-4 text-xs leading-4 text-[red]";
  const eyeButtonClass =
    "absolute right-3 flex h-full shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent text-[#bbb] outline-none";

  return (
    <>
      <style>{`
        .register-password-input::-ms-reveal,
        .register-password-input::-ms-clear {
          display: none;
        }
      `}</style>

      <div className="mb-4 mt-4 flex flex-col items-center text-center max-[800px]:mt-5">
        <div className="mb-3.5 flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(0deg,rgba(110,36,214,1)_35%,rgba(187,39,207,1)_100%)]">
          <img
            src="/assets/coffee.png"
            alt="coffee icon"
            className="mb-3 w-[75px] p-2"
          />
        </div>

        <h2 className="mb-1 text-xl font-bold text-[rgb(15,15,15)]">
          Create Your Account
        </h2>

        <p className="text-[13px] text-[rgb(158,154,154)]">
          Join POS Cafe and start managing your business smarter.
        </p>
      </div>

      <form
        className="w-[67%] text-[11px] max-[1100px]:w-[75%] max-[900px]:w-[85%] max-[800px]:w-[80%] [&_label]:font-semibold"
        onSubmit={handleSubmit}
        id="form"
      >
        <label htmlFor="fullname">First Name</label>

        <div className={fieldClass}>
          <input
            className={inputClass}
            type="text"
            id="fullname"
            name="fullname"
            placeholder="Enter your full name"
            autoComplete="off"
            onChange={handleChange}
          />
        </div>

        <div className={errorClass}>{errors.fullname}</div>

        <label htmlFor="username">Username</label>

        <div className={fieldClass}>
          <input
            className={inputClass}
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            autoComplete="off"
            onChange={handleChange}
          />
        </div>

        <div className={errorClass}>{errors.username}</div>

        <label htmlFor="email">Email Address</label>

        <div className={fieldClass}>
          <input
            className={inputClass}
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email address"
            autoComplete="off"
            onChange={handleChange}
          />
        </div>

        <div className={errorClass}>{errors.email}</div>

        <label htmlFor="password">Create Password</label>

        <div className={fieldClass}>
          <input
            className={`${inputClass} register-password-input`}
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder="Create your password"
            autoComplete="off"
            onChange={handleChange}
          />

          <button
            type="button"
            className={eyeButtonClass}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            <img
              src={
                showPassword
                  ? "/assets/icons/eye-open.svg"
                  : "/assets/icons/eye-slash.svg"
              }
              alt={showPassword ? "hide password" : "show password"}
              width="16"
              height="16"
            />
          </button>
        </div>

        <div className={errorClass}>{errors.password}</div>

        <label htmlFor="Cpassword">Confirm Password</label>

        <div className={fieldClass}>
          <input
            className={`${inputClass} register-password-input`}
            type={showConfirmPassword ? "text" : "password"}
            id="Cpassword"
            name="confirmPassword"
            placeholder="Confirm your password"
            autoComplete="off"
            onChange={handleChange}
          />

          <button
            type="button"
            className={eyeButtonClass}
            onClick={() => setShowConfirmPassword((prev) => !prev)}
          >
            <img
              src={
                showConfirmPassword
                  ? "/assets/icons/eye-open.svg"
                  : "/assets/icons/eye-slash.svg"
              }
              alt={showConfirmPassword ? "hide password" : "show password"}
              width="16"
              height="16"
            />
          </button>
        </div>

        <div className={errorClass}>{errors.confirmPassword}</div>

        <div className="my-3 flex">
          <input
            type="checkbox"
            className="mr-3 h-4 w-4"
            id="Terms_agree"
            name="termsAgree"
            defaultChecked
            onChange={handleChange}
          />

          <label htmlFor="Terms_agree" className="text-[11px]">
            I agree to the
            <span className="font-bold text-[rgb(108,43,217)] no-underline">
              Terms and Conditions
            </span>
            and
            <span className="font-bold text-[rgb(108,43,217)] no-underline">
              Privacy Policy
            </span>
          </label>
        </div>

        <div className={errorClass}>{errors.termsAgree}</div>

        <button className="flex h-[45px] w-full cursor-pointer items-center justify-center gap-2.5 rounded-lg border-0 bg-[linear-gradient(90deg,rgba(110,36,214,1)_35%,rgb(144,39,209)_100%)] text-[11px] font-medium tracking-[0.1px] text-white transition-all duration-500 ease-in-out hover:scale-[1.01] hover:bg-[linear-gradient(270deg,rgba(110,36,214,1)_35%,rgb(144,39,209)_100%)]">
          Sign In
        </button>

        <div className="mt-5 text-center text-xs text-[rgb(100,96,130)]">
          Already have an account?
          <span className="cursor-pointer">
            <a
              className="font-bold text-[rgb(108,43,217)] no-underline hover:underline"
              onClick={() => navigate("/login")}
            >
              Sign In
            </a>
          </span>
        </div>
      </form>
    </>
  );
};
