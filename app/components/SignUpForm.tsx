'use client';

import Link from 'next/link';

// import { useState } from 'react';
// import Link from 'next/link';
// import { FormMessage } from '../ui/form-message';
// import { SubmitButton } from '../ui/submit-button';
// import { signUpAction } from '../lib/actions/actions';

export default function SignUpForm() {
  // export default function SignUpForm(props: {
  //   searchParams: { message?: string; error?: string; success?: string };
  // }) {
  //   const { message, error, success } = props.searchParams;
  //   const [formError, setFormError] = useState<string | null>(null);

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   const form = e.currentTarget;
  //   const formData = new FormData(form);
  //   const password = formData.get('password')?.toString() || '';
  //   const verifyPassword = formData.get('verify-password')?.toString() || '';

  //   if (password !== verifyPassword) {
  //     setFormError('Passwords do not match.');
  //     return;
  //   }

  //   setFormError(null);
  //   await signUpAction(formData);
  // };

  // let msgObj;
  // if (error) {
  //   msgObj = { error };
  // } else if (success) {
  //   msgObj = { success };
  // } else if (formError) {
  //   msgObj = { error: formError };
  // } else if (message) {
  //   msgObj = { message };
  // } else {
  //   msgObj = { message: '' };
  // }

  return (
    <div className='flex flex-col w-80 mx-auto border border-slate-300 mt-12 p-4 rounded-2xl shadow-2xl shadow-black'>
      <h1 className='font-bold text-2xl'>
        This feature will be available soon!
      </h1>
      <Link href='/' className='text-blue-500 underline font-semibold mt-4'>
        Go back home
      </Link>
    </div>
    // <form
    //   className='flex flex-col w-80 mx-auto border border-slate-300 mt-12 p-4 rounded-2xl shadow-2xl shadow-black'
    //   onSubmit={handleSubmit}
    // >
    //   <h1 className='text-2xl font-medium'>Sign up</h1>
    //   <p className='text-sm text text-foreground mt-2'>
    //     Already have an account?{' '}
    //     <Link className='text-primary font-medium underline' href='/sign-in'>
    //       Sign in
    //     </Link>
    //   </p>
    //   <div className='mt-4'>
    //     <FormMessage message={msgObj} />
    //   </div>
    //   <div className='flex flex-col gap-2 [&>input]:mb-3 mt-2'>
    //     <label htmlFor='email' className='text-sm'>
    //       Email
    //     </label>
    //     <input
    //       name='email'
    //       placeholder='you@example.com'
    //       required
    //       className='border p-2 rounded'
    //     />
    //     <label htmlFor='password' className='text-sm'>
    //       Password
    //     </label>
    //     <input
    //       type='password'
    //       name='password'
    //       placeholder='Your password'
    //       minLength={6}
    //       required
    //       className='border p-2 rounded'
    //     />
    //     <label htmlFor='verify-password' className='text-sm'>
    //       Verify Password
    //     </label>
    //     <input
    //       type='password'
    //       name='verify-password'
    //       placeholder='Verify password'
    //       minLength={6}
    //       required
    //       className='border p-2 rounded'
    //     />
    //     <SubmitButton pendingText='Signing up...' className='button-85 mt-4'>
    //       Sign up
    //     </SubmitButton>
    //   </div>
    // </form>
  );
}
