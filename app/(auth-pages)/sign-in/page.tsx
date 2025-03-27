import { Suspense } from 'react';
import { Message } from '@/app/ui/form-message';
import LoginForm from '@/app/components/LoginForm';
import { checkGuest } from '@/app/utils/auth';

export default async function Login(props: { searchParams: Promise<Message> }) {
  await checkGuest();
  const searchParams = await props.searchParams;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm searchParams={searchParams} />
    </Suspense>
  );
}
