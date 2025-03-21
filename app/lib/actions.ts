'use server';

import { encodedRedirect } from '@/app/utils/utils';
import { createClient } from '@/app/utils/supabase/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

interface ColorProps {
  color_id: string;
  color_name: string;
  color_hex_code: string;
}

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

// Deprecated
// export async function uploadProductImage(file: File, productId: string) {
//   const supabase = await createClient();
//   const filePath = `${productId}/${file.name}`;

//   const { error: uploadError } = await supabase.storage
//     .from('photos')
//     .upload(filePath, file);

//   if (uploadError) {
//     console.error('Upload error:', uploadError);
//     return;
//   }

//   const publicUrlData = supabase.storage.from('photos').getPublicUrl(filePath);
//   const publicUrl = publicUrlData.data.publicUrl;

//   if (!publicUrl) {
//     console.error('Error getting public URL');
//     return;
//   }

//   const { error: dbError } = await supabase
//     .from('product_images')
//     .insert([{ product_id: productId, image_url: publicUrl }]);

//   if (dbError) {
//     console.error('Error inserting image record:', dbError);
//   } else {
//     console.log('Image uploaded and record created successfully!');
//   }
// }

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

export async function addItemToCartAction(formData: FormData) {
  console.log('**************************************************');
  console.log('addItemToCartAction Fired');
  console.log('addItemToCartAction formData', formData);
  const productId = formData.get('productId') as string;
  let sizeId = (formData.get('sizeId') as string | null) || null;
  const colorId = (formData.get('colorId') as string | null) || null;
  const quantityStr = formData.get('quantity') as string;
  const quantity = parseInt(quantityStr, 10) || 1;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id || null;

  const { data: product, error: productError } = await supabase
    .from('products')
    .select('base_price')
    .eq('product_id', productId)
    .single();

  if (productError) {
    // console.log('////////////////////////////');
    // console.log(productError.message);
    // console.log('////////////////////////////');
    return { error: productError.message };
  }

  console.log(sizeId);

  if (sizeId === 'one-size') {
    sizeId = null; // Treat 'one-size' as no size in the database
  }

  //   let price = 0;
  //   if (sizeId !== 'one-size') {
  //     let priceMod = 0;
  //     if (sizeId) {
  //       const { data: sizeMod, error: sizeError } = await supabase
  //         .from('product_sizes')
  //         .select('price_mod')
  //         .eq('product_id', productId)
  //         .eq('size_id', sizeId)
  //         .single();
  //       if (sizeError && sizeError.code !== 'PGRST116') {
  //         // console.log('////////////////////////////');
  //         // console.log(sizeError.message);
  //         // console.log('////////////////////////////');
  //         return { error: sizeError.message };
  //       }
  //       priceMod = sizeMod?.price_mod || 0;
  //     }

  //     price = product.base_price + priceMod;
  //   } else {
  //     price = product.base_price;
  //   }

  let price = product.base_price;
  if (sizeId) {
    const { data: sizeMod, error: sizeError } = await supabase
      .from('product_sizes')
      .select('price_mod')
      .eq('product_id', productId)
      .eq('size_id', sizeId)
      .single();
    if (sizeError && sizeError.code !== 'PGRST116') {
      console.log('////////////////////////////');
      console.log(sizeError.message);
      console.log('////////////////////////////');
      return { error: sizeError.message };
    }
    price = product.base_price + (sizeMod?.price_mod || 0);
  }

  console.log('------------------------------------------------');
  console.log(price);
  console.log('------------------------------------------------');

  let cartQuery = supabase
    .from('carts')
    .select('cart_id')
    .single() as unknown as Promise<
    PostgrestSingleResponse<{ cart_id: string }>
  >;

  if (userId) {
    cartQuery = supabase
      .from('carts')
      .select('cart_id')
      .eq('user_id', userId)
      .single() as unknown as Promise<
      PostgrestSingleResponse<{ cart_id: string }>
    >;
  } else {
    cartQuery = supabase
      .from('carts')
      .select('cart_id')
      .is('user_id', null)
      .single() as unknown as Promise<
      PostgrestSingleResponse<{ cart_id: string }>
    >;
  }

  const { data: cart, error: cartError } = await cartQuery;
  if (cartError && cartError.code !== 'PGRST116') {
    // console.log('////////////////////////////');
    // console.log(cartError.message);
    // console.log('////////////////////////////');
    return { error: cartError.message };
  }

  let cartId = cart?.cart_id;

  if (!cartId) {
    const { data: newCart, error: newCartError } = await supabase
      .from('carts')
      .insert([{ user_id: userId }])
      .select('cart_id')
      .single();
    if (newCartError) return { error: newCartError.message };
    cartId = newCart.cart_id;
  }

  // Check for existing cart item
  //   const { data: existingItem, error: fetchError } = await supabase
  //     .from('cart_items')
  //     .select('cart_item_id, quantity')
  //     .eq('cart_id', cartId)
  //     .eq('product_id', productId)
  //     .eq('size_id', sizeId || null)
  //     .eq('color_id', colorId || null)
  //     .single();
  const { data: existingItem, error: fetchError } = await supabase
    .from('cart_items')
    .select('cart_item_id, quantity')
    .eq('cart_id', cartId)
    .eq('product_id', productId)
    .match({ size_id: sizeId, color_id: colorId }) // Use match for null-safe comparison
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.log('////////////////////////////');
    console.log(fetchError.message);
    console.log('////////////////////////////');
    // PGRST116 = no rows found
    return { error: fetchError.message };
  }

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    const { error: updateError } = await supabase
      .from('cart_items')
      .update({ quantity: newQuantity })
      .eq('cart_item_id', existingItem.cart_item_id);

    if (updateError) return { error: updateError.message };
  } else {
    const { error: insertError } = await supabase.from('cart_items').insert([
      {
        cart_id: cartId,
        product_id: productId,
        size_id: sizeId,
        color_id: colorId,
        quantity,
        price,
      },
    ]);

    if (insertError) {
      //   console.log('////////////////////////////');
      //   console.log(insertError.message);
      //   console.log('////////////////////////////');
      return { error: insertError.message };
    }
  }

  return { message: 'Item added to cart successfully' };
}

// export async function addItemToCart(formData: FormData) {
//   const supabase = await createClient();

//   const productId = formData.get('productId') as string;
//   const size = formData.get('size') as string | null;
//   const quantityStr = formData.get('quantity') as string;
//   const quantity = parseInt(quantityStr, 10) || 1;
//   const userId = (formData.get('userId') as string) || null;

//   let cartQuery;

//   if (userId) {
//     cartQuery = supabase
//       .from('carts')
//       .select('*')
//       .eq('user_id', userId)
//       .single();
//   } else {
//     cartQuery = supabase.from('carts').select('*').is('user_id', null).single();
//   }

//   const { data: cart } = await cartQuery;

//   let cartId: string | null = null;

//   if (cart) {
//     cartId = cart.cart_id;
//   } else {
//     const { data: newCart, error: newCartError } = await supabase
//       .from('carts')
//       .insert([{ user_id: userId }])
//       .select('*')
//       .single();
//     if (newCartError) throw new Error(newCartError.message);
//     cartId = newCart.cart_id;
//   }

//   const { error: insertError } = await supabase
//     .from('cart_items')
//     .insert([{ cart_id: cartId, product_id: productId, size, quantity }]);
//   if (insertError) throw new Error(insertError.message);

//   return;
// }

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

// Creates new category
export const addCategoryAction = async (formData: FormData) => {
  const categoryName = formData.get('add-category-field') as string;

  const sanitizedCategoryName = categoryName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9\-]/g, '');

  const supabase = await createClient();

  const { error } = await supabase
    .from('categories')
    .insert([{ category_name: sanitizedCategoryName }]);

  if (error) {
    return { message: error.message };
  }

  return { message: 'Category created successfully!' };
};

// Initialize and add product - Step 1
export const addProductAction = async (formData: FormData) => {
  const categoryId = formData.get('category_id') as string;
  const productName = formData.get('product_name') as string;
  const productDescription = formData.get('description') as string;
  const basePrice = formData.get('base_price') as string;

  const sanitizedProductName = productName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9\-]/g, '');

  const numericPrice = parseFloat(basePrice);
  if (isNaN(numericPrice)) {
    return { message: 'Price is not a valid number' };
  }

  const productData = {
    category_id: categoryId,
    product_name: sanitizedProductName,
    description: productDescription,
    base_price: numericPrice,
  };

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .insert([productData])
    .select('*')
    .single();

  if (error) {
    return { message: error.message };
  }

  return {
    message: 'Product added successfully!',
    product_id: data.product_id,
  };
};

// Adds sizes to product - Step 2
export const addSizesAction = async (formData: FormData) => {
  const productId = formData.get('product_id') as string;
  const selectedSizesStr = formData.get('selectedSizes') as string;
  const sizePriceModifiersStr = formData.get('sizePriceModifiers') as string;

  let selectedSizes = [];
  let sizePriceModifiers = [];
  try {
    selectedSizes = JSON.parse(selectedSizesStr);
    sizePriceModifiers = JSON.parse(sizePriceModifiersStr);
  } catch (error) {
    console.error('Error parsing sizes data:', error);
    return { message: 'Error parsing sizes data' };
  }

  const supabase = await createClient();

  for (const size of selectedSizes) {
    const modifierObj = sizePriceModifiers.find(
      (mod: { size_id: string; price_mod: number }) =>
        mod.size_id === size.size_id
    );
    const priceMod = modifierObj ? modifierObj.price_mod : 0;

    const { error } = await supabase.from('product_sizes').insert([
      {
        product_id: productId,
        size_id: size.size_id,
        price_mod: priceMod,
      },
    ]);

    if (error) {
      console.error('Error inserting size:', error);
      return { message: error.message };
    }
  }

  return { message: 'Sizes added successfully!' };
};

export const addColorsAction = async (formData: FormData) => {
  const productId = formData.get('product_id') as string;
  const selectedColorsStr = formData.get('selectedColors') as string;

  let selectedColors = [];
  try {
    selectedColors = JSON.parse(selectedColorsStr);
  } catch (error) {
    console.error('Error parsing colors data:', error);
    return { message: 'Error parsing colors data' };
  }

  const supabase = await createClient();

  for (const color of selectedColors) {
    const { error } = await supabase.from('product_colors').insert([
      {
        product_id: productId,
        color_id: color.color_id,
      },
    ]);

    if (error) {
      console.error('Error inserting color:', error);
      return { message: error.message };
    }
  }

  return { message: 'Colors added successfully!' };
};

export async function addImagesAction(formData: FormData) {
  const productId = formData.get('product_id') as string;
  const files = formData.getAll('files') as File[];
  const imageColorAssignmentsStr = formData.get(
    'imageColorAssignments'
  ) as string;

  if (!files || files.length === 0) {
    return { message: 'No images provided' };
  }

  let imageColorAssignments: { [key: number]: ColorProps | null } = {};

  try {
    imageColorAssignments = JSON.parse(imageColorAssignmentsStr || '{}');
  } catch (error) {
    console.error('Error parsing imageColorAssignments:', error);
    return { message: 'Error parsing image color assignments' };
  }

  const supabase = await createClient();
  const uploadedImages: { url: string; color_id?: string }[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = `${productId}/${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error('Upload error for file', file.name, ':', uploadError);
      return {
        message: `Failed to upload image ${file.name}: ${uploadError.message}`,
      };
    }

    const { data: publicUrlData } = supabase.storage
      .from('photos')
      .getPublicUrl(filePath);
    const publicUrl = publicUrlData.publicUrl;

    if (!publicUrl) {
      console.error('Error getting public URL for file', file.name);
      return { message: `Failed to get public URL for image ${file.name}` };
    }

    const imageRecord: {
      product_id: string;
      image_url: string;
      color_id?: string;
    } = {
      product_id: productId,
      image_url: publicUrl,
    };

    const assignedColor = imageColorAssignments[i];
    if (assignedColor && assignedColor.color_id) {
      imageRecord.color_id = assignedColor.color_id;
    }

    const { error: dbError } = await supabase
      .from('product_images')
      .insert([imageRecord]);

    if (dbError) {
      console.error(
        'Error inserting image record for',
        file.name,
        ':',
        dbError
      );
      return {
        message: `Failed to insert image record for ${file.name}: ${dbError.message}`,
      };
    }

    uploadedImages.push({ url: publicUrl, color_id: assignedColor?.color_id });
  }

  return { message: 'Images added successfully!', uploadedImages };
}

// Create new size
export async function addSizeAction(sizeText: string) {
  const supabase = await createClient();

  const { error } = await supabase.from('sizes').insert({ size: sizeText });

  if (error) {
    return { message: error.message };
  }

  return { message: 'Size added successfully!' };
}

// Create new color
export async function addColorAction(formData: FormData) {
  const colorName = formData.get('color_name') as string;
  const colorHex = formData.get('color_hex_code') as string;

  const supabase = await createClient();

  const { error } = await supabase
    .from('colors')
    .insert({ color_name: colorName, color_hex_code: colorHex });

  if (error) {
    return { message: error.message };
  }

  return { message: 'Color added successfully!' };
}
