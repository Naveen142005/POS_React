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

  return (
    <>
      <div className="login-dots">
        {Array.from({ length: 16 }).map((_, index) => (
          <span className="login-dot" key={index}></span>
        ))}
      </div>

      <div className="login-header">
        <div className="login-form-icon">
          <img src="/assets/coffee.png" alt="coffee icon" />
        </div>

        <h2 className="login-title">Welcome Back!</h2>

        <p>Sign in to continue to POS Cafe</p>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="username" style={{ fontSize: "14px" }}>
          Username
        </label>

        <div className="login-field">
          <div className="login-field-icon">
            <img src="/assets/icons8-user-24.png" alt="" width="22" />
          </div>

          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username or email"
            autoComplete="off"
            onChange={handleChange}
          />
        </div>

        <div className="login-error" id="usernameErr">
          {errors.username}
        </div>

        <label htmlFor="password" style={{ fontSize: "14px" }}>
          Password
        </label>

        <div className="login-field">
          <div className="login-field-icon">
            <img src="/assets/icons8-lock-32.png" alt="" width="22" />
          </div>

          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder="Enter your password"
            autoComplete="off"
            onChange={handleChange}
          />

          <div
            className="login-eye-btn"
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

        <div className="login-error" id="passwordErr">
          {errors.password}
        </div>

        <div className="login-options">
          <div></div>

          <div>
            <a
              href="#"
              style={{
                textDecoration: "none",
                fontSize: "12px",
                fontWeight: "500",
              }}
            >
              Forgot Password?
            </a>
          </div>
        </div>

        <button className="login-submit-btn" type="submit">
          <img src="/assets/icons8-lock-32white.png" alt="" width="22" />
          Sign In
        </button>

        <div className="login-divider">
          <div className="login-divider-line"></div>

          <span>or</span>

          <div className="login-divider-line"></div>
        </div>

        <button
          className="login-reg-btn"
          type="button"
          onClick={() => navigate("/register")}
        >
          <img
            src="/assets/shield-purple.svg"
            className="login-reg-icon login-icon-purple"
            alt=""
          />

          <img
            src="/assets/shield-white.svg"
            className="login-reg-icon login-icon-white"
            alt=""
          />

          Register
        </button>

        <div className="login-copyright">
          &copy; 2024 POS Cafe. All rights reserved.
        </div>
      </form>
    </>
  );
};

export default Login;