import { createClient } from '@/app/utils/supabase/server';

export async function getCustomerDetails() {
  const supabase = await createClient();

  // Get authenticated user (if any)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: customer } = await supabase
      .from('temp_users')
      .select('email, first_name, last_name')
      .eq('temp_user_id', user.id)
      .single();

    if (customer) {
      return {
        email: customer.email,
        firstName: customer.first_name,
        lastName: customer.last_name,
      };
    }
  }

  return null;
}
