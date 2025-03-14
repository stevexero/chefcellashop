import { Suspense } from 'react';
import { Message } from '@/app/ui/form-message';
import LoginForm from '@/app/components/LoginForm';

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <Suspense>
      <LoginForm searchParams={searchParams} />
    </Suspense>
  );
}
