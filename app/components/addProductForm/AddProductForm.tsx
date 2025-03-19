'use client';

import { useCallback, useEffect, useState } from 'react';
import { useClientStore } from '../../store/clientStore';
import { User } from '@supabase/supabase-js';
import ProductName from './components/ProductName';
import ProductBasePrice from './components/ProductBasePrice';
import ProductDescription from './components/ProductDescription';
import ProductSizes from './components/ProductSizes';
import ProductImages from './components/ProductImages';
import { useStore } from './store';
import ProductColors from './components/ProductColors';
import ScaleLoader from 'react-spinners/ScaleLoader';
import AddProductCategory from './components/AddProductCategory';
import { toast } from 'react-toastify';

interface AddProductCategoryProps {
  user: User | null;
}

export default function AddProductForm({ user }: AddProductCategoryProps) {
  const { categoryId, setCategoryId, toggleModal } = useClientStore();
  const {
    productName,
    setProductName,
    productBasePrice,
    setProductBasePrice,
    productDescription,
    setProductDescription,
    selectedColors,
    setSelectedColors,
    selectedSizes,
    setSelectedSizes,
    sizePriceModifiers,
    setSizePriceModifiers,
    selectedFiles,
    setSelectedFiles,
    imageColorAssignments,
    setImageColorAssignments,
    setVariedSizedSelected,
    setSizes,
    showAddSizeForm,
    toggleShowAddSizeForm,
    setSizeText,
    message,
    setMessage,
    setColors,
    showAddColorForm,
    toggleShowAddColorForm,
    setColorNameText,
    setColorHexCodeText,
    setShowColorDropdown,
  } = useStore();

  const [userRole, setUserRole] = useState('');
  const [loadingStep, setLoadingStep] = useState('');

  const getUser = useCallback(async () => {
    console.log('fetching user');
    try {
      const res = await fetch(`/api/get-profile?userId=${user?.id}`, {
        method: 'GET',
      });

      const data = await res.json();

      if (data.error) {
        setMessage(data.error);
        return;
      }

      setUserRole(data.role);
    } catch (error) {
      console.error(error);
      setMessage('Failed to fetch user');
    }
  }, [user, setMessage]);

  useEffect(() => {
    if (user) {
      getUser();
    }
  }, [getUser, user]);

  const handleAddProductSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (userRole !== 'admin') {
      setMessage('Not authorized to add a product.');
      return;
    }

    // Step 1 - Initialize
    const formData = new FormData(e.currentTarget);

    formData.append('category_id', categoryId);
    formData.append('product_name', productName);
    formData.append('base_price', productBasePrice.toString());
    formData.append('description', productDescription);

    try {
      setLoadingStep('Initializing product...');
      const res = await fetch('/api/add-product', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      if (result.message !== 'Product added successfully!') {
        setMessage(result.message);
        setLoadingStep('');
        return;
      }

      // Step 2 - Sizes
      const productId = result.product_id;

      setLoadingStep('Setting up sizes...');

      const sizesFormData = new FormData();

      sizesFormData.append('product_id', productId);
      sizesFormData.append('selectedSizes', JSON.stringify(selectedSizes));
      sizesFormData.append(
        'sizePriceModifiers',
        JSON.stringify(sizePriceModifiers)
      );

      const sizesRes = await fetch('/api/add-sizes', {
        method: 'POST',
        body: sizesFormData,
      });

      const sizesResult = await sizesRes.json();

      if (sizesResult.message !== 'Sizes added successfully!') {
        setMessage(sizesResult.message);
        setLoadingStep('');
        return;
      }

      // Step 3 - Colors
      setLoadingStep('Setting up colors...');

      const colorsFormData = new FormData();

      colorsFormData.append('product_id', productId);
      colorsFormData.append('selectedColors', JSON.stringify(selectedColors));

      const colorsRes = await fetch('/api/add-colors', {
        method: 'POST',
        body: colorsFormData,
      });

      const colorsResult = await colorsRes.json();

      if (colorsResult.message !== 'Colors added successfully!') {
        setMessage(colorsResult.message);
        setLoadingStep('');
        return;
      }

      // Step 4 - Images
      setLoadingStep('Uploading images...');
      const imagesFormData = new FormData();
      imagesFormData.append('product_id', productId);

      selectedFiles.forEach((file) => {
        imagesFormData.append('files', file);
      });

      imagesFormData.append(
        'imageColorAssignments',
        JSON.stringify(imageColorAssignments)
      );

      const imagesRes = await fetch('/api/add-images', {
        method: 'POST',
        body: imagesFormData,
      });

      const imagesResult = await imagesRes.json();

      if (imagesResult.message !== 'Images added successfully!') {
        setMessage(imagesResult.message);
        setLoadingStep('');
        return;
      }

      setLoadingStep('');
      setMessage('Product added successfully!');
      toast.success('Product Added!');
    } catch (error) {
      console.error(error);
      setMessage('Failed to add product');
      toast.error('Failed to Add Product');
      setLoadingStep('');
    } finally {
      setCategoryId('select-category');
      setProductName('');
      setProductBasePrice(0.0);
      setProductDescription('');
      setImageColorAssignments({});
      setVariedSizedSelected(false);
      setSizes([]);
      setSizePriceModifiers([]);
      setSizeText('');
      setMessage('');
      setColors([]);
      setColorNameText('');
      setColorHexCodeText('');
      setSelectedColors([]);
      setSelectedSizes([]);
      setSelectedFiles([]);
      setShowColorDropdown({});
      if (showAddSizeForm) {
        toggleShowAddSizeForm();
      }
      if (showAddColorForm) {
        toggleShowAddColorForm();
      }
      toggleModal('add-product-modal');
    }
  };

  return (
    <div className='overflow-y-scroll'>
      {loadingStep ? (
        <div className='w-full flex flex-col items-center justify-center'>
          <ScaleLoader
            color='#000000'
            loading={true}
            aria-label='Loading Spinner'
            data-testid='loader'
          />
          <p>{loadingStep}</p>
        </div>
      ) : (
        <>
          <p className='font-bold'>Add Product</p>
          {message && <p className='text-red-500 text-sm'>{message}</p>}
          <form
            className='mt-4 p-4 border rounded'
            onSubmit={handleAddProductSubmit}
          >
            <AddProductCategory user={user} />
            <ProductName />
            <ProductBasePrice />
            <ProductDescription />
            <ProductColors />
            <ProductSizes />
            <ProductImages />

            <button
              type='submit'
              className='bg-black text-white p-2 mt-4 rounded w-full cursor-pointer hover:bg-slate-700'
            >
              Add Product
            </button>
          </form>
        </>
      )}
    </div>
  );
}
