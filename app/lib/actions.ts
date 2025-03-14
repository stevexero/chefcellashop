'use server';

import { encodedRedirect } from '@/app/utils/utils';
import { createClient } from '@/app/utils/supabase/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

// import { supabase } from '../utils/supabase';

// export async function signUpWithEmailAndPassword(
//   email: string,
//   password: string
// ) {
//   const { data, error } = await supabase.auth.signUp({
//     email: email,
//     password: password,
//   });

//   if (error) {
//     console.error('login error:', error);
//     return;
//   }

//   return data.user;
// }

// export async function login() {
//   const { data, error } = await supabase.auth.signInWithPassword({
//     email: 'steveanthony999@gmail.com',
//     password: 'bf3x!qLd',
//   });

//   if (error) {
//     console.error('login error:', error);
//     return;
//   }

//   return data.user;
// }

export const signUpAction = async (formData: FormData) => {
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();
  const verifyPassword = formData.get('verify-password')?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get('origin');

  if (!email || !password || !verifyPassword) {
    return encodedRedirect(
      'error',
      '/sign-up',
      'Email and password are required'
    );
  }

  if (password !== verifyPassword) {
    return encodedRedirect('error', '/sign-up', 'Passwords must match');
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + ' ' + error.message);
    return encodedRedirect('error', '/sign-up', error.message);
  } else {
    return encodedRedirect(
      'success',
      '/sign-up',
      'Thanks for signing up! Please check your email for a verification link.'
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect('error', '/sign-in', error.message);
  }

  return redirect('/dashboard');
};

// export async function signOut() {
//   const { error } = await supabase.auth.signOut();

//   if (error) {
//     console.error('login error:', error);
//     return;
//   }
// }

export async function uploadProductImage(file: File, productId: string) {
  const supabase = await createClient();
  const filePath = `${productId}/${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from('photos')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Upload error:', uploadError);
    return;
  }

  const publicUrlData = supabase.storage.from('photos').getPublicUrl(filePath);
  const publicUrl = publicUrlData.data.publicUrl;

  if (!publicUrl) {
    console.error('Error getting public URL');
    return;
  }

  const { error: dbError } = await supabase
    .from('product_images')
    .insert([{ product_id: productId, image_url: publicUrl }]);

  if (dbError) {
    console.error('Error inserting image record:', dbError);
  } else {
    console.log('Image uploaded and record created successfully!');
  }
}

export async function uploadAvatarImage(file: File, userId: string) {
  const supabase = await createClient();
  const bucket = 'photos';
  const newFilePath = `${userId}/${file.name}`;

  const { data: currentProfile, error: profileError } = await supabase
    .from('profiles')
    .select('avatar_url')
    .eq('profile_id', userId)
    .maybeSingle();

  if (profileError) {
    console.error('Error fetching current profile:', profileError);
    // Depending on your needs, you might return or continue.
  }

  if (currentProfile && currentProfile.avatar_url) {
    const oldUrl = currentProfile.avatar_url as string;
    // Assuming your public URL looks like:
    // https://<project>.supabase.co/storage/v1/object/public/photos/<filePath>
    const marker = '/public/photos/';
    const idx = oldUrl.indexOf(marker);
    if (idx > -1) {
      const oldFilePath = oldUrl.substring(idx + marker.length);
      const { error: removeError } = await supabase.storage
        .from(bucket)
        .remove([oldFilePath]);
      if (removeError) {
        console.error('Error removing old avatar file:', removeError);
      } else {
        console.log('Old avatar removed successfully.');
      }
    }
  }

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(newFilePath, file);

  if (uploadError) {
    console.error('Upload error:', uploadError);
    return;
  }

  const publicUrlData = supabase.storage.from(bucket).getPublicUrl(newFilePath);
  const publicUrl = publicUrlData.data.publicUrl;

  if (!publicUrl) {
    console.error('Error getting public URL');
    return;
  }

  const { error: dbError } = await supabase
    .from('profiles')
    .update([{ avatar_url: publicUrl }])
    .eq('profile_id', userId);

  if (dbError) {
    console.error('Error inserting image record:', dbError);
  } else {
    console.log('Image uploaded and record created successfully!');
  }
}

export async function updateProfileAction(formData: FormData) {
  const supabase = await createClient();
  const profile_id = formData.get('profile_id')?.toString();
  const first_name = formData.get('first_name')?.toString();
  const last_name = formData.get('last_name')?.toString();

  if (!profile_id) {
    return { error: 'Profile ID is required.' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({ first_name, last_name })
    .eq('profile_id', profile_id);

  if (error) {
    console.error('Error updating profile:', error);
    return { error: error.message };
  }

  return { message: 'Profile updated successfully!' };
}

export async function addItemToCart(formData: FormData) {
  const supabase = await createClient();

  const productId = formData.get('productId') as string;
  const size = formData.get('size') as string | null;
  const quantityStr = formData.get('quantity') as string;
  const quantity = parseInt(quantityStr, 10) || 1;
  const userId = (formData.get('userId') as string) || null;

  let cartQuery;

  if (userId) {
    cartQuery = supabase
      .from('carts')
      .select('*')
      .eq('user_id', userId)
      .single();
  } else {
    cartQuery = supabase.from('carts').select('*').is('user_id', null).single();
  }

  const { data: cart } = await cartQuery;

  let cartId: string | null = null;

  if (cart) {
    cartId = cart.cart_id;
  } else {
    const { data: newCart, error: newCartError } = await supabase
      .from('carts')
      .insert([{ user_id: userId }])
      .select('*')
      .single();
    if (newCartError) throw new Error(newCartError.message);
    cartId = newCart.cart_id;
  }

  const { error: insertError } = await supabase
    .from('cart_items')
    .insert([{ cart_id: cartId, product_id: productId, size, quantity }]);
  if (insertError) throw new Error(insertError.message);

  return;
}

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      'error',
      '/dashboard/reset-password',
      'Password and confirm password are required'
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      'error',
      '/dashboard/reset-password',
      'Passwords do not match'
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      'error',
      '/dashboard/reset-password',
      'Password update failed'
    );
  }

  encodedRedirect('success', '/dashboard/reset-password', 'Password updated');
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect('/sign-in');
};
