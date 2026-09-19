import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center">
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <span
          className="material-symbols-outlined text-primary text-[56px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          explore_off
        </span>
      </div>

      <h1 className="text-6xl font-black text-primary mb-2">404</h1>
      <h2 className="text-2xl font-extrabold text-on-surface mb-2">
        Page Not Found
      </h2>
      <p className="text-on-surface-variant mb-8 max-w-md">
        The page you are looking for does not exist or has been moved. Let&apos;s get you back on track!
      </p>

      <Link
        href="/"
        className="px-6 py-3 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90 transition-opacity inline-flex items-center gap-2"
      >
        <span className="material-symbols-outlined text-[20px]">home</span>
        Back to Home
      </Link>
    </div>
  );
}
