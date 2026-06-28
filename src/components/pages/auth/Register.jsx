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
    // alert('helo')
  const navigate = useNavigate();

  // I am thinking that, can I keep only one useState() for handling all the errors? 
  // is it possible... /?


  // Ok. I got an idea... hey.. Can we use obejct, then We can show the errors by key and value. 
  // i think i will work.

  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  // This is map. 
  // to check the errors ok?
  
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
        user.username.toLowerCase() === data.username.trim().toLowerCase()
    );

    if (usernameAlreadyExists) {
      validationErrors.username = "Username already exists";
    }

    const emailAlreadyExists = users.some(
      (user) =>
        user.email.toLowerCase() === data.email.trim().toLowerCase()
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

  return (
    <>
      <div className="reg-header">
        <div className="reg-form-icon">
          <img src="/assets/coffee.png" alt="coffee icon" />
        </div>

        <h2 className="reg-title" style={{ fontSize: "20px" }}>Create Your Account</h2>

        <p>Join POS Cafe and start managing your business smarter.</p>
      </div>

      <form className="reg-form" onSubmit={handleSubmit} id="form">
        <label htmlFor="fullname">First Name</label>

        <div className="reg-field">
          <input
            type="text"
            id="fullname"
            name="fullname"
            placeholder="Enter your full name"
            autoComplete="off"
            onChange={handleChange}
          />
        </div>

        <div className="reg-error">{errors.fullname}</div>

        <label htmlFor="username">Username</label>

        <div className="reg-field">
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            autoComplete="off"
            onChange={handleChange}
          />
        </div>

        <div className="reg-error">{errors.username}</div>

        <label htmlFor="email">Email Address</label>

        <div className="reg-field">
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email address"
            autoComplete="off"
            onChange={handleChange}
          />
        </div>

        <div className="reg-error">{errors.email}</div>

        <label htmlFor="password">Create Password</label>

        <div className="reg-field">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder="Create your password"
            autoComplete="off"
            onChange={handleChange}
          />

          <button
            type="button"
            className="reg-eye-btn"
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

        <div className="reg-error">{errors.password}</div>

        <label htmlFor="Cpassword">Confirm Password</label>

        <div className="reg-field">
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="Cpassword"
            name="confirmPassword"
            placeholder="Confirm your password"
            autoComplete="off"
            onChange={handleChange}
          />

          <button
            type="button"
            className="reg-eye-btn"
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

        <div className="reg-error">{errors.confirmPassword}</div>

        <div className="reg-terms">
          <input
            type="checkbox"
            className="reg-terms-check"
            id="Terms_agree"
            name="termsAgree"
            defaultChecked
            onChange={handleChange}
          />

          <label htmlFor="Terms_agree" style={{ fontSize: "11px" }}>
            I agree to the
            <span className="reg-terms-link">Terms and Conditions</span>
            and
            <span className="reg-terms-link">Privacy Policy</span>
          </label>
        </div>

        <div className="reg-error">{errors.termsAgree}</div>

        <button className="reg-submit-btn">
          Sign In
        </button>

        <div className="reg-login-link">
          Already have an account?
          <span style={{ cursor: "pointer" }}>
            <a onClick={() => navigate("/login")}>Sign In</a>
          </span>
        </div>
      </form>
    </>
  );
};
