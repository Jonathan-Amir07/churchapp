'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardTitle, Button } from '@/components/ui';

export default function AdminPermissionsPage() {
  const tCommon = useTranslations('common');
  const tPerms = useTranslations('permissions');
  const [activeRole, setActiveRole] = useState<'admin' | 'parent' | 'student'>('admin');

  const permissions = [
    { module: tPerms('userManagement'), canView: true, canEdit: false, canDelete: false },
    { module: tPerms('contentLessons'), canView: true, canEdit: true, canDelete: false },
    { module: tPerms('analytics'), canView: true, canEdit: false, canDelete: false },
    { module: tPerms('systemSettings'), canView: false, canEdit: false, canDelete: false },
  ];

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">{tPerms('title')}</h1>
          <p className="text-on-surface-variant text-sm mt-1">{tPerms('description')}</p>
        </div>
        <Button variant="primary" icon="save">{tPerms('saveChanges')}</Button>
      </div>

      <div className="flex border-b border-outline-variant">
        <button
          onClick={() => setActiveRole('admin')}
          className={`pb-3 px-6 text-sm font-bold border-b-2 transition-all ${
            activeRole === 'admin' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          {tPerms('administrator')}
        </button>
        <button
          onClick={() => setActiveRole('parent')}
          className={`pb-3 px-6 text-sm font-bold border-b-2 transition-all ${
            activeRole === 'parent' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          {tPerms('parent')}
        </button>
        <button
          onClick={() => setActiveRole('student')}
          className={`pb-3 px-6 text-sm font-bold border-b-2 transition-all ${
            activeRole === 'student' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          {tPerms('student')}
        </button>
      </div>

      <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
        <CardContent className="p-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/60 bg-surface-container-low text-xs uppercase tracking-wider text-on-surface-variant">
                <th className="p-4 font-bold">{tPerms('moduleFeature')}</th>
                <th className="p-4 font-bold text-center">{tPerms('view')}</th>
                <th className="p-4 font-bold text-center">{tPerms('createEdit')}</th>
                <th className="p-4 font-bold text-center text-error">{tCommon('delete')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40 text-sm font-bold text-on-surface">
              {permissions.map((perm, i) => (
                <tr key={i} className="hover:bg-surface-container/30 transition-colors">
                  <td className="p-4">{perm.module}</td>
                  <td className="p-4 text-center">
                    <input type="checkbox" defaultChecked={perm.canView} className="w-5 h-5 accent-primary cursor-pointer" />
                  </td>
                  <td className="p-4 text-center">
                    <input type="checkbox" defaultChecked={perm.canEdit} className="w-5 h-5 accent-primary cursor-pointer" />
                  </td>
                  <td className="p-4 text-center">
                    <input type="checkbox" defaultChecked={perm.canDelete} className="w-5 h-5 accent-error cursor-pointer" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
