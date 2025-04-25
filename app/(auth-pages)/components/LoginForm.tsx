'use client';

import { useActionState } from 'react';
// import Link from 'next/link';
import { signInAction, SignInState } from '@/app/(auth-pages)/actions/actions';

const LoginForm = () => {
  const initialState: SignInState = { message: '' };
  const [state, formAction, isPending] = useActionState(
    signInAction,
    initialState
  );

  return (
    <form
      action={formAction}
      className='flex flex-col w-80 mx-auto border border-slate-300 mt-12 p-4 rounded-2xl shadow-2xl shadow-black'
    >
      <h1 className='text-2xl font-medium'>Sign in</h1>
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
          {/* <Link
            className='text-xs text-foreground underline'
            href='/forgot-password'
          >
            Forgot Password?
          </Link> */}
        </div>
        <input
          type='password'
          name='password'
          placeholder='Your password'
          required
          className='border p-2 rounded'
        />

        {state.message && (
          <p className='mt-2 text-red-600' role='alert'>
            {state.message}
          </p>
        )}

        <button type='submit' disabled={isPending} className='button-85 mt-4'>
          {isPending ? 'Signing in…' : 'Sign in'}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
