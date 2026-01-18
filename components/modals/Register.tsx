"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Register() {
  const { register, user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
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

    const result = await register(email, password, name);
    
    if (result.success) {
      // Close the modal on successful registration
      const modal = document.getElementById("register");
      const bootstrap = require("bootstrap");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      if (modalInstance) {
        modalInstance.hide();
      }
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } else {
      setError(result.error || "Registration failed. Please try again.");
    }
    
    setLoading(false);
  };

  // If user is already logged in, show a different message
  if (user) {
    return (
      <div className="modal modalCentered fade modal-log" id="register">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <span
              className="icon icon-close btn-hide-popup"
              data-bs-dismiss="modal"
            />
            <div className="modal-log-wrap list-file-delete text-center">
              <h5 className="title fw-semibold">You&apos;re already logged in!</h5>
              <p className="body-text-3 mt-3">
                You are logged in as <strong>{user.email}</strong>
              </p>
              <a href="/my-account" className="tf-btn w-100 text-white mt-4" data-bs-dismiss="modal">
                Go to My Account
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                  <label className="fw-semibold body-md-2">
                    Full Name *
                  </label>
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
                <fieldset>
                  <label className="fw-semibold body-md-2"> Password * </label>
                  <input 
                    type="password" 
                    placeholder="Enter your password (min 8 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </fieldset>
                <fieldset>
                  <label className="fw-semibold body-md-2"> Confirm Password * </label>
                  <input 
                    type="password" 
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                  />
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
