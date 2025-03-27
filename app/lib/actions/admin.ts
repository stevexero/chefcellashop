'use server';

import { createClient } from '@/app/utils/supabase/server';
import { ColorProps } from '../../types/types';

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

/**********************/
/* Add Product Action */
/**********************/
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

/********************/
/* Add Sizes Action */
/********************/
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

/*********************/
/* Add Colors Action */
/*********************/
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

/*********************/
/* Add Images Action */
/*********************/
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

/*******************/
/* Add Size Action */
/*******************/
export async function addSizeAction(sizeText: string) {
  const supabase = await createClient();

  const { error } = await supabase.from('sizes').insert({ size: sizeText });

  if (error) {
    return { message: error.message };
  }

  return { message: 'Size added successfully!' };
}

/********************/
/* Add Color Action */
/********************/
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
