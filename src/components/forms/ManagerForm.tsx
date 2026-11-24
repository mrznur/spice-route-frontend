'use client';

import { useForm, Controller, Control, FieldValues, Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { BranchResponse, ManagerResponse } from '@/types';

const createSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  branchIds: z.array(z.string()),
});
const updateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  active: z.boolean().optional(),
  branchIds: z.array(z.string()),
});

export type CreateManagerFormData = z.infer<typeof createSchema>;
export type UpdateManagerFormData = z.infer<typeof updateSchema>;

interface CreateManagerFormProps {
  mode: 'create';
  branches: BranchResponse[];
  branchesLoading: boolean;
  onSubmit: (data: CreateManagerFormData) => Promise<void>;
}
interface UpdateManagerFormProps {
  mode: 'update';
  defaultValues: ManagerResponse;
  branches: BranchResponse[];
  branchesLoading: boolean;
  onSubmit: (data: UpdateManagerFormData) => Promise<void>;
}
type ManagerFormProps = CreateManagerFormProps | UpdateManagerFormProps;

export function ManagerForm(props: ManagerFormProps) {
  if (props.mode === 'create') return <CreateForm {...props} />;
  return <UpdateForm {...props} />;
}

function CreateForm({ branches, branchesLoading, onSubmit }: CreateManagerFormProps) {
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<CreateManagerFormData>({
    resolver: zodResolver(createSchema),
    defaultValues: { branchIds: [] },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="name">Name <span style={{ color: 'var(--ds-red-text)' }}>*</span></Label>
        <Input id="name" placeholder="Alex Chen" {...register('name')} className={errors.name ? 'border-[var(--ds-red)]' : ''} />
        {errors.name && <p className="text-xs" style={{ color: 'var(--ds-red-text)' }}>{errors.name.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email <span style={{ color: 'var(--ds-red-text)' }}>*</span></Label>
        <Input id="email" type="email" placeholder="alex@restaurant.com" {...register('email')} className={errors.email ? 'border-[var(--ds-red)]' : ''} />
        {errors.email && <p className="text-xs" style={{ color: 'var(--ds-red-text)' }}>{errors.email.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Password <span style={{ color: 'var(--ds-red-text)' }}>*</span></Label>
        <Input id="password" type="password" placeholder="At least 6 characters" {...register('password')} className={errors.password ? 'border-[var(--ds-red)]' : ''} />
        {errors.password && <p className="text-xs" style={{ color: 'var(--ds-red-text)' }}>{errors.password.message}</p>}
      </div>
      <BranchSelector control={control} branches={branches} branchesLoading={branchesLoading} name="branchIds" />
      <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating…' : 'Create Manager'}</Button>
    </form>
  );
}

function UpdateForm({ defaultValues, branches, branchesLoading, onSubmit }: UpdateManagerFormProps) {
  const { register, handleSubmit, control, watch, setValue, formState: { errors, isSubmitting } } = useForm<UpdateManagerFormData>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      name: defaultValues.name,
      active: defaultValues.active,
      branchIds: defaultValues.branches.map((b) => b.id),
    },
  });
  const active = watch('active');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="name">Name <span style={{ color: 'var(--ds-red-text)' }}>*</span></Label>
        <Input id="name" {...register('name')} className={errors.name ? 'border-[var(--ds-red)]' : ''} />
        {errors.name && <p className="text-xs" style={{ color: 'var(--ds-red-text)' }}>{errors.name.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label>Email</Label>
        <Input value={defaultValues.email} disabled />
        <p className="text-xs" style={{ color: 'var(--ds-text-3)' }}>Email cannot be changed.</p>
      </div>
      <div className="flex items-center gap-3">
        <Switch id="active" checked={active ?? true} onCheckedChange={(v) => setValue('active', v)} />
        <Label htmlFor="active" className="cursor-pointer">Active</Label>
      </div>
      <BranchSelector control={control} branches={branches} branchesLoading={branchesLoading} name="branchIds" />
      <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : 'Save Changes'}</Button>
    </form>
  );
}

function BranchSelector<T extends FieldValues>({
  control, branches, branchesLoading, name,
}: {
  control: Control<T>;
  branches: BranchResponse[];
  branchesLoading: boolean;
  name: Path<T>;
}) {
  return (
    <div className="space-y-2">
      <Label>Assign branches</Label>
      {branchesLoading ? (
        <div className="space-y-2"><Skeleton className="h-5 w-32" /><Skeleton className="h-5 w-28" /></div>
      ) : branches.length === 0 ? (
        <p className="text-sm italic" style={{ color: 'var(--ds-text-3)' }}>No branches available. Create a branch first.</p>
      ) : (
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              {branches.map((branch) => {
                const value = field.value as string[];
                const checked = value.includes(branch.id);
                return (
                  <div key={branch.id} className="flex items-center gap-2.5">
                    <Checkbox
                      id={`branch-${branch.id}`}
                      checked={checked}
                      onCheckedChange={(v) => {
                        const current = field.value as string[];
                        field.onChange(v ? [...current, branch.id] : current.filter((id) => id !== branch.id));
                      }}
                    />
                    <label htmlFor={`branch-${branch.id}`} className="text-sm cursor-pointer" style={{ color: 'var(--ds-text)' }}>
                      {branch.name}
                      {branch.address && <span className="ml-1 text-xs" style={{ color: 'var(--ds-text-3)' }}>· {branch.address}</span>}
                    </label>
                  </div>
                );
              })}
            </div>
          )}
        />
      )}
    </div>
  );
}
