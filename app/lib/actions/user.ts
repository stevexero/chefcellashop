'use server';

import { createClient } from '@/app/utils/supabase/server';

/*********************/
/* Create Guest User */
/*********************/
export async function createGuestCustomerAction(formData: FormData) {
  const email = formData.get('email') as string;
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('temp_users')
    .insert([
      {
        email,
        first_name: firstName,
        last_name: lastName,
      },
    ])
    .select('temp_user_id')
    .single();

  if (error) return { error: error.message };

  return {
    message: 'Guest customer created successfully',
    userId: data.temp_user_id,
  };
}

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
