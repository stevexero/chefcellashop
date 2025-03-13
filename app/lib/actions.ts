'use server';

import { supabase } from '../utils/supabase';

export async function login() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'steveanthony999@gmail.com',
    password: 'bf3x!qLd',
  });

  if (error) {
    console.error('login error:', error);
    return;
  }

  return data.user;
}

export async function uploadProductImage(file: File, productId: string) {
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
