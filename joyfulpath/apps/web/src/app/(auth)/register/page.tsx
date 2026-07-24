'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { Button, Input, Card, CardContent } from '@/components/ui';
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
  const currentLocale = useLocale();
  const router = useRouter();
  const addToast = useNotificationStore((state) => state.addToast);
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<'student' | 'parent'>('student');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  // Multi-step state
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  // Database options
  const [branches, setBranches] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);

  useEffect(() => {
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
    control,
    trigger,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched'
  });

  const watchedPassword = useWatch({
    control,
    name: 'password',
    defaultValue: '',
  });

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

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (step === 1) fieldsToValidate = ['fullName', 'phoneNumber', 'birthDate', 'gender'];
    if (step === 2) fieldsToValidate = ['branchId', 'classId'];
    
    const isStepValid = await trigger(fieldsToValidate as any);
    if (isStepValid) setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (values: RegisterFormValues) => {
    setLoading(true);
    try {
      const nameParts = values.fullName.trim().split(' ');
      const firstName = nameParts[0] || 'User';
      const lastName = nameParts.slice(1).join(' ') || '';

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
        addToast(currentLocale === 'en' ? 'Registration successful! Please check your email.' : 'تم التسجيل بنجاح! يرجى التحقق من بريدك الإلكتروني.', 'success');
        router.push('/login');
      }
    } catch (err: any) {
      addToast(err.message || 'An error occurred during registration', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStrengthLabel = () => {
    if (passwordStrength <= 2) return { label: currentLocale === 'en' ? 'Weak' : 'ضعيف', color: 'bg-error' };
    if (passwordStrength <= 4) return { label: currentLocale === 'en' ? 'Medium' : 'متوسط', color: 'bg-secondary' };
    return { label: currentLocale === 'en' ? 'Strong' : 'قوي', color: 'bg-tertiary' };
  };

  const strength = getStrengthLabel();

  return (
    <div className="w-full relative py-6 md:py-12 max-w-5xl mx-auto flex">
      {/* Floating Language Switcher */}
      <div className="absolute top-0 end-0 z-30">
        <Button
          variant="outline"
          size="sm"
          onClick={handleLocaleSwitch}
          className="flex items-center gap-1 bg-surface-container-lowest/80 backdrop-blur-md border border-secondary/30 hover:bg-surface-container-low transition-all shadow-sm rounded-full py-1.5 px-3.5 text-sm font-bold text-secondary"
          icon="language"
          iconPosition="start"
        >
          {currentLocale === 'en' ? 'العربية' : 'English'}
        </Button>
      </div>

      <Card variant="elevated" className="w-full overflow-hidden border border-outline-variant bg-surface-container-lowest/90 backdrop-blur-md shadow-2xl rounded-3xl grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Side: Coptic Imagery */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-secondary via-primary-container to-primary p-12 relative overflow-hidden text-on-primary">
          <div className="absolute inset-0 bg-coptic-pattern opacity-10 mix-blend-overlay pointer-events-none" />
          
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white">
                <path d="M12 2V22M7 7H17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-2xl font-black tracking-tight">{currentLocale === 'en' ? 'JoyfulPath' : 'مسار الفرح'}</span>
          </div>

          <div className="relative z-10 space-y-6 max-w-sm mt-12">
            <h2 className="text-4xl font-extrabold leading-tight">
              {currentLocale === 'en' ? 'Start Your Spiritual Journey' : 'ابدأ مسارك الروحي'}
            </h2>
            <p className="text-primary-container-on font-medium text-lg opacity-90 leading-relaxed">
              {currentLocale === 'en' 
                ? 'Create your account to track attendance, interact with lessons, and earn rewards.'
                : 'أنشئ حسابك لتسجيل الحضور، والتفاعل مع الدروس، والحصول على البركات.'}
            </p>
          </div>

          <div className="relative z-10 mt-auto pt-16">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-[36px] text-white">account_balance</span>
                <div>
                  <h4 className="font-extrabold text-sm">{currentLocale === 'en' ? 'Church Management' : 'إدارة كنسية'}</h4>
                  <p className="text-xs opacity-80 mt-1 font-medium">{currentLocale === 'en' ? 'Connecting servants, parents and students.' : 'ربط الخدام وأولياء الأمور والمخدومين.'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center relative">
          
          <div className="text-center mb-8 md:hidden">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-secondary/30 shadow-md">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-secondary">
                  <path d="M12 2V22M7 7H17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-extrabold text-on-surface mb-2">{currentLocale === 'en' ? 'Create Account' : 'إنشاء حساب'}</h1>
          </div>

          <div className="hidden md:block mb-8">
            <h2 className="text-3xl font-extrabold text-on-surface">{currentLocale === 'en' ? 'Create Account' : 'إنشاء حساب'}</h2>
          </div>

          <div className="flex justify-center mb-8">
            <div className="flex gap-2 w-full">
              {[1, 2, 3].map((s) => (
                <div key={s} className={`h-2 flex-1 rounded-full transition-colors ${step >= s ? 'bg-primary' : 'bg-surface-container-high'}`} />
              ))}
            </div>
          </div>

          {/* Tab Controls (Only in step 1) */}
          {step === 1 && (
            <div className="flex bg-surface-container rounded-xl p-1.5 border border-outline-variant/30 mb-8">
              {(['student', 'parent'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 text-center text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 capitalize ${
                    activeTab === tab
                      ? 'bg-surface-container-lowest text-primary shadow-sm border border-outline-variant/20'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {tab === 'student' ? 'sentiment_satisfied' : tab === 'parent' ? 'family_restroom' : 'school'}
                  </span>
                  <span className="truncate">
                    {currentLocale === 'en' ? (tab === 'student' ? 'Child' : 'Parent') : (tab === 'student' ? 'مخدوم' : 'ولي أمر')}
                  </span>
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
                  <Input label={currentLocale === 'en' ? 'Full Name' : 'الاسم بالكامل'} placeholder="e.g. John Doe" icon="person" error={errors.fullName?.message} {...register('fullName')} />
                  <Input label={currentLocale === 'en' ? 'Phone Number' : 'رقم الهاتف'} type="tel" placeholder="+20..." icon="call" error={errors.phoneNumber?.message} {...register('phoneNumber')} />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label={currentLocale === 'en' ? 'Birth Date' : 'تاريخ الميلاد'} type="date" {...register('birthDate')} />
                    <div className="space-y-2">
                      <label className="block text-xs font-bold tracking-wide text-on-surface uppercase">{currentLocale === 'en' ? 'Gender' : 'النوع'}</label>
                      <select className="w-full h-11 bg-surface-container rounded-lg border border-outline-variant px-4 font-semibold text-sm text-on-surface outline-none focus:border-primary transition-colors" {...register('gender')}>
                        <option value="">{currentLocale === 'en' ? 'Select...' : 'اختر...'}</option>
                        <option value="male">{currentLocale === 'en' ? 'Male' : 'ذكر'}</option>
                        <option value="female">{currentLocale === 'en' ? 'Female' : 'أنثى'}</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold tracking-wide text-on-surface uppercase">{currentLocale === 'en' ? 'Branch / Church' : 'الفرع / الكنيسة'}</label>
                    <select className="w-full h-12 bg-surface-container-low rounded-xl border border-outline-variant px-4 font-semibold text-sm text-on-surface outline-none focus:border-primary transition-colors" {...register('branchId')}>
                      <option value="">{currentLocale === 'en' ? 'Select Branch...' : 'اختر الكنيسة...'}</option>
                      {branches.map((b) => (<option key={b.id} value={b.id}>{b.name}</option>))}
                    </select>
                  </div>
                  {activeTab === 'student' && (
                    <div className="space-y-2">
                      <label className="block text-xs font-bold tracking-wide text-on-surface uppercase">{currentLocale === 'en' ? 'Class/Grade' : 'الفصل الدراسي'}</label>
                      <select className="w-full h-12 bg-surface-container-low rounded-xl border border-outline-variant px-4 font-semibold text-sm text-on-surface outline-none focus:border-primary transition-colors" {...register('classId')}>
                        <option value="">{currentLocale === 'en' ? 'Select Class...' : 'اختر الفصل...'}</option>
                        {classes.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                      </select>
                    </div>
                  )}
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
                  <Input label={currentLocale === 'en' ? 'Email Address' : 'عنوان البريد الإلكتروني'} type="email" placeholder="explorer@path.com" icon="mail" error={errors.email?.message} {...register('email')} />
                  <Input label={currentLocale === 'en' ? 'Password' : 'كلمة المرور'} type="password" placeholder="••••••••" icon="lock" showPasswordToggle error={errors.password?.message} {...register('password')} />
                  {watchedPassword && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-on-surface-variant">
                        <span>{currentLocale === 'en' ? 'Password Strength:' : 'قوة كلمة المرور:'}</span>
                        <span className="capitalize">{strength.label}</span>
                      </div>
                      <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-300 ${strength.color}`} style={{ width: `${(passwordStrength / 5) * 100}%` }} />
                      </div>
                    </div>
                  )}
                  <Input label={currentLocale === 'en' ? 'Confirm Password' : 'تأكيد كلمة المرور'} type="password" placeholder="••••••••" icon="lock" showPasswordToggle error={errors.confirmPassword?.message} {...register('confirmPassword')} />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-4 mt-8 pt-4 border-t border-outline-variant/30">
              {step > 1 && (
                <Button type="button" variant="outline" size="lg" onClick={prevStep} className="flex-1 rounded-xl">
                  {currentLocale === 'en' ? 'Back' : 'رجوع'}
                </Button>
              )}
              {step < totalSteps ? (
                <Button type="button" variant="primary" size="lg" onClick={nextStep} className="flex-1 rounded-xl">
                  {currentLocale === 'en' ? 'Next' : 'التالي'}
                </Button>
              ) : (
                <Button type="submit" variant="primary" size="lg" loading={loading} className="flex-1 rounded-xl">
                  {currentLocale === 'en' ? 'Finish Registration' : 'إنهاء التسجيل'}
                </Button>
              )}
            </div>

            <p className="text-center text-xs font-bold text-on-surface-variant/80 mt-6">
              {currentLocale === 'en' ? 'Already have an account?' : 'هل لديك حساب بالفعل؟'}{' '}
              <Link href="/login" className="text-primary hover:underline font-black">
                {currentLocale === 'en' ? 'Sign In' : 'تسجيل الدخول'}
              </Link>
            </p>
          </form>

        </div>
      </Card>
    </div>
  );
}
