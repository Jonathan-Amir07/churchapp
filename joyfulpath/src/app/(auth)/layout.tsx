import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-dot-pattern flex items-center justify-center p-4 md:p-10 overflow-x-hidden relative">
      {/* Atmospheric floating elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] start-[5%] w-24 h-24 opacity-15 animate-[float_6s_ease-in-out_infinite]">
          <span className="material-symbols-outlined text-primary text-[96px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            sunny
          </span>
        </div>
        <div className="absolute bottom-[15%] end-[8%] w-28 h-28 opacity-10 animate-[float_6s_ease-in-out_infinite_1.5s]">
          <span className="material-symbols-outlined text-secondary text-[112px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            church
          </span>
        </div>
        <div className="absolute top-[20%] end-[12%] w-20 h-20 opacity-15 animate-[float_6s_ease-in-out_infinite_3s]">
          <span className="material-symbols-outlined text-primary text-[80px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            favorite
          </span>
        </div>
        <div className="absolute bottom-[10%] start-[10%] w-20 h-20 opacity-10 animate-[float_6s_ease-in-out_infinite_4.5s]">
          <span className="material-symbols-outlined text-tertiary text-[80px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            star
          </span>
        </div>
      </div>

      {/* Content */}
      <main className="relative z-10 w-full max-w-[480px]">
        {children}
      </main>
    </div>
  );
}
