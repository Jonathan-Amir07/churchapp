'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardTitle, Button, Modal, Input, SearchBar } from '@/components/ui';
import { useAppStore } from '@/stores/app.store';
import { useNotificationStore } from '@/stores/notifications.store';

export default function AdminRewards() {
  const tNav = useTranslations('nav');
  const tRewards = useTranslations('rewards');
  const tCommon = useTranslations('common');

  const [rewards, setRewards] = useState<any[]>([]);
  const [redemptions, setRedemptions] = useState<any[]>([]);
  
  const addToast = useNotificationStore(s => s.addToast);
  
  const [activeTab, setActiveTab] = useState<'catalog' | 'queue'>('catalog');
  const [isOpen, setIsOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [selectedRedId, setSelectedRedId] = useState<string | null>(null);
  const [processStatus, setProcessStatus] = useState<'approved' | 'rejected'>('approved');
  const [feedback, setFeedback] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Form states for new item
  const [title, setTitle] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [pointsCost, setPointsCost] = useState(50);
  const [stock, setStock] = useState(10);
  const [type, setType] = useState<'digital' | 'physical'>('digital');
  const [icon, setIcon] = useState('emoji_events');
  const [imageUrl, setImageUrl] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [resRewards, resReds] = await Promise.all([
        fetch('/api/store/rewards'),
        fetch('/api/store/redemptions/pending')
      ]);
      
      if (resRewards.ok) {
        const data = await resRewards.json();
        setRewards(Array.isArray(data) ? data : data.data || []);
      }
      if (resReds.ok) {
        const data = await resReds.json();
        setRedemptions(Array.isArray(data) ? data : data.data || []);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const filteredRewards = useMemo(() => {
    if (!searchQuery) return rewards;
    const q = searchQuery.toLowerCase();
    return rewards?.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.titleAr && item.titleAr.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q))
    );
  }, [rewards, searchQuery]);

  const filteredRedemptions = useMemo(() => {
    if (!searchQuery) return redemptions;
    const q = searchQuery.toLowerCase();
    return redemptions?.filter(
      (r) =>
        r.studentName.toLowerCase().includes(q) ||
        r.itemTitle.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q)
    );
  }, [redemptions, searchQuery]);

  const handleCreate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !titleAr || !description || !descriptionAr) {
      addToast(tRewards('errorOccurred'), 'error');
      return;
    }

    try {
      const res = await fetch('/api/store/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title, titleAr, description, descriptionAr, pointsCost, stock, type, icon, imageUrl
        })
      });

      if (res.ok) {
        addToast(tRewards('addSuccess'), 'success');
        setIsOpen(false);
        fetchData();

        // Reset Form
        setTitle('');
        setTitleAr('');
        setDescription('');
        setDescriptionAr('');
        setPointsCost(50);
        setStock(10);
        setType('digital');
        setIcon('emoji_events');
        setImageUrl('');
      } else {
        addToast(tRewards('failedProcess'), 'error');
      }
    } catch (error) {
      addToast(tRewards('errorOccurred'), 'error');
    }
  }, [title, titleAr, description, descriptionAr, pointsCost, stock, type, icon, imageUrl, addToast, tRewards, fetchData]);

  const handleProcessSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRedId) return;

    try {
      const action = processStatus === 'approved' ? 'fulfill' : 'reject';
      const res = await fetch(`/api/store/redemptions/${selectedRedId}/${action}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback })
      });

      if (res.ok) {
        addToast(tRewards('processSuccess'), 'success');
        setIsFeedbackOpen(false);
        setSelectedRedId(null);
        setFeedback('');
        fetchData();
      } else {
        addToast(tRewards('failedProcess'), 'error');
      }
    } catch (error) {
      addToast(tRewards('errorOccurred'), 'error');
    }
  }, [selectedRedId, processStatus, feedback, addToast, fetchData, tRewards]);

  const openProcessModal = useCallback((id: string, status: 'approved' | 'rejected') => {
    setSelectedRedId(id);
    setProcessStatus(status);
    setIsFeedbackOpen(true);
  }, []);

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
            {tNav('rewards')}
          </h1>
          <p className="text-on-surface-variant text-sm">
            {tRewards('description')}
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setIsOpen(true)} icon="add" iconPosition="start">
          {tRewards('addItem')}
        </Button>
      </div>

      {/* Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 p-1 bg-surface-container-low rounded-2xl border border-outline-variant/50 w-fit">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
              activeTab === 'catalog'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            {tRewards('catalogTab')} ({rewards.length})
          </button>
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
              activeTab === 'queue'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            {tRewards('queueTab')} ({redemptions.length})
          </button>
        </div>

        <SearchBar
          onSearch={handleSearch}
          placeholder={activeTab === 'catalog' ? tRewards('searchCatalog') : tRewards('searchQueue')}
          resultCount={activeTab === 'catalog' ? filteredRewards.length : filteredRedemptions.length}
          totalCount={activeTab === 'catalog' ? rewards.length : redemptions.length}
          className="w-full sm:w-80"
        />
      </div>

      {/* ── TAB: CATALOG ──────────────────────────────────────────────────────── */}
      {activeTab === 'catalog' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredRewards?.map((item) => (
            <Card key={item.id} className="border border-outline-variant bg-surface-container-lowest shadow-sm flex flex-col justify-between">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-[32px] text-primary">{item.icon}</span>
                    )}
                  </div>
                  <span className="text-xs font-black bg-secondary/10 text-secondary px-2.5 py-1 rounded-full border border-secondary/20">
                    {tRewards('cost', { points: item.pointsCost })}
                  </span>
                </div>

                <div className="space-y-1">
                  <CardTitle className="text-lg font-black text-on-surface">
                    {item.title}
                  </CardTitle>
                  <p className="text-xs text-on-surface-variant line-clamp-2">{item.description}</p>
                </div>

                <div className="flex justify-between items-center text-xs font-bold text-outline pt-2 border-t border-outline-variant/60">
                  <span>{tRewards('stockLabel', { stock: item.stock })}</span>
                  <span className="capitalize">{item.type}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ── TAB: REDEMPTION QUEUE ───────────────────────────────────────────── */}
      {activeTab === 'queue' && (
        <div className="grid grid-cols-1 gap-4">
          {filteredRedemptions?.map((red) => (
            <Card key={red.id} className="border border-outline-variant bg-surface-container-lowest shadow-sm">
              <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-on-surface">{red.studentName}</span>
                    <span className="text-xs text-outline">• {red.createdAt}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant font-medium">
                    {tRewards('requested')} <strong className="text-on-surface">{red.itemTitle}</strong> ({red.pointsCost} {tRewards('pts')})
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {red.status === 'pending' ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-error border-error/30 hover:bg-error/10"
                        onClick={() => openProcessModal(red.id, 'rejected')}
                      >
                        {tRewards('reject')}
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => openProcessModal(red.id, 'approved')}
                      >
                        {tRewards('approve')}
                      </Button>
                    </>
                  ) : (
                    <span className={`text-xs font-extrabold capitalize px-3 py-1 rounded-full ${
                      red.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {red.status}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Item Modal */}
      {isOpen && (
        <Modal isOpen={true} onClose={() => setIsOpen(false)} title={tRewards('addItem')}>
          <form onSubmit={handleCreate} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">{tRewards('itemNameEn')}</label>
                <Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Coptic Cross Keychain" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">{tRewards('itemNameAr')}</label>
                <Input required value={titleAr} onChange={(e) => setTitleAr(e.target.value)} placeholder="مثال: ميدالية صليب قبطي" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">{tRewards('descEn')}</label>
                <Input required value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">{tRewards('descAr')}</label>
                <Input required value={descriptionAr} onChange={(e) => setDescriptionAr(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">{tRewards('itemCost')}</label>
                <Input type="number" min={5} max={5000} required value={pointsCost} onChange={(e) => setPointsCost(Number(e.target.value))} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">{tRewards('itemStock')}</label>
                <Input type="number" min={1} max={1000} required value={stock} onChange={(e) => setStock(Number(e.target.value))} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">{tRewards('materialIcon')}</label>
                <Input required={!imageUrl} value={icon} onChange={(e) => setIcon(e.target.value)} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant">{tRewards('imgUrlOpt')}</label>
              <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" />
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

      {/* Process Redemption Modal */}
      {isFeedbackOpen && (
        <Modal isOpen={true} onClose={() => setIsFeedbackOpen(false)} title={processStatus === 'approved' ? tRewards('confirmApprove') : tRewards('confirmReject')}>
          <form onSubmit={handleProcessSubmit} className="space-y-4 pt-2">
            <p className="text-xs text-on-surface-variant">
              {tRewards('feedbackInstruct')}
            </p>
            <Input
              placeholder={tRewards('feedbackPlace')}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsFeedbackOpen(false)}>
                {tCommon('cancel')}
              </Button>
              <Button variant="primary" size="sm" type="submit">
                {tRewards('submitProcess')}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
