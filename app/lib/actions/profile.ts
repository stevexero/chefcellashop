'use server';

import { createClient } from '@/app/lib/supabase/server';

/***********************/
/* upload Avatar Image */
/***********************/
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
  }

  if (currentProfile && currentProfile.avatar_url) {
    const oldUrl = currentProfile.avatar_url as string;
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

/***********************/
/* Update Profile Action */
/***********************/
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
