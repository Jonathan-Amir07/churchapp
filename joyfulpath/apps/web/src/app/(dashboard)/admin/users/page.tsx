'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardTitle, Button, Modal, Input, BadgeTag } from '@/components/ui';

interface UserAccount {
  id: string;
  name: string;
  usernameOrEmail: string;
  role: 'student' | 'instructor' | 'admin';
}

const INITIAL_USERS: UserAccount[] = [
  { id: '1', name: 'Jonathan Amir', usernameOrEmail: 'admin1@joyfulpath.org', role: 'admin' },
  { id: '2', name: 'Servant Luke', usernameOrEmail: 'instructor1@joyfulpath.org', role: 'instructor' },
  { id: '3', name: 'Mark Faith', usernameOrEmail: 'student1', role: 'student' },
];

export default function AdminUsers() {
  const tNav = useTranslations('nav');
  const tUsers = useTranslations('users');
  const tCommon = useTranslations('common');

  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [filter, setFilter] = useState<'all' | 'admin' | 'instructor' | 'student'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenImport, setIsOpenImport] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [passwordOrPin, setPasswordOrPin] = useState('');
  const [role, setRole] = useState<'student' | 'instructor' | 'admin'>('student');

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.usernameOrEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return u.role === filter && matchesSearch;
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !usernameOrEmail || !passwordOrPin) {
      alert('Error: Please fill all fields!');
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
    alert(tUsers('addSuccess'));

    // Reset Form
    setName('');
    setUsernameOrEmail('');
    setPasswordOrPin('');
    setRole('student');
  };

  const handleImportCsv = () => {
    setIsOpenImport(false);
    alert(tUsers('importSuccess'));
  };

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
        <div className="flex gap-2.5">
          <Button variant="outline" size="sm" onClick={() => setIsOpenImport(true)} icon="upload" iconPosition="start">
            {tUsers('csvImport')}
          </Button>
          <Button variant="primary" size="sm" onClick={() => setIsOpenAdd(true)} icon="person_add" iconPosition="start">
            {tUsers('addUser')}
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/60 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder={tCommon('search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 ps-10 pe-4 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary text-sm font-medium"
          />
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant/60 text-[20px]">
            search
          </span>
        </div>

        {/* Role Filters */}
        <div className="flex gap-1 bg-surface-container-low p-1.5 rounded-xl w-full sm:w-auto overflow-x-auto">
          {(['all', 'admin', 'instructor', 'student'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all duration-150 whitespace-nowrap ${
                filter === tab
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Table */}
      <Card className="border border-outline-variant bg-surface-container-lowest shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse text-sm">
              <thead>
                <tr className="border-b border-outline-variant/60 text-outline text-xs uppercase font-black">
                  <th className="px-6 py-4 text-start">{tCommon('appName') === 'JoyfulPath' ? 'Name' : 'الاسم'}</th>
                  <th className="px-6 py-4 text-start">{tCommon('appName') === 'JoyfulPath' ? 'Login Credential' : 'اسم الدخول'}</th>
                  <th className="px-6 py-4 text-start">{tCommon('appName') === 'JoyfulPath' ? 'Role' : 'الصلاحية'}</th>
                  <th className="px-6 py-4 text-end">{tCommon('appName') !== 'JoyfulPath' ? 'العملية' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-surface-container-low/40 transition duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                          {u.name[0]}
                        </div>
                        <span className="font-extrabold text-on-surface">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-on-surface-variant">
                      {u.usernameOrEmail}
                    </td>
                    <td className="px-6 py-4">
                      <BadgeTag variant={u.role === 'admin' ? 'error' : u.role === 'instructor' ? 'warning' : 'primary'}>
                        {u.role}
                      </BadgeTag>
                    </td>
                    <td className="px-6 py-4 text-end">
                      <Button variant="ghost" size="sm" className="h-9 px-3 text-xs text-error hover:bg-error/5 hover:text-error border-none">
                        {tUsers('delete')}
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
        <Modal isOpen={true} onClose={() => setIsOpenAdd(false)} title={tUsers('addUser')}>
          <form onSubmit={handleAddUser} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant">{tUsers('fullName')}</label>
              <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="David King" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant">{tUsers('role')}</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="h-12 w-full px-3 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary text-sm font-medium"
              >
                <option value="student">{tUsers('studentRole')}</option>
                <option value="instructor">{tUsers('instructorRole')}</option>
                <option value="admin">{tUsers('adminRole')}</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant">
                {role === 'student' ? tUsers('username') : tUsers('email')}
              </label>
              <Input required value={usernameOrEmail} onChange={(e) => setUsernameOrEmail(e.target.value)} placeholder={role === 'student' ? 'david_king' : 'david@joyfulpath.org'} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant">
                {role === 'student' ? tUsers('securityPin') : tUsers('password')}
              </label>
              <Input
                required
                type="password"
                value={passwordOrPin}
                onChange={(e) => setPasswordOrPin(e.target.value)}
                placeholder={role === 'student' ? '1234' : '••••••••'}
              />
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsOpenAdd(false)}>
                {tCommon('cancel')}
              </Button>
              <Button variant="primary" size="sm" type="submit">
                {tUsers('registerUser')}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* CSV Import Modal */}
      {isOpenImport && (
        <Modal isOpen={true} onClose={() => setIsOpenImport(false)} title={tUsers('importCsv')}>
          <div className="space-y-4 pt-2 text-center">
            <div className="border border-dashed border-outline-variant rounded-xl p-8 hover:bg-surface-container transition duration-150 cursor-pointer">
              <span className="material-symbols-outlined text-[48px] text-outline">upload_file</span>
              <p className="text-sm text-on-surface font-black mt-2">{tUsers('dragDrop')}</p>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant">
              <Button variant="outline" size="sm" onClick={() => setIsOpenImport(false)}>
                {tCommon('cancel')}
              </Button>
              <Button variant="primary" size="sm" onClick={handleImportCsv}>
                {tUsers('mockImport')}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
