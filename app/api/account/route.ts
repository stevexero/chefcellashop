// pages/api/account/route.ts

// import { stripe } from '@/app/utils/stripe/stripe';
// import { NextRequest, NextResponse } from 'next/server';

// export async function POST(req: NextRequest) {
//   console.log('Creating custom Connect account…', req);
//   try {
//     const account = await stripe.accounts.create({
//       type: 'custom', // ← CUSTOM account
//       country: 'US',
//       business_type: 'individual', // or 'company' if you’re onboarding businesses
//       capabilities: {
//         card_payments: { requested: true },
//         transfers: { requested: true },
//       },
//     });

//     return NextResponse.json({ account: account.id });
//   } catch (error) {
//     console.error(
//       'Stripe Custom account creation error:',
//       (error as Error).message
//     );
//     return NextResponse.json(
//       { error: (error as Error).message },
//       { status: 400 }
//     );
//   }
// }

import { stripe } from '@/app/utils/stripe/stripe';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';

export async function POST(req: NextRequest) {
  console.log('POST request received', req);

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const account = await stripe.accounts.create({
      controller: {
        stripe_dashboard: {
          type: 'none',
        },
        fees: {
          payer: 'application',
        },
        losses: {
          payments: 'application',
        },
        requirement_collection: 'application',
      },
      capabilities: {
        transfers: { requested: true },
      },
      country: 'US',
    });

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ stripe_account_id: account.id })
      .eq('profile_id', user.id);

    if (updateError) {
      console.error(
        'Failed to write stripe_account_id to Supabase:',
        updateError
      );
      return NextResponse.json(
        { error: 'Failed to write stripe_account_id to Supabase' },
        { status: 500 }
      );
    }

    return NextResponse.json({ account: account.id });
  } catch (error) {
    console.error(
      'An error occurred when calling the Stripe API to create an account:',
      error
    );

    // Check if it's a Stripe Connect error
    if (error instanceof Error && error.message.includes('Connect')) {
      return NextResponse.json(
        { error: 'Stripe Connect is not enabled. Please contact support.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
