'use client';

import { useState } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import Link from 'next/link';
import { Button } from '@/app/ui/button';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function OnboardStripe() {
  const [accountCreatePending, setAccountCreatePending] = useState(false);
  const [accountUpdatePending, setAccountUpdatePending] = useState(false);
  const [connectedAccountUpdated, setConnectedAccountUpdated] = useState(false);
  const [deletePending, setDeletePending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectedAccountId, setConnectedAccountId] = useState<string>();

  const [website, setWebsite] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dobDay, setDobDay] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobYear, setDobYear] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [addressState, setAddressState] = useState('');
  const [addressPostalCode, setAddressPostalCode] = useState('');
  const [ssnLast4, setSsnLast4] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  const handleSignUp = async () => {
    setError(null);
    setAccountCreatePending(true);
    try {
      const res = await fetch('/api/account', { method: 'POST' });
      if (!res.ok) throw new Error((await res.json()).error);
      const { account } = await res.json();
      setConnectedAccountId(account);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setAccountCreatePending(false);
    }
  };

  const handleAddInformation = async () => {
    if (!connectedAccountId) return;
    setError(null);
    setAccountUpdatePending(true);
    try {
      const stripe = (await stripePromise) as Stripe;
      const { token, error: tokErr } = await stripe.createToken(
        'bank_account',
        {
          country: 'US',
          currency: 'usd',
          routing_number: routingNumber,
          account_number: accountNumber,
        }
      );
      if (tokErr || !token) throw new Error(tokErr?.message);
      const res = await fetch(`/api/account/${connectedAccountId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_profile: { url: website },
          individual: {
            first_name: firstName,
            last_name: lastName,
            dob: {
              day: Number(dobDay),
              month: Number(dobMonth),
              year: Number(dobYear),
            },
            address: {
              line1: addressLine1,
              city: addressCity,
              state: addressState,
              postal_code: addressPostalCode,
              country: 'US',
            },
            ssn_last_4: ssnLast4,
          },
          external_account: token.id,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setConnectedAccountUpdated(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setAccountUpdatePending(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!connectedAccountId) return;
    setError(null);
    setDeletePending(true);
    try {
      // First delete the Stripe account
      const res = await fetch(`/api/account/${connectedAccountId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error((await res.json()).error);

      // Then update the user's stripe_account_id to NULL
      const updateRes = await fetch('/api/profile/update-stripe-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stripe_account_id: null }),
      });
      if (!updateRes.ok) throw new Error('Failed to update profile');

      setConnectedAccountId(undefined);
      setConnectedAccountUpdated(false);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setDeletePending(false);
    }
  };

  return (
    <div className='mx-auto p-6'>
      <div className='banner mb-6 text-center'>
        <h1 className='text-3xl font-bold'>Set Up Your Payments</h1>
        <p className='mt-2 text-gray-700'>
          To start selling and receiving funds, you need to connect your Stripe
          account. Follow the steps below to complete your onboarding.
        </p>
      </div>

      {!connectedAccountId ? (
        <div className='text-center'>
          <Button
            onClick={handleSignUp}
            disabled={accountCreatePending}
            variant={'default'}
          >
            {accountCreatePending
              ? 'Initializing Stripe…'
              : 'Connect Stripe Account'}
          </Button>
        </div>
      ) : !connectedAccountUpdated ? (
        <div className='bg-white p-6 rounded shadow-md'>
          <h2 className='text-xl font-semibold mb-4'>Provide Your Details</h2>
          <p className='text-gray-600 mb-4'>
            We’ll collect the minimum information required by Stripe so you can
            start accepting payments.
          </p>

          <div className='form-grid grid gap-4'>
            <label>
              Website URL
              <input
                className='w-full border px-2 py-1 rounded'
                type='url'
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                required
                placeholder='https://your-site.com'
              />
            </label>

            <fieldset className='border p-4 rounded-lg'>
              <legend className='font-medium'>Your Information</legend>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-2'>
                <input
                  className='border px-2 py-1 rounded'
                  type='text'
                  placeholder='First Name'
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <input
                  className='border px-2 py-1 rounded'
                  type='text'
                  placeholder='Last Name'
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <input
                    className='border px-2 py-1 rounded'
                    type='number'
                    placeholder='MM'
                    value={dobMonth}
                    onChange={(e) => setDobMonth(e.target.value)}
                    required
                  />
                  <input
                    className='border px-2 py-1 rounded'
                    type='number'
                    placeholder='DD'
                    value={dobDay}
                    onChange={(e) => setDobDay(e.target.value)}
                    required
                  />
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <input
                    className='border px-2 py-1 rounded'
                    type='number'
                    placeholder='YYYY'
                    value={dobYear}
                    onChange={(e) => setDobYear(e.target.value)}
                  />
                  <input
                    className='border px-2 py-1 rounded'
                    type='text'
                    placeholder='SSN Last 4'
                    maxLength={4}
                    value={ssnLast4}
                    onChange={(e) => setSsnLast4(e.target.value)}
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className='border p-4 rounded-lg'>
              <legend className='font-medium'>Address</legend>
              <input
                className='border px-2 py-1 w-full rounded'
                type='text'
                placeholder='Street Address'
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                required
              />
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-2'>
                <input
                  className='border px-2 py-1 rounded'
                  type='text'
                  placeholder='City'
                  value={addressCity}
                  onChange={(e) => setAddressCity(e.target.value)}
                  required
                />
                <input
                  className='border px-2 py-1 rounded'
                  type='text'
                  placeholder='State'
                  value={addressState}
                  onChange={(e) => setAddressState(e.target.value)}
                  required
                />
                <input
                  className='border px-2 py-1 rounded'
                  type='text'
                  placeholder='Postal Code'
                  value={addressPostalCode}
                  onChange={(e) => setAddressPostalCode(e.target.value)}
                  required
                />
              </div>
            </fieldset>

            <fieldset className='border p-4 rounded-lg'>
              <legend className='font-medium'>Bank Account</legend>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-2'>
                <input
                  className='border px-2 py-1 rounded'
                  type='text'
                  placeholder='Routing Number'
                  value={routingNumber}
                  onChange={(e) => setRoutingNumber(e.target.value)}
                  required
                />
                <input
                  className='border px-2 py-1 rounded'
                  type='text'
                  placeholder='Account Number'
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  required
                />
              </div>
            </fieldset>

            <div className='flex justify-between mt-4'>
              <Button
                onClick={handleAddInformation}
                disabled={accountUpdatePending}
                variant={'default'}
              >
                {accountUpdatePending
                  ? 'Submitting details…'
                  : 'Submit for Verification'}
              </Button>
              <Button
                onClick={handleDeleteAccount}
                disabled={deletePending}
                variant={'destructive'}
              >
                {deletePending ? 'Deleting…' : 'Cancel & Delete'}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className='text-center mt-8'>
          <h2 className='text-2xl font-semibold text-black'>
            You&apos;re All Set!
          </h2>
          <p className='mt-2 text-gray-600'>
            Your information has been submitted. Stripe will review and let you
            know once you can start accepting payments.
          </p>
          <div className='flex grid-cols-1 md:grid-cols-2 gap-4 justify-center mt-8'>
            <Link href='/dashboard'>
              <Button variant={'default'}>Back to Dashboard</Button>
            </Link>
            <Button
              onClick={handleDeleteAccount}
              disabled={deletePending}
              variant={'destructive'}
            >
              {deletePending ? 'Deleting…' : 'Disconnect Stripe'}
            </Button>
          </div>
        </div>
      )}

      {error && <p className='mt-6 text-center text-red-600'>{error}</p>}
    </div>
  );
}
