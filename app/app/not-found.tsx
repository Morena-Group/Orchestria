import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-deep p-8">
      <div className="max-w-sm text-center">
        <div className="text-6xl font-bold mb-4 text-accent">404</div>
        <h1 className="text-xl font-semibold mb-2 text-text-primary">Page Not Found</h1>
        <p className="text-sm mb-6 text-text-secondary">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 btn-primary-gradient px-6 py-2.5 rounded-lg text-sm font-medium text-accent-fg"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
