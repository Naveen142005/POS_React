import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCurrentUser } from "../../../redux/authSlice";
import {
  getItemFromLocal,
  updateToLocal,
  showPopups,
  encryptPassword,
} from "../../../utils/utils";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const rules = {
    username: (value) => {
      if (!value.trim()) return "Username required";
      return "";
    },

    password: (value) => {
      if (!value) return "Password required";
      return "";
    },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (rules[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: rules[name](value),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    const validationErrors = {};

    Object.keys(rules).forEach((field) => {
      const value = data[field] || "";
      const error = rules[field](value);

      if (error) {
        validationErrors[field] = error;
      }
    });

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const users = getItemFromLocal("Users") || [];

    const encryptedPassword = await encryptPassword(data.password);
    const loginValue = data.username.trim().toLowerCase();

    const user = users.find(
      (user) =>
        (user.username.toLowerCase() === loginValue ||
          user.email.toLowerCase() === loginValue) &&
        user.password === encryptedPassword,
    );

    if (!user) {
      showPopups("Incorrect username or password", false);
      return;
    }

    const currentUser = {
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    };

    updateToLocal("CurrentUser", currentUser);

    dispatch(setCurrentUser(currentUser));

    showPopups("Login successful", true);

    navigate("/dashboard");
  };

  const fieldClass =
    "relative mt-2 flex h-[50px] w-full items-center overflow-hidden rounded-lg border border-[rgb(227,220,220)]";
  const iconClass =
    "flex h-full w-[55px] items-center justify-center bg-[rgba(155,17,197,0.046)]";
  const inputClass = "h-full w-full border-none pl-3 outline-none";

  return (
    <>
      <style>{`
        .login-password-input::-ms-reveal,
        .login-password-input::-ms-clear {
          display: none;
        }
      `}</style>

      <div className="pointer-events-none absolute right-8 top-[26px] z-[5] grid auto-rows-[3px] grid-cols-[repeat(4,3px)] gap-x-2.5 gap-y-2.5">
        {Array.from({ length: 16 }).map((_, index) => (
          <span
            className="h-[3px] w-[3px] rounded-full bg-[#8b4dff] opacity-35"
            key={index}
          ></span>
        ))}
      </div>

      <div className="relative z-[2] mb-7 mt-[30px] flex flex-col items-center text-center max-[800px]:mt-5">
        <div className="mb-3.5 flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(90deg,rgba(110,36,214,1)_35%,rgb(144,39,209)_100%)]">
          <img
            src="/assets/coffee.png"
            alt="coffee icon"
            className="mb-3 w-[75px] p-2"
          />
        </div>

        <h2 className="mb-1 text-[1.6rem] font-bold text-[#0f0f0f]">
          Welcome Back!
        </h2>

        <p className="text-[13px] text-[rgb(158,154,154)]">
          Sign in to continue to POS Cafe
        </p>
      </div>

      <form
        className="relative z-[2] w-[85%] min-[1200px]:w-[58%] max-[1100px]:w-[75%] max-[900px]:w-[85%] max-[800px]:w-[80%]"
        onSubmit={handleSubmit}
      >
        <label htmlFor="username" className="text-sm font-semibold">
          Username
        </label>

        <div className={fieldClass}>
          <div className={iconClass}>
            <img src="/assets/icons8-user-24.png" alt="" width="22" />
          </div>

          <input
            className={inputClass}
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username or email"
            autoComplete="off"
            onChange={handleChange}
          />
        </div>

        <div className="min-h-[18px] text-xs text-[red]" id="usernameErr">
          {errors.username}
        </div>

        <label htmlFor="password" className="text-sm font-semibold">
          Password
        </label>

        <div className={fieldClass}>
          <div className={iconClass}>
            <img src="/assets/icons8-lock-32.png" alt="" width="22" />
          </div>

          <input
            className={`${inputClass} login-password-input`}
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder="Enter your password"
            autoComplete="off"
            onChange={handleChange}
          />

          <div
            className="absolute right-3 flex h-full shrink-0 cursor-pointer items-center justify-center text-[#bbb]"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            <img
              id="eye-icon"
              src={
                showPassword
                  ? "/assets/icons/eye-open.svg"
                  : "/assets/icons/eye-slash.svg"
              }
              alt={showPassword ? "Hide password" : "Show password"}
              width="16"
              height="16"
            />
          </div>
        </div>

        <div className="min-h-[18px] text-xs text-[red]" id="passwordErr">
          {errors.password}
        </div>

        <div className="my-3 flex justify-between">
          <div></div>

          <div>
            <a href="#" className="text-xs font-medium no-underline">
              Forgot Password?
            </a>
          </div>
        </div>

        <button
          className="flex h-[45px] w-full cursor-pointer items-center justify-center gap-2.5 rounded-lg border-0 bg-[linear-gradient(90deg,rgba(110,36,214,1)_35%,rgb(144,39,209)_100%)] text-[15px] font-medium tracking-[0.1px] text-white transition-all duration-500 ease-in-out hover:scale-[1.01] hover:bg-[linear-gradient(270deg,rgba(110,36,214,1)_35%,rgb(144,39,209)_100%)]"
          type="submit"
        >
          <img src="/assets/icons8-lock-32white.png" alt="" width="22" />
          Sign In
        </button>

        <div className="mb-5 mt-0 flex items-center gap-3">
          <div className="h-[1.5px] flex-1 bg-[#e5e5e5]"></div>

          <span className="text-[13px] text-[#aaa]">or</span>

          <div className="h-[1.5px] flex-1 bg-[#e5e5e5]"></div>
        </div>

        <button
          className="group flex h-[45px] w-full cursor-pointer items-center justify-center gap-2.5 rounded-lg border-[1.5px] border-[#6e24d6] bg-transparent font-semibold text-[#6e24d6] transition-all duration-[400ms] ease-in-out hover:scale-[1.01] hover:bg-[linear-gradient(90deg,rgba(110,36,214,1)_35%,rgb(144,39,209)_100%)] hover:text-white"
          type="button"
          onClick={() => navigate("/register")}
        >
          <img
            src="/assets/shield-purple.svg"
            className="h-4 w-4 group-hover:hidden"
            alt=""
          />

          <img
            src="/assets/shield-white.svg"
            className="hidden h-4 w-4 group-hover:block"
            alt=""
          />

          Register
        </button>

        <div className="mt-7 text-center text-xs text-[rgb(189,184,184)]">
          &copy; 2024 POS Cafe. All rights reserved.
        </div>
      </form>
    </>
  );
};

export default Login;
