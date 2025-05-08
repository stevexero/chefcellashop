'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddCoupon() {
  const router = useRouter();

  const [type, setType] = useState('amount_off');
  const [code, setCode] = useState('');
  const [amountOff, setAmountOff] = useState(0);
  const [percentOff, setPercentOff] = useState(0);
  const [validFrom, setValidFrom] = useState('');
  const [validUntil, setValidUntil] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const coupon = {
      code: code.trim().toUpperCase(),
      type,
      amountOff,
      percentOff,
      validFrom: new Date(validFrom).toISOString(),
      validUntil: new Date(validUntil).toISOString(),
    };

    try {
      const response = await fetch('/api/add-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(coupon),
      });
      if (response.ok) {
        router.refresh();
      } else {
        console.error('Failed to add coupon');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCode('');
      setType('amount_off');
      setAmountOff(0);
      setPercentOff(0);
      setValidFrom('');
      setValidUntil('');
    }
  };

  return (
    <div className='mt-12 p-4 border border-slate-300 shadow-xl shadow-slate-400 rounded-2xl'>
      <h2 className='text-2xl font-bold'>Add Coupon</h2>
      <form onSubmit={handleSubmit}>
        <div className='flex flex-col gap-2'>
          <label className='text-xs font-bold' htmlFor='code'>
            Code (no spaces)
          </label>
          <input
            className='border border-slate-300 rounded-lg p-2'
            type='text'
            id='code'
            name='code'
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <label className='text-xs font-bold' htmlFor='type'>
            Type
          </label>
          <select
            className='border border-slate-300 rounded-lg p-2'
            id='type'
            name='type'
            onChange={(e) => setType(e.target.value)}
          >
            <option value='amount_off'>Amount Off</option>
            <option value='percent_off'>Percent Off</option>
          </select>
          {type === 'amount_off' && (
            <>
              <label className='text-xs font-bold' htmlFor='amount_off'>
                Amount Off
              </label>
              <input
                className='border border-slate-300 rounded-lg p-2'
                type='number'
                id='amount_off'
                name='amount_off'
                value={amountOff}
                onChange={(e) => setAmountOff(Number(e.target.value))}
              />
            </>
          )}
          {type === 'percent_off' && (
            <>
              <label className='text-xs font-bold' htmlFor='percent_off'>
                Percent Off
              </label>
              <input
                className='border border-slate-300 rounded-lg p-2'
                type='number'
                id='percent_off'
                name='percent_off'
                value={percentOff}
                onChange={(e) => setPercentOff(Number(e.target.value))}
              />
            </>
          )}
          {/* Valid from and to  */}
          <label className='text-xs font-bold' htmlFor='valid_from'>
            Valid From
          </label>
          <input
            className='border border-slate-300 rounded-lg p-2'
            type='date'
            id='valid_from'
            name='valid_from'
            value={validFrom}
            onChange={(e) => setValidFrom(e.target.value)}
          />
          <label className='text-xs font-bold' htmlFor='valid_to'>
            Valid To
          </label>
          <input
            className='border border-slate-300 rounded-lg p-2'
            type='date'
            id='valid_to'
            name='valid_to'
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
          />
          <button
            className='bg-black text-white px-4 py-2 rounded-lg mt-4 hover:bg-gray-800 cursor-pointer'
            type='submit'
          >
            Add Coupon
          </button>
        </div>
      </form>
    </div>
  );
}
