"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Zap, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

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
        <h1 className="text-xl font-bold text-text-primary">Welcome back</h1>
        <p className="text-sm text-text-muted mt-1">Sign in to Orchestria</p>
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
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      {/* Footer */}
      <p className="text-center text-xs text-text-muted mt-6">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-accent hover:underline font-medium"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
