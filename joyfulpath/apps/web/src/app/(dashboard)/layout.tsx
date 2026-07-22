import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { MobileNav } from '@/components/layout/MobileNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar - Desktop Only */}
      <Sidebar />

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header/Topbar */}
        <Topbar />

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto focus:outline-none p-4 md:p-8 pb-20 md:pb-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>

        {/* Bottom Nav - Mobile Only */}
        <MobileNav />
      </div>
    </div>
  );
}
