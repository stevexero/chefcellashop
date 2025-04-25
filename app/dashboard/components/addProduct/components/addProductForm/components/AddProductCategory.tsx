'use client';

import { useState, useEffect, useCallback } from 'react';
import { addCategoryAction } from '@/app/dashboard/actions';
import { useClientStore } from '@/app/store/clientStore';
import { toast } from 'react-toastify';
import { CategoryProps } from '@/app/types/types';

export default function AddProductCategory() {
  const { categoryId, setCategoryId } = useClientStore();
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const addCategory = categoryId === 'add-category';

  const getCategories = useCallback(async () => {
    try {
      const res = await fetch(`/api/get-categories`, {
        method: 'GET',
      });

      const data = await res.json();

      if (data.error) {
        setMessage(data.error);
        return;
      }

      setCategories(data);
    } catch (error) {
      console.error(error);
      setMessage('Failed to fetch categories');
    }
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('add-category-field', newCategoryName);

    const res = await addCategoryAction(formData);
    setNewCategoryName('');

    if (res.status === 'error') {
      toast.error(res.message);
      return;
    }

    await getCategories();
    toast.success(res.message);

    if (res.category_id) {
      setCategoryId(res.category_id);
    }
  };

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  return (
    <div className='w-full flex flex-col'>
      <label className='text-sm font-bold' htmlFor='category-select'>
        Category
      </label>
      <select
        className='border p-2 rounded'
        name='category-select'
        id='category-select'
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
      >
        <option value='select-category'>Select a Category</option>
        {categories?.length > 0
          ? categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.category_name}
              </option>
            ))
          : null}
        <option value='add-category'>Add a Category</option>
      </select>
      {message && <p className='text-red-500 text-sm'>{message}</p>}

      {addCategory && (
        <div className='w-full flex flex-col mt-4 p-4 border rounded'>
          <div>
            <label htmlFor='add-category-field' className='font-bold text-sm'>
              Add Category
            </label>
            <input
              type='text'
              id='add-category-field'
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className='border p-2 rounded w-full'
              required
            />
            <button
              type='button'
              onClick={handleAddCategory}
              className='bg-black text-white p-2 mt-4 rounded w-full'
            >
              Add Category
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
