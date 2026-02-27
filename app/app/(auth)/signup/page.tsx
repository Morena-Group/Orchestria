"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Zap, Loader2, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div
        className="rounded-2xl border p-8 backdrop-blur-xl text-center"
        style={{
          backgroundColor: "rgba(12, 12, 18, 0.6)",
          borderColor: "rgba(200, 169, 110, 0.08)",
          borderTop: "1px solid rgba(201, 169, 110, 0.12)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
        }}
      >
        <CheckCircle2
          size={40}
          className="mx-auto mb-4"
          style={{ color: "var(--color-accent)" }}
        />
        <h2 className="text-lg font-bold text-text-primary mb-2">
          Check your email
        </h2>
        <p className="text-sm text-text-muted mb-6">
          We sent a confirmation link to <strong className="text-text-primary">{email}</strong>.
          Click the link to activate your account.
        </p>
        <Link
          href="/login"
          className="inline-block px-6 py-2.5 rounded-lg text-sm font-semibold text-accent-fg btn-primary-gradient"
        >
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border p-8 backdrop-blur-xl"
      style={{
        backgroundColor: "rgba(12, 12, 18, 0.6)",
        borderColor: "rgba(200, 169, 110, 0.08)",
        borderTop: "1px solid rgba(201, 169, 110, 0.12)",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
      }}
    >
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center bg-accent">
          <Zap size={20} className="text-accent-fg" />
        </div>
        <h1 className="text-xl font-bold text-text-primary">Create account</h1>
        <p className="text-sm text-text-muted mt-1">
          Start orchestrating AI agents
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none text-text-primary placeholder:text-text-muted glass-input focus:border-accent transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none text-text-primary placeholder:text-text-muted glass-input focus:border-accent transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none text-text-primary placeholder:text-text-muted glass-input focus:border-accent transition-colors"
          />
        </div>

        {error && (
          <div
            className="px-3 py-2 rounded-lg text-xs"
            style={{
              backgroundColor: "rgba(248, 113, 113, 0.1)",
              color: "var(--color-error)",
              border: "1px solid rgba(248, 113, 113, 0.2)",
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg text-sm font-semibold text-accent-fg btn-primary-gradient flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
        >
          {loading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      {/* Footer */}
      <p className="text-center text-xs text-text-muted mt-6">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-accent hover:underline font-medium"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
