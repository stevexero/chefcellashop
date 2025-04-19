// stripe.d.ts
import type { StripeBankAccountData, TokenResponse } from '@stripe/stripe-js';

declare module '@stripe/stripe-js' {
  interface Stripe {
    createToken(
      type: 'bank_account',
      data: StripeBankAccountData
    ): Promise<TokenResponse>;
  }
}
