import { setCustomerCookiesAction } from '@/app/lib/actions/customers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  const result = await setCustomerCookiesAction(formData);

  if (!result.success) {
    return NextResponse.json(
      { error: 'Failed to set cookies' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
