import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { Topbar } from '@/components/layout/Topbar';
import { MobileNav } from '@/components/layout/MobileNav';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#fdf9f1]" dir="rtl">
      <DashboardSidebar />
      <div className="flex flex-col min-h-screen md:me-64">
        <Topbar />
        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6 overflow-auto">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
