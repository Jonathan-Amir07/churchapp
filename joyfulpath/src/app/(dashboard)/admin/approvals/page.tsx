'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, BadgeTag } from '@/components/ui';
import { useNotificationStore } from '@/stores/notifications.store';

interface PendingUser {
  id: string;
  email: string | null;
  firstName: string;
  lastName: string;
  displayName: string;
  role: string;
  createdAt: string;
}

export default function AdminApprovalsPage() {
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const addToast = useNotificationStore((s) => s.addToast);

  const fetchPending = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/approvals');
      const data = await res.json();
      setUsers(data.users || []);
    } catch {
      addToast('Failed to load pending users', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const handleAction = async (userId: string, action: 'approve' | 'reject') => {
    setProcessingIds((prev) => new Set(prev).add(userId));
    try {
      const res = await fetch('/api/admin/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action }),
      });
      if (res.ok) {
        addToast(`User ${action}d successfully`, 'success');
        setUsers((prev) => prev.filter((u) => u.id !== userId));
      } else {
        addToast(`Failed to ${action} user`, 'error');
      }
    } catch {
      addToast('Network error', 'error');
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  };

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-on-surface">Account Approvals</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Review and approve or reject pending registrations.
          </p>
        </div>
        <BadgeTag variant="warning">{users.length} Pending</BadgeTag>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <span className="material-symbols-outlined text-[40px] text-primary animate-spin">progress_activity</span>
        </div>
      ) : users.length === 0 ? (
        <Card className="border border-outline-variant bg-surface-container-lowest">
          <CardContent className="p-12 text-center space-y-3">
            <span className="material-symbols-outlined text-[48px] text-on-surface-variant/40">verified</span>
            <p className="text-on-surface-variant font-bold">No pending approvals</p>
            <p className="text-sm text-on-surface-variant/60">All registrations have been reviewed.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <Card key={user.id} className="border border-outline-variant bg-surface-container-lowest shadow-sm">
              <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px] text-primary">person</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-on-surface">{user.displayName}</h3>
                    <p className="text-xs text-on-surface-variant">{user.email || 'No email'}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <BadgeTag variant="primary">{user.role}</BadgeTag>
                      <span className="text-[10px] text-on-surface-variant/60">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleAction(user.id, 'approve')}
                    loading={processingIds.has(user.id)}
                    icon="check_circle"
                    iconPosition="start"
                  >
                    Approve
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleAction(user.id, 'reject')}
                    loading={processingIds.has(user.id)}
                    icon="cancel"
                    iconPosition="start"
                  >
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
