'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createClient } from '@/app/lib/supabase/server';

const SignInSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be 8+ chars' }),
});

export type SignInState = { message?: string };

/**************** */
/* Sign in action */
/**************** */
export const signInAction = async (
  _prevState: SignInState,
  formData: FormData
) => {
  const payload = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const result = SignInSchema.safeParse(payload);
  if (!result.success) {
    const message = result.error.errors[0].message;
    return { message };
  }

  const { email, password } = result.data;
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { message: error.message };
  }

  redirect('/dashboard');
};

/*******************/
/* Sign out action */
/*******************/
export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect('/sign-in');
};

/*************************/
/* Reset Password Action */
/*************************/
export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!password || !confirmPassword) {
    redirect('/dashboard/reset-password');
  }

  if (password !== confirmPassword) {
    redirect('/dashboard/reset-password');
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    redirect('/dashboard/reset-password');
  }

  redirect('/dashboard/reset-password');
};
