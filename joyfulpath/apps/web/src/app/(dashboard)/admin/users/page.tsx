'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Papa from 'papaparse';
import { Card, CardContent, CardTitle, Button, Modal, Input, BadgeTag, SearchBar } from '@/components/ui';
import { useNotificationStore } from '@/stores/notifications.store';

interface UserAccount {
  id: string;
  name: string;
  usernameOrEmail: string;
  role: 'student' | 'admin' | 'parent' | 'instructor';
  isActive?: boolean;
}

export default function AdminUsers() {
  const tNav = useTranslations('nav');
  const tUsers = useTranslations('users');
  const tCommon = useTranslations('common');
  const addToast = useNotificationStore(s => s.addToast);

  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'admin' | 'student' | 'parent' | 'instructor'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenResetPwd, setIsOpenResetPwd] = useState(false);
  const [isOpenImport, setIsOpenImport] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [resettingUserId, setResettingUserId] = useState<string | null>(null);
  
  const [importSummary, setImportSummary] = useState<{ success: number; failed: number; errors: string[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [name, setName] = useState('');
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [passwordOrPin, setPasswordOrPin] = useState('');
  const [role, setRole] = useState<'student' | 'admin' | 'parent' | 'instructor'>('student');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

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

  const handleAddUser = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !usernameOrEmail || !passwordOrPin) {
      addToast(tCommon('error'), 'error');
      return;
    }

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, usernameOrEmail, passwordOrPin, role }),
      });

      if (!res.ok) throw new Error('Failed to create');
      
      const newUser = await res.json();
      setUsers((prev) => [newUser, ...prev]);
      setIsOpenAdd(false);
      addToast(tUsers('addSuccess') || 'User created successfully', 'success');

      setName('');
      setUsernameOrEmail('');
      setPasswordOrPin('');
      setRole('student');
    } catch (error) {
      addToast('Failed to create user', 'error');
    }
  }, [name, usernameOrEmail, passwordOrPin, role, addToast, tUsers]);

  const openEditModal = useCallback((user: UserAccount) => {
    setEditingUserId(user.id);
    setName(user.name);
    setUsernameOrEmail(user.usernameOrEmail);
    setRole(user.role);
    setIsOpenEdit(true);
  }, []);

  const handleEditUser = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/users/${editingUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, usernameOrEmail, role }),
      });
      if (!res.ok) throw new Error();
      
      setUsers(prev => prev.map(u => u.id === editingUserId ? { ...u, name, usernameOrEmail, role } : u));
      setIsOpenEdit(false);
      addToast('User updated successfully', 'success');
    } catch (e) {
      addToast('Failed to update user', 'error');
    }
  }, [editingUserId, name, usernameOrEmail, role, addToast]);

  const toggleUserActive = useCallback(async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (!res.ok) throw new Error();
      
      setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: !currentStatus } : u));
      addToast(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`, 'success');
    } catch (e) {
      addToast('Failed to change status', 'error');
    }
  }, [addToast]);

  const openResetPasswordModal = useCallback((id: string) => {
    setResettingUserId(id);
    setPasswordOrPin('');
    setIsOpenResetPwd(true);
  }, []);

  const handleResetPassword = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordOrPin) return;
    try {
      const res = await fetch(`/api/users/${resettingUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passwordOrPin }),
      });
      if (!res.ok) throw new Error();
      
      addToast('Password reset successfully', 'success');
      setIsOpenResetPwd(false);
    } catch (e) {
      addToast('Failed to reset password', 'error');
    }
  }, [passwordOrPin, resettingUserId, addToast]);

  const handleDeleteUser = useCallback(async (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error();
        setUsers((prev) => prev.filter((u) => u.id !== id));
        addToast(tCommon('success') || 'User deleted successfully', 'success');
      } catch (e) {
        addToast('Failed to delete user', 'error');
      }
    }
  }, [addToast, tCommon]);

  const downloadTemplate = () => {
    const csvContent = 'name,usernameOrEmail,role,password\nJohn Doe,john@joyfulpath.org,student,password123';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'users_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data as any[];
        let successCount = 0;
        let failedCount = 0;
        const errors: string[] = [];
        const newUsers: UserAccount[] = [];

        const existingEmails = new Set(users.map(u => u.usernameOrEmail.toLowerCase()));

        for (const [index, row] of rows.entries()) {
          const rowNum = index + 2;
          const { name, usernameOrEmail, role, password } = row;

          if (!name || !usernameOrEmail || !role || !password) {
            errors.push(`Row ${rowNum}: Missing required fields.`);
            failedCount++;
            continue;
          }

          const roleLower = role.toLowerCase();
          if (!['student', 'admin', 'parent', 'instructor'].includes(roleLower)) {
            errors.push(`Row ${rowNum}: Invalid role "${role}".`);
            failedCount++;
            continue;
          }

          if (existingEmails.has(usernameOrEmail.toLowerCase())) {
            errors.push(`Row ${rowNum}: Duplicate username/email "${usernameOrEmail}".`);
            failedCount++;
            continue;
          }
          
          existingEmails.add(usernameOrEmail.toLowerCase());

          // Password hashing
          const hashedPassword = bcrypt.hashSync(password, 10);

          newUsers.push({
            id: `imported-${Date.now()}-${index}`,
            name,
            usernameOrEmail,
            role: roleLower as any,
            isActive: true,
          });
          
          successCount++;
        }

        if (newUsers.length > 0) {
          setUsers(prev => [...newUsers, ...prev]);
        }

        setImportSummary({ success: successCount, failed: failedCount, errors });
        addToast(tUsers('importSuccess') || 'Import completed', 'success');
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
      error: (error) => {
        addToast('Error parsing CSV file.', 'error');
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    });
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
          {(['all', 'admin', 'instructor', 'student', 'parent'] as const).map((r) => (
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
          placeholder={tCommon('search')}
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
                  <th className="px-6 py-4 text-start">Status</th>
                  <th className="px-6 py-4 text-end">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-on-surface-variant font-medium">
                      Loading users...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-on-surface-variant font-medium">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-surface-container-low/40 transition duration-150">
                      <td className="px-6 py-4 font-black text-on-surface">{user.name}</td>
                      <td className="px-6 py-4 text-on-surface-variant">{user.usernameOrEmail}</td>
                      <td className="px-6 py-4">
                        <BadgeTag variant={user.role === 'admin' ? 'primary' : user.role === 'instructor' ? 'secondary' : user.role === 'parent' ? 'outline' : 'outline'}>
                          {user.role}
                        </BadgeTag>
                      </td>
                      <td className="px-6 py-4">
                        <BadgeTag variant={user.isActive === false ? 'error' : 'success'}>
                          {user.isActive === false ? 'Inactive' : 'Active'}
                        </BadgeTag>
                      </td>
                      <td className="px-6 py-4 text-end">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => toggleUserActive(user.id, user.isActive !== false)} title={user.isActive === false ? "Activate" : "Deactivate"}>
                            <span className="material-symbols-outlined text-xl">{user.isActive === false ? 'check_circle' : 'block'}</span>
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openResetPasswordModal(user.id)} title="Reset Password">
                            <span className="material-symbols-outlined text-xl">key</span>
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openEditModal(user)} title="Edit">
                            <span className="material-symbols-outlined text-xl">edit</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="text-error hover:bg-error/10" onClick={() => handleDeleteUser(user.id)} title="Delete">
                            <span className="material-symbols-outlined text-xl">delete</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
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
              <label className="text-xs font-bold text-on-surface-variant">{tUsers('username')} / {tUsers('email')}</label>
              <Input required value={usernameOrEmail} onChange={(e) => setUsernameOrEmail(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant">{tUsers('password')} / {tUsers('pin')}</label>
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
                <option value="instructor">{tUsers('instructorRole')}</option>
                <option value="admin">{tUsers('adminRole')}</option>
              </select>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsOpenAdd(false)}>
                {tCommon('cancel') || 'Cancel'}
              </Button>
              <Button variant="primary" size="sm" type="submit">
                {tCommon('create') || 'Create'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit User Modal */}
      {isOpenEdit && (
        <Modal isOpen={true} onClose={() => setIsOpenEdit(false)} title="Edit User">
          <form onSubmit={handleEditUser} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant">{tUsers('fullName')}</label>
              <Input required value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant">{tUsers('username')} / {tUsers('email')}</label>
              <Input required value={usernameOrEmail} onChange={(e) => setUsernameOrEmail(e.target.value)} />
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
                <option value="instructor">{tUsers('instructorRole')}</option>
                <option value="admin">{tUsers('adminRole')}</option>
              </select>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsOpenEdit(false)}>
                {tCommon('cancel') || 'Cancel'}
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Reset Password Modal */}
      {isOpenResetPwd && (
        <Modal isOpen={true} onClose={() => setIsOpenResetPwd(false)} title="Reset Password">
          <form onSubmit={handleResetPassword} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant">New Password / PIN</label>
              <Input type="password" required value={passwordOrPin} onChange={(e) => setPasswordOrPin(e.target.value)} />
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsOpenResetPwd(false)}>
                {tCommon('cancel') || 'Cancel'}
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Reset Password
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* CSV Import Modal */}
      {isOpenImport && (
        <Modal isOpen={true} onClose={() => { setIsOpenImport(false); setImportSummary(null); }} title={tUsers('csvImport') || 'Bulk Import Users'}>
          <div className="space-y-4 pt-2">
            {!importSummary ? (
              <>
                <div className="flex justify-between items-center bg-surface-container-low p-4 rounded-xl border border-outline-variant">
                  <div>
                    <h4 className="font-bold text-sm text-on-surface">CSV Template</h4>
                    <p className="text-xs text-on-surface-variant">Download the template to see the required format.</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={downloadTemplate} icon="download">
                    Template
                  </Button>
                </div>
                
                <div 
                  className="p-8 border-2 border-dashed border-outline-variant rounded-2xl bg-surface-container-low flex flex-col items-center gap-4 cursor-pointer hover:bg-surface-container transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input type="file" accept=".csv" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                  <span className="material-symbols-outlined text-[48px] text-primary">upload_file</span>
                  <p className="text-sm font-bold text-on-surface">{tUsers('dragDrop') || 'Click to select CSV file'}</p>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 bg-success/10 border border-success/30 p-4 rounded-xl text-center">
                    <div className="text-2xl font-black text-success">{importSummary.success}</div>
                    <div className="text-xs font-bold text-success">Imported</div>
                  </div>
                  <div className="flex-1 bg-error/10 border border-error/30 p-4 rounded-xl text-center">
                    <div className="text-2xl font-black text-error">{importSummary.failed}</div>
                    <div className="text-xs font-bold text-error">Failed</div>
                  </div>
                </div>
                
                {importSummary.errors.length > 0 && (
                  <div className="bg-surface-container-lowest border border-error/20 p-4 rounded-xl max-h-40 overflow-y-auto">
                    <h5 className="text-xs font-bold text-error mb-2">Errors:</h5>
                    <ul className="text-xs text-on-surface-variant space-y-1 list-disc pl-4">
                      {importSummary.errors.map((err, i) => <li key={i}>{err}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant">
              <Button variant="outline" size="sm" onClick={() => { setIsOpenImport(false); setImportSummary(null); }}>
                {tCommon('close') || 'Close'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
