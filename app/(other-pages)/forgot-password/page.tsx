"use client";
import React, { useState } from "react";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const result = await forgotPassword(email);

    if (result.success) {
      setMessage({
        type: "success",
        text: "Password reset email sent! Please check your inbox.",
      });
      setEmail("");
    } else {
      setMessage({
        type: "error",
        text: result.message || "Failed to send reset email. Please try again.",
      });
    }

    setLoading(false);
  };

  return (
    <section className="tf-sp-2">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-5">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 p-md-5">
                <h4 className="fw-semibold text-center mb-4">
                  Forgot Password
                </h4>
                <p className="text-center text-muted mb-4">
                  Enter your email address and we&apos;ll send you a link to
                  reset your password.
                </p>

                {message && (
                  <div
                    className={`alert ${
                      message.type === "success"
                        ? "alert-success"
                        : "alert-danger"
                    }`}
                    role="alert"
                  >
                    {message.text}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="email" className="form-label fw-medium">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>

                  <button
                    type="submit"
                    className="tf-btn w-100 mb-3"
                    disabled={loading}
                  >
                    <span className="text-white">
                      {loading ? "Sending..." : "Send Reset Email"}
                    </span>
                  </button>
                </form>

                <div className="text-center">
                  <Link href="/login" className="link text-secondary">
                    Back to Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
