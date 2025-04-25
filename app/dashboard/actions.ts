'use server';

import { createClient } from '@/app/lib/supabase/server';
import { sendEmail } from '@/app/utils/email';
import { generateEmailAccessRequestEmail } from '@/app/utils/emailTemplates';

/***********************/
/* Add Category Action */
/***********************/
export const addCategoryAction = async (formData: FormData) => {
  const categoryName = formData.get('add-category-field') as string;

  const sanitizedCategoryName = categoryName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9\-]/g, '');

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('categories')
    .insert([{ category_name: sanitizedCategoryName }])
    .select('*')
    .single();

  if (error) {
    return { status: 'error', message: error.message };
  }

  return {
    status: 'success',
    message: 'Category created successfully!',
    category_id: data.category_id,
  };
};

/*******************************/
/* Request Email Access Action */
/*******************************/
export const requestEmailAccessAction = async (formData: FormData) => {
  const profileId = formData.get('profile_id') as string;
  const firstName = formData.get('first_name') as string;
  const lastName = formData.get('last_name') as string;

  try {
    await sendEmail({
      user: process.env.SMTP_USER_EMAIL_REQUESTS || '',
      from: process.env.SMTP_FROM_EMAIL_REQUESTS || '',
      pass: process.env.SMTP_PASSWORD_EMAIL_REQUESTS || '',
      to: 'emailrequests@chefcella.com',
      subject: `Email Access Request`,
      html: generateEmailAccessRequestEmail({
        profileId: profileId,
        firstName: firstName,
        lastName: lastName,
      }),
    });

    const supabase = await createClient();

    const { error } = await supabase
      .from('profiles')
      .update({ email_request_sent: true })
      .eq('profile_id', profileId)
      .select('*')
      .single();

    if (error) {
      return { status: 'error', message: error.message };
    }

    return { status: 'success', message: 'Email access request sent' };
  } catch (emailError) {
    console.error('Failed to send email access request email:', emailError);
    return {
      status: 'error',
      message: 'Failed to send email access request email',
    };
  }
};
