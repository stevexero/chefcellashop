'use server';

import { encodedRedirect } from '@/app/utils/utils';
import { createClient } from '@/app/utils/supabase/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSession, setSession } from '../session';

/**************** */
/* Sign up action */
/**************** */
export const signUpAction = async (formData: FormData) => {
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();
  const verifyPassword = formData.get('verify-password')?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get('origin');

  if (!email || !password || !verifyPassword) {
    return encodedRedirect(
      'error',
      '/sign-up',
      'Email and password are required'
    );
  }

  if (password !== verifyPassword) {
    return encodedRedirect('error', '/sign-up', 'Passwords must match');
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback?redirect=/checkout`,
    },
  });

  if (error) {
    console.error(error.code + ' ' + error.message);
    return encodedRedirect('error', '/sign-up', error.message);
  } else {
    return encodedRedirect(
      'success',
      '/sign-up',
      'Thanks for signing up! Please check your email for a verification link.'
    );
  }
};

/**************** */
/* Sign in action */
/**************** */
export const signInAction = async (formData: FormData) => {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const redirectTo = (formData.get('redirect') as string) || '/dashboard';
  const supabase = await createClient();

  // Get current session to preserve cart ID
  const currentSession = await getSession();
  const cartId = currentSession.cartId || undefined;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect('error', '/sign-in', error.message);
  }

  // Store both redirect URL and cart ID in the session
  await setSession({ redirectTo, cartId });
  return redirect('/api/auth/merge-cart');
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
    encodedRedirect(
      'error',
      '/dashboard/reset-password',
      'Password and confirm password are required'
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      'error',
      '/dashboard/reset-password',
      'Passwords do not match'
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      'error',
      '/dashboard/reset-password',
      'Password update failed'
    );
  }

  encodedRedirect('success', '/dashboard/reset-password', 'Password updated');
};
