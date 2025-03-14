import SignUpForm from '@/app/components/SignUpForm';
import { Message } from '@/app/ui/form-message';
import { Suspense } from 'react';

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;

  return (
    <Suspense>
      <SignUpForm searchParams={searchParams} />
    </Suspense>
  );
}
