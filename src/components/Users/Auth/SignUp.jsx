import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../hooks/AuthProvider";
import handleKeyUp from "../../../helpers/keyEvent";
import usePasswordToggle from "../../../hooks/usePasswordToggle";

function SignUp() {
  const { passwordType, passwordConfirmationType, togglePasswordVisibility } =
    usePasswordToggle();
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();
  const registerOptions = {
    name: {
      required: "Name is required",
      minLength: {
        value: 6,
        message: "Name must be at least 6 characters long",
      },
      maxLength: {
        value: 70,
        message: "Name must not exceed 70 characters",
      },
      pattern: {
        value: /^[a-zA-Z\s]+$/,
        message: "Name should contain only letters",
      },
    },
    email: {
      required: "Email is required",
      minLength: {
        value: 6,
        message: "Email should be at least 6 characters long",
      },
      maxLength: {
        value: 254,
        message: "Email should not exceed 254 characters",
      },
      pattern: {
        value: /^[a-zA-Z0-9._%±]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
        message: "Invalid email format",
      },
    },
    password: {
      required: "Password is required",
      minLength: {
        value: 12,
        message: "Password should be at least 12 characters long",
      },
      pattern: {
        value:
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        message:
          "Password must include at least one lowercase letter, one uppercase letter, one number, and one special character",
      },
    },
    passwordConfirmation: {
      required: "Password confirmation is required",
    },
  };

  async function handleSignUp(userInfo) {
    const formData = new FormData();
    formData.append("name", userInfo.name);
    formData.append("username", userInfo.username);
    formData.append("email", userInfo.email);
    formData.append("password", userInfo.password);
    if (userInfo.profilePicFile && userInfo.profilePicFile[0]) {
      formData.append("profilePicFile", userInfo.profilePicFile[0]);
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/users/add-user`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );
      const data = await response.json();

      if (response.status === 201) {
        setUser(data.user);
        navigate("/");
      } else {
        setError("serverError", {
          type: "custom",
          message: data.message || "Registration failed",
        });
      }
    } catch (error) {
      setError("root.serverError", {
        message: error.message || "Server error, please try again later.",
      });
    }
  }

  return (
    <div>
      <div className="signup-wrapper">
        <hr className="hr-text" data-content="Sign Up" />
        <div className="signup-form">
          <form onSubmit={handleSubmit(handleSignUp)}>
            <input
              style={{
                border: `1px solid ${errors.name ? "red" : "transparent"}`,
                outline: "none",
              }}
              type="text"
              id="title"
              name="name"
              {...register("name", registerOptions.name)}
              placeholder="Name"
            />
            {errors.name && (
              <p className="error-message">{errors.name.message}</p>
            )}

            <input
              style={{
                border: `1px solid ${errors.username ? "red" : "transparent"}`,
                outline: "none",
              }}
              type="text"
              id="username"
              name="username"
              {...register("username")}
              placeholder="Username"
            />
            {errors.username && (
              <p className="error-message">{errors.username.message}</p>
            )}

            <input
              style={{
                border: `1px solid ${errors.email ? "red" : "transparent"}`,
                outline: "none",
              }}
              type="email"
              id="email"
              name="email"
              {...register("email", registerOptions.email)}
              placeholder="Email"
            />
            {errors.email && (
              <p className="error-message">{errors.email.message}</p>
            )}
            <div className="input-container">
              <input
                style={{
                  border: `1px solid ${
                    errors.password ? "red" : "transparent"
                  }`,
                  outline: "none",
                }}
                type={passwordType}
                id="password"
                name="password"
                {...register("password", registerOptions.password)}
                placeholder="Password"
              />
              <img
                className="input-icon"
                data-field="password"
                onClick={() => togglePasswordVisibility("password")}
                id="password-visibility"
                src={`/icon/eye-${
                  passwordType === "password" ? "close" : "open"
                }.png`}
                alt="eye-icon"
              />
            </div>
            {errors.password && (
              <p className="error-message">{errors.password.message}</p>
            )}
            <div className="input-container">
              <input
                style={{
                  border: `1px solid ${
                    errors.passwordConfirmation ? "red" : "transparent"
                  }`,
                  outline: "none",
                }}
                type={passwordConfirmationType}
                id="passwordConfirmation"
                name="passwordConfirmation"
                {...register(
                  "passwordConfirmation",
                  registerOptions.passwordConfirmation
                )}
                placeholder="Confirm password"
                onKeyUp={() =>
                  handleKeyUp(
                    watch("password"),
                    watch("passwordConfirmation"),
                    setError,
                    clearErrors
                  )
                }
              />
              <img
                className="input-icon"
                data-field="passwordConfirmation"
                onClick={() => togglePasswordVisibility("passwordConfirmation")}
                id="password-visibility"
                src={`/icon/eye-${
                  passwordConfirmationType === "password" ? "close" : "open"
                }.png`}
                alt="eye-icon"
              />
            </div>
            {errors.passwordConfirmation && (
              <p className="error-message">
                {errors.passwordConfirmation.message}
              </p>
            )}
            <label htmlFor="profile-pic">Profile Picture (optional)</label>
            <input
              type="file"
              id="profile-pic"
              name="profilePicFile"
              accept="image/png, image/jpeg"
              {...register("profilePicFile")}
            />

            {errors.serverError && (
              <p className="error-message">{errors.serverError.message}</p>
            )}

            {errors.root?.serverError && (
              <p className="error-message">{errors.root.serverError.message}</p>
            )}

            <div className="btn-container">
              <Link to="/login" className="login-link">
                Already have an account? Login
              </Link>
              <input type="submit" value="Sign up" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;