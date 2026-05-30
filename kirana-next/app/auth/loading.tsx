/**
 * loading.tsx — Auth Module Loading Skeleton
 *
 * Next.js automatically renders this while the auth page is loading
 * (e.g. during a slow navigation or server component fetch).
 * This is a Server Component — no "use client" needed.
 */
export default function AuthLoading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--auth-muted-bg)" }}
    >
      <div className="w-full max-w-md animate-pulse space-y-4">
        {/* Logo skeleton */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <div
            className="h-14 w-14 rounded-full"
            style={{ background: "var(--auth-border)" }}
          />
          <div
            className="h-6 w-40 rounded"
            style={{ background: "var(--auth-border)" }}
          />
          <div
            className="h-4 w-32 rounded"
            style={{ background: "var(--auth-border)" }}
          />
        </div>

        {/* Card skeleton */}
        <div
          className="rounded-xl border p-5 space-y-4"
          style={{
            background: "var(--auth-card-bg)",
            borderColor: "var(--auth-border)",
          }}
        >
          {/* Field skeletons */}
          {[1, 2].map((i) => (
            <div key={i} className="space-y-1.5">
              <div
                className="h-3 w-24 rounded"
                style={{ background: "var(--auth-border)" }}
              />
              <div
                className="h-10 w-full rounded"
                style={{ background: "var(--auth-border)" }}
              />
            </div>
          ))}

          {/* Button skeleton */}
          <div
            className="h-10 w-full rounded"
            style={{ background: "var(--auth-primary-bg)", opacity: 0.4 }}
          />
        </div>

        {/* Demo hint skeleton */}
        <div
          className="h-16 w-full rounded-lg"
          style={{ background: "var(--auth-demo-bg)", opacity: 0.6 }}
        />
      </div>
    </div>
  );
}
