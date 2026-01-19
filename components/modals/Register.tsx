"use client";
import React, { useState } from "react";
import useAuth from "@/hooks/useAuth";
import useUser from "@/hooks/useUser";
import { UserDB } from "@/types/Types";

export default function Register() {
  const { signUserUp, signUserIn } = useAuth();
  const { createUserInDB } = useUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password length
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    try {
      // 1. Sign up the user
      const signUpResult = await signUserUp(email, password);
      if (!signUpResult.success) {
        setError(signUpResult.message);
        setLoading(false);
        return;
      }

      // 2. Sign in the user to create a session
      const signInResult = await signUserIn(email, password);
      if (!signInResult.success) {
        setError(signInResult.message);
        setLoading(false);
        return;
      }

      // 3. Create user in database
      const newUser: UserDB = {
        name: name,
        email: email,
      };

      const createUserResult = await createUserInDB(newUser, signUpResult.data);
      if (!createUserResult.success) {
        setError(
          "Account created but failed to save profile: " +
            createUserResult.message,
        );
        setLoading(false);
        return;
      }

      // Success! Close the modal
      const modal = document.getElementById("register");
      const bootstrap = require("bootstrap");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      if (modalInstance) {
        modalInstance.hide();
      }

      // Reset form
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // Redirect to account page since user is now logged in
      window.location.href = "/my-account";
    } catch (err: any) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal modalCentered fade modal-log" id="register">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <span
            className="icon icon-close btn-hide-popup"
            data-bs-dismiss="modal"
          />
          <div className="modal-log-wrap list-file-delete">
            <h5 className="title fw-semibold">Sign Up</h5>
            <form onSubmit={handleSubmit} className="form-log">
              <div className="form-content">
                {error && (
                  <div className="alert alert-danger mb-3" role="alert">
                    {error}
                  </div>
                )}
                <fieldset>
                  <label className="fw-semibold body-md-2">Full Name *</label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </fieldset>
                <fieldset>
                  <label className="fw-semibold body-md-2">
                    Email address *
                  </label>
                  <input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </fieldset>
                <fieldset className="position-relative">
                  <label className="fw-semibold body-md-2"> Password * </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password (min 8 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                  <span
                    className="position-absolute text-primary"
                    style={{
                      right: "15px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      marginTop: "12px",
                      fontSize: "12px",
                      fontWeight: "600",
                      userSelect: "none",
                    }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </span>
                </fieldset>
                <fieldset className="position-relative">
                  <label className="fw-semibold body-md-2">
                    Confirm Password *
                  </label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                  <span
                    className="position-absolute text-primary"
                    style={{
                      right: "15px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      marginTop: "12px",
                      fontSize: "12px",
                      fontWeight: "600",
                      userSelect: "none",
                    }}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </span>
                </fieldset>
              </div>
              <button
                type="submit"
                className="tf-btn w-100 text-white"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Sign Up"}
              </button>
              <p className="body-text-3 text-center">
                Already have an account?
                <a href="#log" data-bs-toggle="modal" className="text-primary">
                  Sign in
                </a>
              </p>
            </form>
            <div className="orther-log text-center">
              <span className="br-line bg-gray-5" />
              <p className="caption text-main-2">Or sign up with</p>
            </div>
            <ul className="list-log">
              <li>
                <a href="#" className="tf-btn btn-line w-100">
                  <i className="icon icon-facebook-2" />
                  <span className="body-md-2 fw-semibold">Facebook</span>
                </a>
              </li>
              <li>
                <a href="#" className="tf-btn btn-line w-100">
                  <i className="icon icon-google" />
                  <span className="body-md-2 fw-semibold">Google</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
