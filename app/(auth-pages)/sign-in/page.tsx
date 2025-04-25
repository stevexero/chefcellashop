import { Suspense } from 'react';
import LoginForm from '@/app/(auth-pages)/components/LoginForm';

export default async function Login() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
