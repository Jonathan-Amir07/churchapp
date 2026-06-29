'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { createClient } from '@/lib/supabase/client';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui';
import { useNotificationStore } from '@/stores/notifications.store';
import Link from 'next/link';

// Zod Schema
const registerSchema = zod.object({
  fullName: zod.string().min(3, 'Name must be at least 3 characters'),
  email: zod.string().email('Please enter a valid email address'),
  phoneNumber: zod.string().min(6, 'Please enter a valid phone number'),
  password: zod.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: zod.string(),
  birthDate: zod.string().optional(),
  gender: zod.string().optional(),
  branchId: zod.string().optional(),
  classId: zod.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormValues = zod.infer<typeof registerSchema>;

export default function RegisterPage() {
  const tCommon = useTranslations('common');
  const currentLocale = useLocale();
  const router = useRouter();
  const addToast = useNotificationStore((state) => state.addToast);
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<'student' | 'parent' | 'instructor'>('student');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  // Database options
  const [branches, setBranches] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);

  useEffect(() => {
    // Load branches & classes for signup selections
    async function loadData() {
      const { data: bData } = await supabase.from('branches').select('id, name');
      if (bData) setBranches(bData);
      
      const { data: cData } = await supabase.from('classes').select('id, name');
      if (cData) setClasses(cData);
    }
    loadData();
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const watchedPassword = watch('password', '');

  // Calculate password strength
  useEffect(() => {
    let score = 0;
    if (!watchedPassword) {
      setPasswordStrength(0);
      return;
    }
    if (watchedPassword.length >= 8) score += 1;
    if (/[A-Z]/.test(watchedPassword)) score += 1;
    if (/[a-z]/.test(watchedPassword)) score += 1;
    if (/[0-9]/.test(watchedPassword)) score += 1;
    if (/[^A-Za-z0-9]/.test(watchedPassword)) score += 1;
    setPasswordStrength(score);
  }, [watchedPassword]);

  const handleLocaleSwitch = () => {
    const nextLocale = currentLocale === 'en' ? 'ar' : 'en';
    document.cookie = `NEXT_LOCALE=${nextLocale};max-age=31536000;path=/`;
    window.location.reload();
  };

  const onSubmit = async (values: RegisterFormValues) => {
    setLoading(true);
    try {
      const nameParts = values.fullName.trim().split(' ');
      const firstName = nameParts[0] || 'User';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Register with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            display_name: values.fullName,
            role: activeTab,
            locale: currentLocale,
            phone_number: values.phoneNumber,
            gender: values.gender || null,
            birth_date: values.birthDate || null,
            branch_id: values.branchId || null,
            class_id: values.classId || null,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/`,
        },
      });

      if (error) {
        addToast(error.message, 'error');
      } else {
        addToast('Registration successful! Please check your email to verify your account.', 'success');
        router.push('/login');
      }
    } catch (err: any) {
      addToast(err.message || 'An error occurred during registration', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStrengthLabel = () => {
    if (passwordStrength <= 2) return { label: 'Weak', color: 'bg-error' };
    if (passwordStrength <= 4) return { label: 'Medium', color: 'bg-secondary' };
    return { label: 'Strong', color: 'bg-tertiary' };
  };

  const strength = getStrengthLabel();

  return (
    <div className="w-full max-w-lg mx-auto relative py-12">
      {/* Floating Language Switcher */}
      <div className="absolute -top-4 end-0 z-20">
        <Button
          variant="outline"
          size="sm"
          onClick={handleLocaleSwitch}
          className="flex items-center gap-1 bg-surface-container-lowest/80 backdrop-blur-md border border-outline-variant hover:bg-surface-container-low transition-all shadow-sm rounded-full py-1.5 px-3.5 text-sm"
          icon="language"
          iconPosition="start"
        >
          {currentLocale === 'en' ? 'العربية' : 'English'}
        </Button>
      </div>

      <Card variant="elevated" className="overflow-hidden border border-outline-variant bg-surface-container-lowest/90 backdrop-blur-md shadow-elevated">
        <div className="h-2 bg-gradient-to-r from-primary via-primary-container to-secondary-container" />
        
        <CardHeader className="text-center pt-8 pb-4">
          <CardTitle className="text-3xl font-extrabold tracking-tight text-on-surface">
            {currentLocale === 'en' ? 'Create Account' : 'إنشاء حساب'}
          </CardTitle>
          <CardDescription className="text-sm font-medium text-on-surface-variant/80 mt-1.5">
            {currentLocale === 'en' ? 'Join Sunday School Gamified learning journey' : 'انضم لرحلة التعلم المشوقة لمدارس الأحد'}
          </CardDescription>
        </CardHeader>

        {/* Tab Controls */}
        <div className="px-6 pb-2">
          <div className="flex bg-surface-container rounded-xl p-1 border border-outline-variant/30">
            {(['student', 'parent', 'instructor'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-center text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 capitalize ${
                  activeTab === tab
                    ? 'bg-surface-container-lowest text-primary shadow-sm border border-outline-variant/20'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {tab === 'student' ? 'sentiment_satisfied' : tab === 'parent' ? 'family_restroom' : 'school'}
                </span>
                {tab}
              </button>
            ))}
          </div>
        </div>

        <CardContent className="p-6 pt-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label={currentLocale === 'en' ? 'Full Name' : 'الاسم بالكامل'}
              placeholder="e.g. John Doe"
              icon="person"
              disabled={loading}
              error={errors.fullName?.message}
              {...register('fullName')}
            />

            <Input
              label={currentLocale === 'en' ? 'Email Address' : 'عنوان البريد الإلكتروني'}
              type="email"
              placeholder="explorer@path.com"
              icon="mail"
              disabled={loading}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label={currentLocale === 'en' ? 'Phone Number' : 'رقم الهاتف'}
              type="tel"
              placeholder="+20..."
              icon="call"
              disabled={loading}
              error={errors.phoneNumber?.message}
              {...register('phoneNumber')}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label={currentLocale === 'en' ? 'Birth Date' : 'تاريخ الميلاد'}
                type="date"
                disabled={loading}
                {...register('birthDate')}
              />
              <div className="space-y-2">
                <label className="block text-sm font-semibold tracking-wide text-on-surface uppercase">
                  {currentLocale === 'en' ? 'Gender' : 'النوع'}
                </label>
                <select
                  disabled={loading}
                  className="w-full h-14 bg-surface-container rounded-lg border-2 border-transparent px-4 font-medium text-base text-on-surface placeholder:text-outline-variant outline-none focus:border-primary transition-colors"
                  {...register('gender')}
                >
                  <option value="">Select...</option>
                  <option value="male">{currentLocale === 'en' ? 'Male' : 'ذكر'}</option>
                  <option value="female">{currentLocale === 'en' ? 'Female' : 'أنثى'}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold tracking-wide text-on-surface uppercase">
                  {currentLocale === 'en' ? 'Branch' : 'الفرع/الكنيسة'}
                </label>
                <select
                  disabled={loading}
                  className="w-full h-14 bg-surface-container rounded-lg border-2 border-transparent px-4 font-medium text-base text-on-surface placeholder:text-outline-variant outline-none focus:border-primary transition-colors"
                  {...register('branchId')}
                >
                  <option value="">Select Branch...</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              {activeTab === 'student' && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold tracking-wide text-on-surface uppercase">
                    {currentLocale === 'en' ? 'Class/Grade' : 'الفصل الدراسي'}
                  </label>
                  <select
                    disabled={loading}
                    className="w-full h-14 bg-surface-container rounded-lg border-2 border-transparent px-4 font-medium text-base text-on-surface placeholder:text-outline-variant outline-none focus:border-primary transition-colors"
                    {...register('classId')}
                  >
                    <option value="">Select Class...</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <Input
              label={currentLocale === 'en' ? 'Password' : 'كلمة المرور'}
              type="password"
              placeholder="••••••••"
              icon="lock"
              disabled={loading}
              showPasswordToggle
              error={errors.password?.message}
              {...register('password')}
            />

            {watchedPassword && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-on-surface-variant">
                  <span>{currentLocale === 'en' ? 'Password Strength:' : 'قوة كلمة المرور:'}</span>
                  <span className="capitalize">{strength.label}</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${strength.color}`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}

            <Input
              label={currentLocale === 'en' ? 'Confirm Password' : 'تأكيد كلمة المرور'}
              type="password"
              placeholder="••••••••"
              icon="lock"
              disabled={loading}
              showPasswordToggle
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              loading={loading}
              className="mt-6"
            >
              {currentLocale === 'en' ? 'Create Account' : 'إنشاء الحساب'}
            </Button>

            <p className="text-center text-xs font-semibold text-on-surface-variant/80 mt-4">
              {currentLocale === 'en' ? 'Already have an account?' : 'هل لديك حساب بالفعل؟'}{' '}
              <Link href="/login" className="text-primary hover:underline">
                {currentLocale === 'en' ? 'Sign In' : 'تسجيل الدخول'}
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
