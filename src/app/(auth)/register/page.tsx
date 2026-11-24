'use client';

import { useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { Eye, EyeOff, ArrowRight, CheckCircle, QrCode, GitBranch, Star } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth';
import type { AuthResponse, ApiError } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/* ── Validation ─────────────────────────────────────────────────────────── */

const schema = z.object({
  restaurantName: z.string().min(2, 'Restaurant name is required'),
  name:           z.string().min(2, 'Name must be at least 2 characters'),
  email:          z.string().email('Enter a valid email'),
  password:       z.string().min(8, 'Password must be at least 8 characters'),
});
type FormData = z.infer<typeof schema>;

/* ── Static data ────────────────────────────────────────────────────────── */

const textFields = [
  { name: 'restaurantName', label: 'Restaurant name', placeholder: 'Your restaurant name', autoComplete: 'organization' },
  { name: 'name',           label: 'Your name',        placeholder: 'Enter your full name',   autoComplete: 'name' },
  { name: 'email',          label: 'Work email',        placeholder: 'you@restaurant.com',     autoComplete: 'email', type: 'email' },
] as const;

const steps = [
  { icon: QrCode,    title: 'Create your account',      description: 'Set up your restaurant in minutes.' },
  { icon: GitBranch, title: 'Add branches and tables',  description: 'Give every table its own QR code.' },
  { icon: Star,      title: 'Collect guest feedback',   description: 'Turn opinions into better experiences.' },
];

const benefits = [
  '1 branch, up to 20 tables',
  'Unique QR code per table',
  'Basic analytics dashboard',
  'No credit card required',
];

/* ── Reusable FormField ─────────────────────────────────────────────────── */

function FormField({ id, label, error, children }: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && (
        <p className="text-xs" style={{ color: 'var(--ds-red-text)' }}>{error}</p>
      )}
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────────────── */

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(values: FormData) {
    try {
      const { data } = await api.post<AuthResponse>('/api/auth/register-owner', values);
      login(data);
      toast.success('Account created! Welcome to Spice Route.');
      router.push('/dashboard');
    } catch (err) {
      const apiError = (err as AxiosError<ApiError>).response?.data;
      if (apiError?.errors) {
        Object.entries(apiError.errors).forEach(([field, message]) => {
          setError(field as keyof FormData, { message });
        });
      } else {
        toast.error(apiError?.error || 'Registration failed');
      }
    }
  }

  return (
    <main className="min-h-screen flex" style={{ background: 'var(--ds-bg)' }}>

      {/* ── Branding panel ── */}
      <aside
        className="hidden lg:flex lg:w-[46%] xl:w-5/12 flex-col justify-between relative overflow-hidden p-12 xl:p-16"
        style={{ background: 'var(--ds-sidebar)', borderRight: '1px solid var(--ds-border)' }}
      >
        <div className="absolute -top-40 -left-40 w-[480px] h-[480px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(122,14,34,0.18), transparent 70%)' }} />
        <div className="absolute bottom-[-180px] right-[-160px] w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(245,124,0,0.07), transparent 70%)' }} />

        <Link href="/" className="relative z-10 w-fit">
          <Image
            src="/spice-route-logo.webp"
            alt="Spice Route"
            width={150}
            height={76}
            priority
            className="object-contain"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </Link>

        <div className="relative z-10 max-w-lg py-10">
          <p className="text-[11px] font-semibold tracking-widest uppercase mb-6"
            style={{ color: 'var(--ds-accent-text)' }}>
            Start your restaurant journey
          </p>

          <h1 className="text-4xl xl:text-5xl font-bold leading-[1.15] tracking-tight"
            style={{ color: 'var(--ds-text)' }}>
            Better feedback.<br />
            Better decisions.<br />
            <span style={{ color: 'var(--ds-accent-text)' }}>Better dining.</span>
          </h1>

          <p className="mt-5 text-sm xl:text-base leading-relaxed"
            style={{ color: 'var(--ds-text-2)', maxWidth: '22rem' }}>
            Bring every guest&apos;s voice into one place. Understand what
            works, improve what doesn&apos;t, and build experiences people remember.
          </p>

          <div className="mt-10 space-y-5">
            {steps.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded flex items-center justify-center shrink-0"
                  style={{ background: 'var(--ds-elevated)', color: 'var(--ds-accent-text)', border: '1px solid var(--ds-border)' }}
                  aria-hidden="true"
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold" style={{ color: 'var(--ds-text)' }}>{title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--ds-text-3)' }}>{description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-lg p-5"
            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid var(--ds-border)' }}>
            <p className="text-xs font-semibold tracking-widest uppercase mb-4"
              style={{ color: 'var(--ds-text-3)' }}>
              Included for free
            </p>
            <div className="space-y-3">
              {benefits.map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--ds-accent-text)' }} />
                  <span className="text-xs" style={{ color: 'var(--ds-text-2)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 flex justify-between text-xs" style={{ color: 'var(--ds-text-3)' }}>
          <span>© {new Date().getFullYear()} Spice Route</span>
          <span>Built for better dining experiences.</span>
        </div>
      </aside>

      {/* ── Registration panel ── */}
      <section
        className="flex flex-1 flex-col justify-center items-center px-6 py-10 sm:px-10 relative"
        style={{ background: 'var(--ds-bg)' }}
      >
        <div className="lg:hidden absolute top-0 left-0 right-0 h-72 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at top, rgba(122,14,34,0.1), transparent 70%)' }} />

        <div className="relative z-10 w-full max-w-[420px]">

          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex justify-center mb-10">
            <Image src="/spice-route-logo.webp" alt="Spice Route" width={130} height={66}
              priority className="object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
          </Link>

          {/* Heading */}
          <div className="mb-8">
            <p className="text-[11px] font-semibold tracking-widest uppercase mb-3"
              style={{ color: 'var(--ds-accent-text)' }}>
              Get started for free
            </p>
            <h2 className="text-2xl sm:text-[28px] font-bold tracking-tight"
              style={{ color: 'var(--ds-text)' }}>
              Create your account
            </h2>
            <p className="text-sm mt-2" style={{ color: 'var(--ds-text-2)' }}>
              Set up your restaurant and start listening to your guests.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>

            {/* Text fields rendered from config */}
            {textFields.map((field) => (
              <FormField
                key={field.name}
                id={field.name}
                label={field.label}
                error={errors[field.name]?.message}
              >
                <Input
                  id={field.name}
                  type={'type' in field ? field.type : 'text'}
                  placeholder={field.placeholder}
                  autoComplete={field.autoComplete}
                  {...register(field.name)}
                  aria-invalid={!!errors[field.name]}
                  className={`h-11 ${errors[field.name] ? 'border-[var(--ds-red)]' : ''}`}
                />
              </FormField>
            ))}

            {/* Password — separate because it needs the show/hide toggle */}
            <FormField id="password" label="Password" error={errors.password?.message}>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  {...register('password')}
                  aria-invalid={!!errors.password}
                  className={`h-11 pr-11 ${errors.password ? 'border-[var(--ds-red)]' : ''}`}
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--ds-text-3)' }}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </FormField>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 font-semibold text-sm mt-2"
              style={{ background: 'var(--ds-accent)', color: '#fff' }}
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Creating account…
                </>
              ) : (
                <>
                  Create your account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-7 pt-6 text-center" style={{ borderTop: '1px solid var(--ds-border)' }}>
            <p className="text-sm" style={{ color: 'var(--ds-text-3)' }}>
              Already have an account?{' '}
              <Link href="/login" className="font-semibold hover:underline"
                style={{ color: 'var(--ds-accent-text)' }}>
                Sign in
              </Link>
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}
