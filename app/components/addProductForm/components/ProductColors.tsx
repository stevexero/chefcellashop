'use client';

import { useCallback, useEffect } from 'react';
import { useStore } from '../store';

interface ColorProps {
  color_id: string;
  color_name: string;
  color_hex_code: string;
}

export default function ProductColors() {
  const {
    setMessage,
    colors,
    setColors,
    showAddColorForm,
    toggleShowAddColorForm,
    colorNameText,
    setColorNameText,
    colorHexCodeText,
    setColorHexCodeText,
    selectedColors,
    setSelectedColors,
  } = useStore();

  const getColors = useCallback(async () => {
    try {
      const res = await fetch('/api/get-colors', {
        method: 'GET',
      });

      const data = await res.json();

      if (data.error) {
        setMessage(data.error);
        return;
      }

      setColors(data);
    } catch (error) {
      console.error(error);
      setMessage('Failed to fetch colors');
    }
  }, [setMessage, setColors]);

  const handleCheckboxChange = (color: ColorProps, checked: boolean) => {
    setSelectedColors((prev) => {
      if (checked) {
        return [...prev, color];
      } else {
        return prev.filter((c) => c.color_id !== color.color_id);
      }
    });
  };

  const handleAddColorFormButtonClick = async () => {
    if (showAddColorForm) {
      if (colorNameText === '') {
        toggleShowAddColorForm();
      } else {
        try {
          const formData = new FormData();
          formData.append('color_name', colorNameText);
          formData.append('color_hex_code', colorHexCodeText);

          await fetch('/api/add-color', {
            method: 'POST',
            body: formData,
          });

          await getColors();

          setColorNameText('');
          setColorHexCodeText('#ff0000');
          toggleShowAddColorForm();
        } catch (error) {
          console.error(error);
          setMessage('Failed to add color');
        }
      }
    }
  };

  useEffect(() => {
    getColors();
  }, [getColors]);

  useEffect(() => {
    console.log(selectedColors);
  }, [selectedColors]);

  return (
    <div className='w-full mt-4'>
      <label className='text-sm font-bold' htmlFor='product-colors'>
        Colors
      </label>
      <div className='w-full border rounded'>
        <div className='w-full flex flex-row items-center justify-between text-xs font-bold border-b p-2'>
          <p>Main Color</p>
          <p className='ml-4'>Swatch / Hex</p>
        </div>
        {colors && colors.length > 0 ? (
          <ul className='w-full p-2 pt-0'>
            {colors.map((color) => (
              <li key={color.color_id} className='w-full flex flex-col mt-2'>
                <div className='flex flex-row items-center justify-between'>
                  <label
                    className='container'
                    htmlFor={`color-${color.color_id}`}
                  >
                    {color.color_name}
                    <input
                      type='checkbox'
                      id={`color-${color.color_id}`}
                      name='colors[]'
                      value={color.color_name}
                      onChange={(e) =>
                        handleCheckboxChange(color, e.target.checked)
                      }
                    />
                    <span className='checkmark'></span>
                  </label>
                  <div className='flex flex-col'>
                    <input
                      type='color'
                      id='color-hex-code'
                      name='color-hex-code'
                      value={color.color_hex_code}
                      disabled
                      className='rounded border h-8 p-1'
                    />
                    <p className='text-xs text-red-500'>
                      {color.color_hex_code.toUpperCase()}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
        <div className='p-2'>
          {showAddColorForm ? (
            <div className='p-2 border rounded mb-2'>
              <label htmlFor='add-color' className='text-xs font-bold'>
                Color Name
              </label>
              <input
                type='text'
                id='add-color'
                name='add-color'
                className='p-2 text-sm w-full border'
                value={colorNameText}
                onChange={(e) => setColorNameText(e.target.value)}
              />
              <div className='w-full mt-2 flex flex-row items-center justify-between'>
                <p className='text-slate-700 text-sm font-bold'>
                  {colorHexCodeText.toUpperCase()}
                </p>
                <input
                  type='color'
                  id='add-color-hex-code'
                  name='add-color-hex-code'
                  value={colorHexCodeText}
                  onChange={(e) => setColorHexCodeText(e.target.value)}
                  className='rounded border h-8 p-1'
                />
              </div>
              <button
                className={`w-full ${
                  showAddColorForm && colorNameText === ''
                    ? 'bg-red-600'
                    : 'bg-black'
                } text-white text-sm p-2 rounded cursor-pointer ${
                  showAddColorForm ? 'hover:bg-red-400' : 'hover:bg-slate-700'
                } mt-2`}
                onClick={handleAddColorFormButtonClick}
              >
                {showAddColorForm
                  ? colorNameText === ''
                    ? 'Cancel'
                    : 'Add'
                  : null}
              </button>
            </div>
          ) : null}
          {showAddColorForm ? null : (
            <button
              className='w-full bg-white border text-black text-sm p-2 rounded cursor-pointer hover:bg-slate-200 disabled:bg-slate-200'
              onClick={toggleShowAddColorForm}
              disabled={showAddColorForm}
            >
              Create New Color
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
