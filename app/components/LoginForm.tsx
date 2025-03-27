'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SubmitButton } from '../ui/submit-button';
import { FormMessage } from '../ui/form-message';
import { signInAction } from '../lib/actions/actions';
import { useRouter, useSearchParams } from 'next/navigation';

const LoginForm = (props: {
  searchParams: { message?: string; error?: string; success?: string };
}) => {
  const { message, error, success } = props.searchParams;
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append('redirect', redirect);

    setFormError(null);
    console.log('****** formData ******', formData);

    // await signInAction(formData);
    const result = await signInAction(formData);
    if (!result) router.push(redirect);
  };

  let msgObj;
  if (error) {
    msgObj = { error };
  } else if (success) {
    msgObj = { success };
  } else if (formError) {
    msgObj = { error: formError };
  } else if (message) {
    msgObj = { message };
  } else {
    msgObj = { message: '' };
  }

  return (
    <form
      className='flex flex-col w-80 mx-auto border border-slate-300 mt-12 p-4 rounded-2xl shadow-2xl shadow-black'
      onSubmit={handleSubmit}
    >
      <h1 className='text-2xl font-medium'>Sign in</h1>
      <p className='text-sm text-foreground mt-2'>
        Don&apos;t have an account?{' '}
        <Link className='text-foreground font-medium underline' href='/sign-up'>
          Sign up
        </Link>
      </p>
      <div className='mt-4'>
        <FormMessage message={msgObj} />
      </div>
      <div className='flex flex-col gap-2 [&>input]:mb-3 mt-2'>
        <label htmlFor='email' className='text-sm'>
          Email
        </label>
        <input
          name='email'
          placeholder='you@example.com'
          required
          className='border p-2 rounded'
        />
        <div className='flex justify-between items-center'>
          <label htmlFor='password' className='text-sm'>
            Password
          </label>
          <Link
            className='text-xs text-foreground underline'
            href='/forgot-password'
          >
            Forgot Password?
          </Link>
        </div>
        <input
          type='password'
          name='password'
          placeholder='Your password'
          required
          className='border p-2 rounded'
        />
        <SubmitButton pendingText='Signing In...' className='button-85 mt-4'>
          Sign in
        </SubmitButton>
      </div>
    </form>
  );
};

export default LoginForm;
