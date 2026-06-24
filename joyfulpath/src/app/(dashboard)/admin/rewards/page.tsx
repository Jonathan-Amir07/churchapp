'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardTitle, Button, Modal, Input } from '@/components/ui';
import { useAppStore } from '@/stores/app.store';

export default function AdminRewards() {
  const tNav = useTranslations('nav');
  const tRewards = useTranslations('rewards');
  const tCommon = useTranslations('common');

  const { rewards, redemptions, addRewardItem, processRedemption } = useAppStore();
  
  const [activeTab, setActiveTab] = useState<'catalog' | 'queue'>('catalog');
  const [isOpen, setIsOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [selectedRedId, setSelectedRedId] = useState<string | null>(null);
  const [processStatus, setProcessStatus] = useState<'approved' | 'rejected'>('approved');
  const [feedback, setFeedback] = useState('');

  // Form states for new item
  const [title, setTitle] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [pointsCost, setPointsCost] = useState(50);
  const [stock, setStock] = useState(10);
  const [type, setType] = useState<'digital' | 'physical'>('digital');
  const [icon, setIcon] = useState('emoji_events');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !titleAr || !description || !descriptionAr) {
      alert('Error: Please fill all fields!');
      return;
    }

    addRewardItem({
      title,
      titleAr,
      description,
      descriptionAr,
      type,
      pointsCost,
      stock: type === 'digital' ? 9999 : stock,
      icon,
    });

    setIsOpen(false);
    alert(tRewards('addSuccess'));

    // Reset Form
    setTitle('');
    setTitleAr('');
    setDescription('');
    setDescriptionAr('');
    setPointsCost(50);
    setStock(10);
    setType('digital');
    setIcon('emoji_events');
  };

  const openProcessModal = (id: string, status: 'approved' | 'rejected') => {
    setSelectedRedId(id);
    setProcessStatus(status);
    setFeedback('');
    setIsFeedbackOpen(true);
  };

  const handleProcessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRedId) return;

    processRedemption(selectedRedId, processStatus, feedback || undefined);
    setIsFeedbackOpen(false);
    setSelectedRedId(null);
    alert(`Request ${processStatus} successfully!`);
  };

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
            {tNav('rewards')}
          </h1>
          <p className="text-on-surface-variant text-sm">
            Configure the student rewards inventory catalog and process student claims.
          </p>
        </div>
        
        {activeTab === 'catalog' && (
          <Button variant="primary" size="sm" onClick={() => setIsOpen(true)} icon="add_shopping_cart" iconPosition="start">
            {tRewards('addItem')}
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-outline-variant">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`pb-3 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'catalog'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Prizes Catalog ({rewards.length})
        </button>
        <button
          onClick={() => setActiveTab('queue')}
          className={`pb-3 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'queue'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Redemption Requests ({redemptions.filter((r) => r.status === 'pending').length} Pending)
        </button>
      </div>

      {/* Tab 1: Prizes Catalog */}
      {activeTab === 'catalog' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rewards.map((p) => {
            const isAr = tCommon('appName') !== 'JoyfulPath';
            const name = isAr ? p.titleAr : p.title;
            const desc = isAr ? p.descriptionAr : p.description;

            return (
              <Card key={p.id} className="border border-outline-variant bg-surface-container-lowest shadow-sm flex flex-col justify-between">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary/10 text-primary">
                      <span className="material-symbols-outlined text-[24px]">{p.icon}</span>
                    </div>
                    <span className="text-xs font-bold text-outline">
                      {p.type === 'digital' ? 'Digital Item' : tRewards('stockLabel', { stock: p.stock })}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <CardTitle className="text-base font-black text-on-surface leading-tight">
                      {name}
                    </CardTitle>
                    <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                      {desc}
                    </p>
                    <p className="text-xs text-secondary font-black pt-1">
                      {tRewards('cost', { points: p.pointsCost })}
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
      )}

      {/* Tab 2: Redemptions Queue */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          {redemptions.length === 0 ? (
            <div className="p-8 text-center bg-surface-container-lowest border border-outline-variant rounded-2xl">
              <p className="text-sm font-bold text-on-surface-variant">No redemption requests logged.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant text-xs font-extrabold text-on-surface-variant uppercase tracking-wider select-none">
                    <th className="p-4">Student</th>
                    <th className="p-4">Reward Item</th>
                    <th className="p-4">Points Cost</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Requested Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/60 text-xs font-bold text-on-surface">
                  {redemptions.map((red) => (
                    <tr key={red.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                      <td className="p-4">{red.studentName}</td>
                      <td className="p-4">{red.itemTitle}</td>
                      <td className="p-4 text-secondary">{red.pointsCost} pts</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                          red.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                            : red.status === 'rejected'
                              ? 'bg-red-50 text-red-600 border border-red-200'
                              : 'bg-yellow-50 text-yellow-600 border border-yellow-200'
                        }`}>
                          {red.status}
                        </span>
                      </td>
                      <td className="p-4 text-on-surface-variant">
                        {new Date(red.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        {red.status === 'pending' ? (
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs text-error hover:bg-error/5 hover:text-error border-error/20"
                              onClick={() => openProcessModal(red.id, 'rejected')}
                            >
                              Reject
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                              onClick={() => openProcessModal(red.id, 'approved')}
                            >
                              Approve
                            </Button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-outline font-black">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Reward Creator Modal */}
      {isOpen && (
        <Modal isOpen={true} onClose={() => setIsOpen(false)} title={tRewards('addItem')}>
          <form onSubmit={handleCreate} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">Reward Title (English)</label>
                <Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Coloring Book" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">Reward Title (Arabic)</label>
                <Input required value={titleAr} onChange={(e) => setTitleAr(e.target.value)} placeholder="مثال: كتاب تلوين" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">Description (English)</label>
                <Input required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short info text..." />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">Description (Arabic)</label>
                <Input required value={descriptionAr} onChange={(e) => setDescriptionAr(e.target.value)} placeholder="تفاصيل مختصرة..." />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full text-sm p-2 rounded-xl border border-outline-variant bg-surface-container-lowest focus:outline-none focus:border-primary"
                >
                  <option value="digital">Digital cosmetic</option>
                  <option value="physical">Physical prize</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">{tRewards('itemCost')}</label>
                <Input type="number" min={5} max={1000} required value={pointsCost} onChange={(e) => setPointsCost(Number(e.target.value))} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">{tRewards('itemStock')}</label>
                <Input type="number" min={0} max={500} required disabled={type === 'digital'} value={stock} onChange={(e) => setStock(Number(e.target.value))} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">{tRewards('materialIcon')}</label>
                <Input required value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="e.g. book, stars" />
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsOpen(false)}>
                {tCommon('cancel')}
              </Button>
              <Button variant="primary" size="sm" type="submit">
                {tRewards('createItemBtn')}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Process Redemption Feedback Modal */}
      {isFeedbackOpen && (
        <Modal isOpen={true} onClose={() => setIsFeedbackOpen(false)} title={`${processStatus === 'approved' ? 'Approve' : 'Reject'} Redemption`}>
          <form onSubmit={handleProcessSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant">Add Servant Note / Feedback</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Optional comments for the student..."
                rows={3}
                className="w-full text-sm p-3 rounded-xl border border-outline-variant bg-surface-container-lowest focus:outline-none focus:border-primary transition-all resize-none"
              />
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsFeedbackOpen(false)}>
                {tCommon('cancel')}
              </Button>
              <Button variant="primary" size="sm" type="submit" className={processStatus === 'approved' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}>
                Submit Decision
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

