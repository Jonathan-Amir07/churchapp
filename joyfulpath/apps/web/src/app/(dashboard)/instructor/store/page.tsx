'use client';

import { Card, CardContent, Button, PageTransition, StatCard, StaggerContainer, StaggerItem } from '@/components/ui';

export default function InstructorStorePage() {
  const redemptions = [
    { id: '1', studentName: 'John Doe', item: 'Christian Stickers', points: 150, date: 'Oct 20, 2026' },
    { id: '2', studentName: 'Jane Smith', item: '$5 Ice Cream Gift Card', points: 500, date: 'Oct 19, 2026' }
  ];

  return (
    <PageTransition className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
          Blessing Store Fulfillment
        </h1>
        <Button variant="primary" icon="inventory_2">Manage Inventory</Button>
      </div>

      <Card className="border border-outline-variant bg-surface-container-lowest">
        <CardContent className="p-6">
          <h2 className="text-lg font-bold text-on-surface mb-4">Pending Redemptions</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse">
              <thead>
                <tr className="border-b border-outline-variant text-sm text-on-surface-variant">
                  <th className="py-2 text-start">Student</th>
                  <th className="py-2 text-start">Item Redeemed</th>
                  <th className="py-2 text-start">Points Spent</th>
                  <th className="py-2 text-start">Date</th>
                  <th className="py-2 text-end">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {redemptions.map(r => (
                  <tr key={r.id} className="border-b border-outline-variant/50 hover:bg-surface-container transition">
                    <td className="py-3 font-bold text-on-surface">{r.studentName}</td>
                    <td className="py-3 text-on-surface">{r.item}</td>
                    <td className="py-3 font-bold text-secondary">{r.points}</td>
                    <td className="py-3 text-on-surface-variant">{r.date}</td>
                    <td className="py-3 text-end">
                      <Button variant="success" size="sm" icon="check">Mark Fulfilled</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </PageTransition>
  );
}
