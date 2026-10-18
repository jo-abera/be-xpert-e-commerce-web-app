'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { AuthCard } from '@/components/auth/AuthCard';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/alert-message';
import { useLogin } from '@/hooks/useAuth';
import { useAuthStore } from "@/store/auth-store";
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getErrorMessage } from '@/lib/api/client';
import { hasErrors, isEmail, type FieldErrors } from '@/utils/validation';
import { parseLoginRedirect } from '@/utils/auth-redirect';
import type { LoginRequest } from '@/types/user';

export function LoginForm() {
  useDocumentTitle('Log in');
  const router = useRouter();
  const searchParams = useSearchParams();
  const state = parseLoginRedirect(searchParams);
  const token = useAuthStore((s) => s.accessToken);
  const login = useLogin();

  const [values, setValues] = useState<LoginRequest>({
    email: state.email ?? '',
    password: '',
  });
  const [errors, setErrors] = useState<FieldErrors<LoginRequest>>({});

  useEffect(() => {
    if (token && !login.isPending) {
      router.replace(state.from ?? '/profile');
    }
  }, [token, login.isPending, router, state.from]);

  if (token && !login.isPending) {
    return null;
  }

  const registerHref = state.from
    ? `/register?from=${encodeURIComponent(state.from)}`
    : '/register';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login.isPending) return;
    const next: FieldErrors<LoginRequest> = {
      email: !values.email.trim()
        ? 'Enter your email.'
        : !isEmail(values.email)
          ? 'Enter a valid email address.'
          : undefined,
      password: values.password ? undefined : 'Enter your password.',
    };
    setErrors(next);
    if (hasErrors(next)) return;
    login.mutate(
      { email: values.email.trim(), password: values.password },
      { onSuccess: (profile) => toast.success(`Welcome back, ${profile.name}`) },
    );
  };

  const set = (key: keyof LoginRequest, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  return (
    <AuthCard
      title="Log in"
      description="Access your account to check out and view your profile."
      footer={
        <>
          New here?{' '}
          <Link
            href={registerHref}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
        </>
      }
    >
      <form noValidate onSubmit={handleSubmit} className="space-y-5">
        {state.message && <Alert tone="info">{state.message}</Alert>}
        {login.isError && (
          <Alert tone="error" title="Couldn't log in">
            {getErrorMessage(login.error)}
          </Alert>
        )}
        <FormField id="login-email" label="Email" error={errors.email}>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => set('email', e.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'login-email-error' : undefined}
          />
        </FormField>
        <FormField id="login-password" label="Password" error={errors.password}>
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={values.password}
            onChange={(e) => set('password', e.target.value)}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'login-password-error' : undefined}
          />
        </FormField>
        <Button type="submit" size="lg" className="w-full" loading={login.isPending}>
          {login.isPending ? 'Logging in…' : 'Log in'}
        </Button>
      </form>
    </AuthCard>
  );
}
