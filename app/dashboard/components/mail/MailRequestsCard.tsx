import React from 'react';
import { getProfilesWithEmailRequests } from '../../data';
import { Button } from '@/app/ui/button';
import Link from 'next/link';

export default async function MailRequestsCard() {
  const profiles = await getProfilesWithEmailRequests();

  return (
    <div className='mt-12 p-4 border border-slate-300 shadow-xl shadow-slate-400 rounded-2xl'>
      <h2 className='text-2xl font-bold'>Email Requests</h2>
      <div className='flex flex-col gap-4'>
        {profiles.map((profile) => (
          <div
            className='flex flex-row items-center justify-between'
            key={profile.profile_id}
          >
            <div>{profile.first_name}</div>
            <div>{profile.last_name}</div>
            <div>{profile.email}</div>
            <Link href={`/dashboard/mail-requests/${profile.profile_id}`}>
              <Button variant='outline'>View Request</Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
