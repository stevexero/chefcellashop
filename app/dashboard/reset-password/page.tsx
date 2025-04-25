import { resetPasswordAction } from '@/app/(auth-pages)/actions/actions';
import { Button } from '@/app/ui/button';

export default async function ResetPassword() {
  return (
    <form className='flex flex-col w-full max-w-md p-4 gap-2 [&>input]:mb-4'>
      <h1 className='text-2xl font-medium'>Reset password</h1>
      <p className='text-sm text-foreground/60'>
        Please enter your new password below.
      </p>
      <label htmlFor='password'>New password</label>
      <input
        type='password'
        name='password'
        placeholder='New password'
        required
      />
      <label htmlFor='confirmPassword'>Confirm password</label>
      <input
        type='password'
        name='confirmPassword'
        placeholder='Confirm password'
        required
      />
      <Button variant='default' formAction={resetPasswordAction}>
        Reset password
      </Button>
    </form>
  );
}
