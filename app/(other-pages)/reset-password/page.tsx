"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { resetPassword } = useAuth();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  useEffect(() => {
    if (!userId || !secret) {
      setMessage({
        type: "error",
        text: "Invalid reset link. Please request a new password reset.",
      });
    }
  }, [userId, secret]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage({
        type: "error",
        text: "Passwords do not match.",
      });
      return;
    }

    if (password.length < 8) {
      setMessage({
        type: "error",
        text: "Password must be at least 8 characters long.",
      });
      return;
    }

    if (!userId || !secret) {
      setMessage({
        type: "error",
        text: "Invalid reset link. Please request a new password reset.",
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    const result = await resetPassword(userId, secret, password);

    if (result.success) {
      setMessage({
        type: "success",
        text: "Password reset successfully! Redirecting...",
      });
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } else {
      setMessage({
        type: "error",
        text: result.message || "Failed to reset password. Please try again.",
      });
    }

    setLoading(false);
  };

  const isFormDisabled = loading || !userId || !secret;

  return (
    <section className="tf-sp-2">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-5">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 p-md-5">
                <h4 className="fw-semibold text-center mb-4">Reset Password</h4>
                <p className="text-center text-muted mb-4">
                  Enter your new password below.
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
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label fw-medium">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isFormDisabled}
                      minLength={8}
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="confirmPassword"
                      className="form-label fw-medium"
                    >
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={isFormDisabled}
                      minLength={8}
                    />
                  </div>

                  <button
                    type="submit"
                    className="tf-btn w-100 mb-3"
                    disabled={isFormDisabled}
                  >
                    <span className="text-white">
                      {loading ? "Resetting..." : "Reset Password"}
                    </span>
                  </button>
                </form>

                <div className="text-center">
                  <Link href="/forgot-password" className="link text-secondary">
                    Request New Reset Link
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

export default function ResetPassword() {
  return (
    <Suspense fallback={<div className="text-center py-5">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
