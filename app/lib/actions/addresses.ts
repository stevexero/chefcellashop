'use server';

import { createClient } from '@/app/utils/supabase/server';

/******************/
/* Create Address */
/******************/
export async function createAddressAction(formData: FormData) {
  const tempUserId = formData.get('profileId') as string;
  const streetAddress = formData.get('street_address') as string;
  const streetAddress2 = formData.get('street_address_2') as string;
  const city = formData.get('city') as string;
  const state = formData.get('state') as string;
  const postalCode = formData.get('postal_code') as string;
  const country = formData.get('country') as string;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('addresses')
    .insert([
      {
        temp_user_id: tempUserId,
        street_address: streetAddress,
        street_address_2: streetAddress2,
        city: city,
        state: state,
        postal_code: postalCode,
        country: country,
      },
    ])
    .select('address_id')
    .single();

  if (error) return { error: error.message };
  return {
    message: 'Address created successfully',
    addressId: data.address_id,
  };
}
