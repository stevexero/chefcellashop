import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/app/utils/stripe/stripe';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: accountId } = await params;

  const {
    business_profile,
    individual,
    external_account, // token.id from Stripe.js
  } = await req.json();

  try {
    // 1) Record ToS acceptance and set business_type
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '0.0.0.0';
    await stripe.accounts.update(accountId, {
      business_type: 'individual', // required when sending individual
      business_profile,
      individual,
      tos_acceptance: {
        date: Math.floor(Date.now() / 1000),
        ip,
      },
    });

    // 2) Attach the bank token
    await stripe.accounts.createExternalAccount(accountId, {
      external_account,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error updating account:', err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: accountId } = await params;
  try {
    const deleted = await stripe.accounts.del(accountId);
    return NextResponse.json({ deleted });
  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}
