'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { AuthCard } from '@/components/auth/AuthCard';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/alert-message';
import { useRegister } from '@/hooks/useAuth';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { authApi } from '@/lib/api';
import { getErrorMessage } from '@/lib/api/client';
import { hasErrors, isEmail, type FieldErrors } from '@/utils/validation';
import { buildLoginHref, parseLoginRedirect } from '@/utils/auth-redirect';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

type EmailStatus = 'idle' | 'checking' | 'available' | 'taken' | 'unknown';

function validate(v: RegisterForm): FieldErrors<RegisterForm> {
  return {
    name: v.name.trim().length >= 2 ? undefined : 'Enter your name (at least 2 characters).',
    email: !v.email.trim() ? 'Enter your email.' : !isEmail(v.email) ? 'Enter a valid email address.' : undefined,
    password: !v.password ?
    'Create a password.' :
    !/^[a-zA-Z0-9]{4,}$/.test(v.password) ?
    'Use at least 4 characters — letters and numbers only.' :
    undefined,
    confirmPassword: !v.confirmPassword ?
    'Confirm your password.' :
    v.confirmPassword !== v.password ?
    'Passwords do not match.' :
    undefined
  };
}

const fieldConfig: Array<{key: keyof RegisterForm;label: string;type: string;autoComplete: string;hint?: string;}> = [
{ key: 'name', label: 'Name', type: 'text', autoComplete: 'name' },
{ key: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
{ key: 'password', label: 'Password', type: 'password', autoComplete: 'new-password', hint: 'At least 4 characters, letters and numbers.' },
{ key: 'confirmPassword', label: 'Confirm password', type: 'password', autoComplete: 'new-password' }];


export function RegisterForm() {
  useDocumentTitle('Create account');
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = parseLoginRedirect(searchParams).from;
  const register = useRegister();

  const [values, setValues] = useState<RegisterForm>({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<FieldErrors<RegisterForm>>({});
  const [emailStatus, setEmailStatus] = useState<EmailStatus>('idle');

  const set = (key: keyof RegisterForm, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
    if (key === 'email') setEmailStatus('idle');
  };

  const checkEmail = async () => {
    const email = values.email.trim();
    if (!isEmail(email)) return;
    setEmailStatus('checking');
    try {
      const { isAvailable } = await authApi.isEmailAvailable(email);
      setEmailStatus(isAvailable ? 'available' : 'taken');
    } catch {
      setEmailStatus('unknown');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (register.isPending) return;
    const next = validate(values);
    if (emailStatus === 'taken') next.email = 'An account with this email already exists.';
    setErrors(next);
    if (hasErrors(next)) return;
    const name = values.name.trim();
    register.mutate(
      {
        name,
        email: values.email.trim(),
        password: values.password,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=18181b&color=fafafa`
      },
      {
        onSuccess: (user) => {
          toast.success('Account created');
          router.push(
            buildLoginHref({
              from,
              email: user.email,
              message: 'Your account is ready. Log in to continue.',
            }),
          );
        }
      }
    );
  };

  const emailHint =
  emailStatus === 'checking' ?
  'Checking availability…' :
  emailStatus === 'available' ?
  'This email is available.' :
  emailStatus === 'taken' ?
  undefined :
  undefined;

  return (
    <AuthCard
      title="Create an account"
      description="Register to save your details and complete checkout."
      footer={
      <>
          Already have an account?{' '}
          <Link href={buildLoginHref({ from })} className="font-medium text-primary underline-offset-4 hover:underline">
            Log in
          </Link>
        </>
      }>
      
      <form noValidate onSubmit={handleSubmit} className="space-y-5">
        {register.isError && <Alert tone="error" title="Registration failed">{getErrorMessage(register.error)}</Alert>}
        {fieldConfig.map((f) => {
          const id = `register-${f.key}`;
          const error = f.key === 'email' && emailStatus === 'taken' && !errors.email ? 'An account with this email already exists.' : errors[f.key];
          return (
            <FormField key={f.key} id={id} label={f.label} error={error} hint={f.key === 'email' ? emailHint : f.hint}>
              <Input
                id={id}
                type={f.type}
                autoComplete={f.autoComplete}
                value={values[f.key]}
                onChange={(e) => set(f.key, e.target.value)}
                onBlur={f.key === 'email' ? checkEmail : undefined}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${id}-error` : `${id}-hint`} />
              
            </FormField>);

        })}
        <Button type="submit" size="lg" className="w-full" loading={register.isPending}>
          {register.isPending ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
    </AuthCard>);

}