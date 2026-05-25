export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex items-start sm:items-center justify-center px-4 py-8">
      {children}
    </div>
  );
}
