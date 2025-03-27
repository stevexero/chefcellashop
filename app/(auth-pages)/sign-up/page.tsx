import SignUpForm from '@/app/components/SignUpForm';
import { Message } from '@/app/ui/form-message';
import { checkGuest } from '@/app/utils/auth';
import { Suspense } from 'react';

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  await checkGuest();
  const searchParams = await props.searchParams;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpForm searchParams={searchParams} />
    </Suspense>
  );
}
