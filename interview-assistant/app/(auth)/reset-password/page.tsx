"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/firebase/auth";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await resetPassword(email);
      setMessage("Check your email for password reset instructions");
      setEmail(""); // Clear the email field
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to reset password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="pb-12 text-center">
            <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Reset your password
            </h1>
          </div>
          {/* Contact form */}
          <form className="mx-auto max-w-[400px]" onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 rounded-md bg-red-500/10 p-3 text-sm text-red-500">
                {error}
              </div>
            )}
            {message && (
              <div className="mb-4 rounded-md bg-green-500/10 p-3 text-sm text-green-500">
                {message}
              </div>
            )}
            <div>
              <label
                className="mb-1 block text-sm font-medium text-indigo-200/65"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                className="form-input w-full"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mt-6">
              <button 
                type="submit"
                disabled={loading}
                className="btn w-full bg-linear-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%] disabled:opacity-70"
              >
                {loading ? "Processing..." : "Reset Password"}
              </button>
            </div>
            <div className="mt-4 text-center">
              <Link href="/signin" className="text-sm text-indigo-400 hover:underline">
                Back to Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}