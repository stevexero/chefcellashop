'use client';

import { useState, useEffect, useCallback } from 'react';
import { addCategoryAction } from '../../../lib/actions';
import { User } from '@supabase/supabase-js';
import { useClientStore } from '../../../store/clientStore';

interface AddProductCategoryProps {
  user: User | null;
}

interface CategoryProps {
  category_id: string;
  category_name: string;
}

export default function AddProductCategory({ user }: AddProductCategoryProps) {
  const { categoryId, setCategoryId } = useClientStore();

  const [userRole, setUserRole] = useState('');
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState<CategoryProps[]>([]);

  const addCategory = categoryId === 'add-category';

  const getUser = useCallback(async () => {
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
  }, [user]);

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

  useEffect(() => {
    if (user) {
      getUser();
    }
  }, [getUser, user]);

  const handleAddCategorySubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (userRole !== 'admin') {
      setMessage('Not authorized to add a category.');
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);

    const res = await addCategoryAction(formData);

    setMessage(res.message);

    await getCategories();
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
      {addCategory && (
        <div className='w-full flex flex-col mt-4 p-4 border rounded'>
          {message && <p className='text-red-500 text-sm'>{message}</p>}
          <form onSubmit={handleAddCategorySubmit}>
            <label htmlFor='add-category-field' className='font-bold text-sm'>
              Add Category
            </label>
            <input
              type='text'
              id='add-category-field'
              name='add-category-field'
              className='border p-2 rounded w-full'
              required
            />
            <button
              type='submit'
              className='bg-black text-white p-2 mt-4 rounded w-full'
            >
              Add Category
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
