'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios, { AxiosError } from 'axios';
import { Star, CheckCircle2, AlertTriangle, MapPin, Table2 } from 'lucide-react';
import { PublicTableInfo } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const schema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  customerName: z.string().optional(),
  phone: z.string().optional(),
  language: z.enum(['en', 'bn', 'banglish']),
});
type FormData = z.infer<typeof schema>;
const ratingMeta = [
  { label: '', color: '' },
  { label: 'Poor', color: '#EF4444' },
  { label: 'Fair', color: '#F97316' },
  { label: 'Good', color: '#EAB308' },
  { label: 'Very Good', color: '#22C55E' },
  { label: 'Excellent', color: '#16A34A' },
];
function StarRating({ value, onChange, error }: { value: number; onChange: (v: number) => void; error?: boolean }) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {[1,2,3,4,5].map((star) => (
          <button key={star} type="button" onMouseEnter={() => setHovered(star)} onMouseLeave={() => setHovered(0)} onClick={() => onChange(star)} aria-label={'Rate ' + star + ' stars'} className="transition-transform active:scale-95 focus:outline-none">
            <Star className={cn('w-10 h-10 sm:w-12 sm:h-12 transition-colors', star <= display ? 'fill-current' : '')} style={{ color: star <= display ? ratingMeta[display]?.color || '#7A0E22' : '#333' }} />
          </button>
        ))}
      </div>
      <div className="h-5">
        {display > 0 && <span className="text-sm font-semibold" style={{ color: ratingMeta[display]?.color }}>{ratingMeta[display]?.label}</span>}
        {error && display === 0 && <span className="text-sm" style={{ color: '#EF4444' }}>Please select a rating</span>}
      </div>
    </div>
  );
}
export default function FeedbackPage() {
  const { qrToken } = useParams<{ qrToken: string }>();
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { data: tableInfo, isLoading, isError } = useQuery<PublicTableInfo>({
    queryKey: ['public-table', qrToken],
    queryFn: async () => { const { data } = await axios.get(BASE_URL + '/api/public/tables/' + qrToken); return data; },
    retry: false,
  });
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { rating: 0, language: 'en' },
  });
  const rating = watch('rating');
  async function onSubmit(values: FormData) {
    setSubmitError(null);
    try {
      await axios.post(BASE_URL + '/api/public/feedback', {
        qrToken, rating: values.rating, comment: values.comment || undefined,
        customerName: values.customerName || undefined, customerPhone: values.phone || undefined, language: values.language,
      });
      setSubmitted(true);
    } catch (err) {
      const e = err as AxiosError<{ error?: string }>;
      setSubmitError(e.response?.data?.error ?? 'Something went wrong. Please try again.');
    }
  }
  if (isLoading) return (<div className="min-h-screen flex items-center justify-center" style={{ background: '#000' }}><div className="flex flex-col items-center gap-3"><div className="w-10 h-10 rounded-full border-2 animate-spin" style={{ borderColor: '#7A0E22', borderTopColor: 'transparent' }} /><p className="text-sm" style={{ color: '#888' }}>Loading...</p></div></div>);
  if (isError || !tableInfo) return (<div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#000' }}><div className="w-full max-w-sm rounded-xl p-8 text-center" style={{ background: '#0A0A0A', border: '1px solid #1C1210' }}><div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{ background: 'rgba(239,68,68,0.10)' }}><AlertTriangle className="h-7 w-7" style={{ color: '#FCA5A5' }} /></div><h1 className="text-lg font-semibold mb-2" style={{ color: '#F5EDE8' }}>QR Code Not Found</h1><p className="text-sm" style={{ color: '#888' }}>This QR code is invalid or no longer active.</p></div></div>);
  if (submitted) return (<div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#000' }}><div className="w-full max-w-sm rounded-xl p-8 text-center" style={{ background: '#0A0A0A', border: '1px solid #1C1210' }}><div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-5" style={{ background: 'rgba(34,197,94,0.10)' }}><CheckCircle2 className="h-8 w-8" style={{ color: '#86EFAC' }} /></div><h1 className="text-xl font-semibold mb-2" style={{ color: '#F5EDE8' }}>Thank you!</h1><p className="text-sm" style={{ color: '#888' }}>Your feedback for <span className="font-medium" style={{ color: '#F5EDE8' }}>{tableInfo.tableLabel}</span> has been received.</p><div className="mt-5 pt-5 flex items-center justify-center gap-2" style={{ borderTop: '1px solid #1C1210' }}><div className="flex items-center justify-center w-5 h-5 rounded text-xs font-bold" style={{ background: '#7A0E22', color: '#FFF7E6' }}>SR</div><span className="text-xs" style={{ color: '#555' }}>Powered by Spice Route</span></div></div></div>);
  return (
    <div className="min-h-screen py-8 px-4" style={{ background: '#000' }}>
      <div className="max-w-md mx-auto space-y-4">
        <div className="rounded-xl p-5 text-center" style={{ background: '#0A0A0A', border: '1px solid #1C1210' }}>
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg font-bold text-sm mb-3" style={{ background: '#7A0E22', color: '#FFF7E6' }}>SR</div>
          <h1 className="text-lg font-semibold" style={{ color: '#F5EDE8' }}>{tableInfo.restaurantName}</h1>
          <div className="flex items-center justify-center gap-3 mt-1.5 text-sm" style={{ color: '#888' }}>
            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {tableInfo.branchName}</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Table2 className="h-3.5 w-3.5" /> {tableInfo.tableLabel}</span>
          </div>
        </div>
        <div className="rounded-xl p-6" style={{ background: '#0A0A0A', border: '1px solid #1C1210' }}>
          <h2 className="text-base font-semibold mb-5" style={{ color: '#F5EDE8' }}>How was your experience?</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5"><Label style={{ color: '#9A8880' }}>Your rating <span style={{ color: '#FCA5A5' }}>*</span></Label><StarRating value={rating} onChange={(v) => setValue('rating', v, { shouldValidate: true })} error={!!errors.rating} /></div>
            <div className="space-y-1.5"><Label htmlFor="comment" style={{ color: '#9A8880' }}>Comments</Label><Textarea id="comment" rows={3} placeholder="Tell us what you loved or how we can improve..." {...register('comment')} style={{ fontSize: '16px' }} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label htmlFor="customerName" style={{ color: '#9A8880' }}>Name</Label><Input id="customerName" placeholder="Your name" {...register('customerName')} style={{ fontSize: '16px' }} /></div>
              <div className="space-y-1.5"><Label htmlFor="phone" style={{ color: '#9A8880' }}>Phone</Label><Input id="phone" type="tel" placeholder="+880..." {...register('phone')} style={{ fontSize: '16px' }} /></div>
            </div>
            <div className="space-y-1.5"><Label htmlFor="language" style={{ color: '#9A8880' }}>Language</Label><select id="language" {...register('language')} className="flex h-9 w-full rounded px-3 text-sm focus:outline-none" style={{ border: '1px solid #251916', background: '#111111', color: '#F5EDE8', fontSize: '16px' }}><option value="en">English</option><option value="bn">বাংলা (Bengali)</option><option value="banglish">Banglish</option></select></div>
            {submitError && (<p className="text-sm rounded px-3 py-2" style={{ background: 'rgba(239,68,68,0.10)', color: '#FCA5A5', border: '1px solid #ef444422' }}>{submitError}</p>)}
            <Button type="submit" className="w-full h-11 font-medium" disabled={isSubmitting || rating === 0}>{isSubmitting ? 'Submitting…' : 'Submit Feedback'}</Button>
            <p className="text-center text-xs" style={{ color: '#555' }}>Your feedback may be shared with restaurant staff to improve service.</p>
          </form>
        </div>
        <div className="flex items-center justify-center gap-2"><div className="flex items-center justify-center w-5 h-5 rounded text-xs font-bold" style={{ background: '#7A0E22', color: '#FFF7E6' }}>SR</div><span className="text-xs" style={{ color: '#555' }}>Powered by Spice Route</span></div>
      </div>
    </div>
  );
}
