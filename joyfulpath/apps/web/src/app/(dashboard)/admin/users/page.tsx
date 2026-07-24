'use client';

import { useState, useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardTitle, Button, Modal, Input, BadgeTag, SearchBar } from '@/components/ui';
import { useNotificationStore } from '@/stores/notifications.store';

interface UserAccount {
  id: string;
  name: string;
  usernameOrEmail: string;
  role: 'student' | 'admin' | 'parent';
}

const INITIAL_USERS: UserAccount[] = [
  { id: '1', name: 'Jonathan Amir', usernameOrEmail: 'admin1@joyfulpath.org', role: 'admin' },
  { id: '2', name: 'Servant Luke', usernameOrEmail: 'admin2@joyfulpath.org', role: 'admin' },
  { id: '3', name: 'Mark Faith', usernameOrEmail: 'student1', role: 'student' },
];

export default function AdminUsers() {
  const tNav = useTranslations('nav');
  const tUsers = useTranslations('users');
  const tCommon = useTranslations('common');
  const addToast = useNotificationStore(s => s.addToast);

  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [filter, setFilter] = useState<'all' | 'admin' | 'student' | 'parent'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenImport, setIsOpenImport] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [passwordOrPin, setPasswordOrPin] = useState('');
  const [role, setRole] = useState<'student' | 'admin' | 'parent'>('student');

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      if (filter !== 'all' && user.role !== filter) return false;

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          user.name.toLowerCase().includes(q) ||
          user.usernameOrEmail.toLowerCase().includes(q) ||
          user.role.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [users, filter, searchQuery]);

  const handleAddUser = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !usernameOrEmail || !passwordOrPin) {
      addToast('Error: Please fill all fields!', 'error');
      return;
    }

    const newUser: UserAccount = {
      id: String(users.length + 1),
      name,
      usernameOrEmail,
      role,
    };

    setUsers((prev) => [newUser, ...prev]);
    setIsOpenAdd(false);
    addToast(tUsers('addSuccess'), 'success');

    // Reset Form
    setName('');
    setUsernameOrEmail('');
    setPasswordOrPin('');
    setRole('student');
  }, [name, usernameOrEmail, passwordOrPin, role, users.length, addToast, tUsers]);

  const handleDeleteUser = useCallback((id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    addToast('User deleted successfully', 'success');
  }, [addToast]);

  const handleMockImport = useCallback(() => {
    setIsOpenImport(false);
    addToast(tUsers('importSuccess'), 'success');
  }, [addToast, tUsers]);

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
            {tNav('users')}
          </h1>
          <p className="text-on-surface-variant text-sm">
            {tUsers('description')}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={() => setIsOpenImport(true)} icon="upload_file">
            {tUsers('importCsv')}
          </Button>
          <Button variant="primary" size="sm" onClick={() => setIsOpenAdd(true)} icon="person_add">
            {tUsers('addUser')}
          </Button>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 p-1 bg-surface-container-low rounded-2xl border border-outline-variant/50 w-fit">
          {(['all', 'admin', 'student', 'parent'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setFilter(r)}
              className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all duration-200 ${
                filter === r
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              {r === 'all' ? 'All Roles' : r}
            </button>
          ))}
        </div>

        <SearchBar
          onSearch={handleSearch}
          placeholder="Search users by name, username or role..."
          resultCount={filteredUsers.length}
          totalCount={users.length}
          className="w-full sm:w-80"
        />
      </div>

      {/* Users Table */}
      <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse text-sm">
              <thead>
                <tr className="border-b border-outline-variant/60 text-outline text-xs uppercase font-black">
                  <th className="px-6 py-4 text-start">{tUsers('fullName')}</th>
                  <th className="px-6 py-4 text-start">{tUsers('username')} / Email</th>
                  <th className="px-6 py-4 text-start">{tUsers('role')}</th>
                  <th className="px-6 py-4 text-end">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-surface-container-low/40 transition duration-150">
                    <td className="px-6 py-4 font-black text-on-surface">{user.name}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{user.usernameOrEmail}</td>
                    <td className="px-6 py-4">
                      <BadgeTag variant={user.role === 'admin' ? 'primary' : user.role === 'parent' ? 'secondary' : 'outline'}>
                        {user.role}
                      </BadgeTag>
                    </td>
                    <td className="px-6 py-4 text-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-error hover:bg-error/10"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        {tCommon('delete')}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add User Modal */}
      {isOpenAdd && (
        <Modal isOpen={true} onClose={() => setIsOpenAdd(false)} title={tUsers('registerUser')}>
          <form onSubmit={handleAddUser} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant">{tUsers('fullName')}</label>
              <Input required value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant">Username / Email</label>
              <Input required value={usernameOrEmail} onChange={(e) => setUsernameOrEmail(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant">Password / PIN</label>
              <Input type="password" required value={passwordOrPin} onChange={(e) => setPasswordOrPin(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant">{tUsers('role')}</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full p-3 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface text-sm font-medium"
              >
                <option value="student">{tUsers('studentRole')}</option>
                <option value="parent">{tUsers('parentRole')}</option>
                <option value="admin">{tUsers('adminRole')}</option>
              </select>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsOpenAdd(false)}>
                {tCommon('cancel')}
              </Button>
              <Button variant="primary" size="sm" type="submit">
                {tCommon('create')}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* CSV Import Modal */}
      {isOpenImport && (
        <Modal isOpen={true} onClose={() => setIsOpenImport(false)} title={tUsers('csvImport')}>
          <div className="space-y-4 pt-2 text-center">
            <div className="p-8 border-2 border-dashed border-outline-variant rounded-2xl bg-surface-container-low flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-[48px] text-primary">upload_file</span>
              <p className="text-sm font-bold text-on-surface">{tUsers('dragDrop')}</p>
            </div>
            <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant">
              <Button variant="outline" size="sm" onClick={() => setIsOpenImport(false)}>
                {tCommon('cancel')}
              </Button>
              <Button variant="primary" size="sm" onClick={handleMockImport}>
                {tUsers('mockImport')}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
