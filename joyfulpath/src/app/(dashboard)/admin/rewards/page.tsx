'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardTitle, CardDescription, Button, Modal, Input } from '@/components/ui';

interface PrizeItem {
  id: string;
  nameEn: string;
  nameAr: string;
  cost: number;
  stock: number;
  icon: string;
  color: string;
}

const INITIAL_PRIZES: PrizeItem[] = [
  {
    id: 'p1',
    nameEn: 'Illustrated Bible Stories Book',
    nameAr: 'كتاب قصص الكتاب المقدس المصور',
    cost: 100,
    stock: 5,
    icon: 'menu_book',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    id: 'p2',
    nameEn: 'Colorful Wooden Cross Keychain',
    nameAr: 'ميدالية مفاتيح خشبية ملونة للصليب',
    cost: 50,
    stock: 12,
    icon: 'vpn_key',
    color: 'bg-orange-100 text-orange-600',
  },
  {
    id: 'p3',
    nameEn: 'Custom Gold Medal Pin',
    nameAr: 'دبوس الميدالية الذهبية المخصصة',
    cost: 150,
    stock: 0,
    icon: 'workspace_premium',
    color: 'bg-yellow-100 text-yellow-600',
  },
];

export default function AdminRewards() {
  const tNav = useTranslations('nav');
  const tRewards = useTranslations('rewards');
  const tCommon = useTranslations('common');

  const [prizes, setPrizes] = useState<PrizeItem[]>(INITIAL_PRIZES);
  const [isOpen, setIsOpen] = useState(false);

  // Form states
  const [nameEn, setNameEn] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [cost, setCost] = useState(50);
  const [stock, setStock] = useState(10);
  const [icon, setIcon] = useState('emoji_events');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEn || !nameAr) {
      alert('Error: Please fill all fields!');
      return;
    }

    const newItem: PrizeItem = {
      id: String(prizes.length + 1),
      nameEn,
      nameAr,
      cost,
      stock,
      icon,
      color: 'bg-primary/10 text-primary',
    };

    setPrizes((prev) => [...prev, newItem]);
    setIsOpen(false);
    alert('Success! Reward item added successfully.');

    // Reset Form
    setNameEn('');
    setNameAr('');
    setCost(50);
    setStock(10);
    setIcon('emoji_events');
  };

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
            {tNav('rewards')}
          </h1>
          <p className="text-on-surface-variant text-sm">
            {tRewards('description')}
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setIsOpen(true)} icon="add_shopping_cart" iconPosition="start">
          {tRewards('addItem')}
        </Button>
      </div>

      {/* Roster of Rewards Items */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {prizes.map((p) => {
          const isAr = tCommon('appName') !== 'JoyfulPath';
          const name = isAr ? p.nameAr : p.nameEn;

          return (
            <Card key={p.id} className="border border-outline-variant bg-surface-container-lowest shadow-sm flex flex-col justify-between">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${p.color}`}>
                    <span className="material-symbols-outlined text-[24px]">{p.icon}</span>
                  </div>
                  <span className="text-xs font-bold text-outline">
                    {p.stock > 0 ? `Stock: ${p.stock}` : tRewards('outOfStock')}
                  </span>
                </div>

                <div className="space-y-1">
                  <CardTitle className="text-base font-black text-on-surface leading-tight">
                    {name}
                  </CardTitle>
                  <p className="text-xs text-secondary font-black">
                    {tRewards('cost', { points: p.cost })}
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="ghost" size="sm" className="h-9 px-3 text-xs">
                    {tCommon('edit')}
                  </Button>
                  <Button variant="outline" size="sm" className="h-9 px-3 text-xs text-error hover:bg-error/5 hover:text-error border-outline-variant/60">
                    {tCommon('delete')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Reward Creator Modal */}
      {isOpen && (
        <Modal isOpen={true} onClose={() => setIsOpen(false)} title={tRewards('addItem')}>
          <form onSubmit={handleCreate} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">Item Name (English)</label>
                <Input required value={nameEn} onChange={(e) => setNameEn(e.target.value)} placeholder="e.g. Coloring Book" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">اسم المكافأة (عربي)</label>
                <Input required value={nameAr} onChange={(e) => setNameAr(e.target.value)} placeholder="مثال: كتاب تلوين" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">{tRewards('itemCost')}</label>
                <Input type="number" min={5} max={1000} required value={cost} onChange={(e) => setCost(Number(e.target.value))} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">{tRewards('itemStock')}</label>
                <Input type="number" min={0} max={500} required value={stock} onChange={(e) => setStock(Number(e.target.value))} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">Material Symbol Icon</label>
                <Input required value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="e.g. key, book" />
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsOpen(false)}>
                {tCommon('cancel')}
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Create Item
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
