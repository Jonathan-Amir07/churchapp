import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface p-4">
      <div className="max-w-md w-full bg-surface-container-lowest rounded-2xl p-8 shadow-sm border border-outline-variant text-center">
        <span className="material-symbols-outlined text-6xl text-error mb-4">block</span>
        <h1 className="text-2xl font-bold text-on-surface mb-2">Access Denied</h1>
        <p className="text-on-surface-variant mb-6">
          You do not have permission to access this page or your account has been deactivated.
        </p>
        <Link 
          href="/login" 
          className="inline-flex items-center justify-center h-10 px-6 rounded-full bg-primary text-on-primary font-medium hover:opacity-90 transition-opacity"
        >
          Return to Login
        </Link>
      </div>
    </div>
  );
}
