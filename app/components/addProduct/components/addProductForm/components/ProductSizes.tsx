'use client';

import { useCallback, useEffect } from 'react';
import { useAddProductStore } from '@/app/components/addProduct/addProductStore';
import { SizesProps } from '@/app/types/types';

export default function ProductSizes() {
  const {
    setMessage,
    productBasePrice,
    variedSizesSelected,
    setVariedSizedSelected,
    sizes,
    setSizes,
    sizePriceModifiers,
    setSizePriceModifiers,
    showAddSizeForm,
    toggleShowAddSizeForm,
    sizeText,
    setSizeText,
    setSelectedSizes,
  } = useAddProductStore();

  const numericBasePrice = productBasePrice || 0;
  const oneSizeId = '00000000-0000-0000-0000-000000000001';

  const handleCheckboxChange = (size: SizesProps, checked: boolean) => {
    if (checked) {
      setSelectedSizes((prev) => [...prev, size]);
      setSizePriceModifiers((prev) => {
        const exists = prev.find((mod) => mod.size_id === size.size_id);
        if (!exists) {
          return [...prev, { size_id: size.size_id, price_mod: 0 }];
        }
        return prev;
      });
    } else {
      setSelectedSizes((prev) =>
        prev.filter((s) => s.size_id !== size.size_id)
      );
      setSizePriceModifiers((prev) =>
        prev.filter((mod) => mod.size_id !== size.size_id)
      );
    }
  };

  const handleModifierChange = (sizeId: string, value: number) => {
    setSizePriceModifiers((prev) => {
      const existing = prev.find((mod) => mod.size_id === sizeId);
      if (existing) {
        return prev.map((mod) =>
          mod.size_id === sizeId ? { ...mod, price_mod: value } : mod
        );
      } else {
        return [...prev, { size_id: sizeId, price_mod: value }];
      }
    });
  };

  const handleAddSizeFormButtonClick = async () => {
    if (showAddSizeForm) {
      if (sizeText === '') {
        toggleShowAddSizeForm();
      } else {
        try {
          await fetch('/api/add-size', {
            method: 'POST',
            body: sizeText,
          });

          await getSizes();

          setSizeText('');
          toggleShowAddSizeForm();
        } catch (error) {
          console.error(error);
          setMessage('Failed to add size');
        }
      }
    }
  };

  const getSizes = useCallback(async () => {
    try {
      const res = await fetch('/api/get-sizes', {
        method: 'GET',
      });

      const data = await res.json();

      if (data.error) {
        setMessage(data.error);
        return;
      }

      setSizes(data);
    } catch (error) {
      console.error(error);
      setMessage('Failed to fetch sizes');
    }
  }, [setMessage, setSizes]);

  useEffect(() => {
    getSizes();
  }, [getSizes]);

  const filteredSizes = sizes.filter((size) => size.size_id !== oneSizeId);

  return (
    <>
      <div className='mt-4'>
        <label className='text-sm font-bold' htmlFor='product-sizes'>
          Sizes
        </label>
        <div className='p-2 border rounded'>
          <label className='container' htmlFor='one-size'>
            One Size
            <input
              type='radio'
              name='size-selector'
              id='one-size'
              value='One Size'
              defaultChecked
              onChange={() => setVariedSizedSelected(false)}
            />
            <span className='checkmark'></span>
          </label>
          <label
            className='container'
            htmlFor='varied-sizes'
            style={{ marginBottom: 0 }}
          >
            Varied Sizes
            <input
              type='radio'
              name='size-selector'
              id='varied-sizes'
              value='Varied Sizes'
              onChange={() => setVariedSizedSelected(true)}
              className='ml-4'
            />
            <span className='checkmark'></span>
          </label>
        </div>
      </div>

      {variedSizesSelected ? (
        <div className='w-full border rounded mt-2'>
          <div className='w-full flex flex-row items-center justify-between text-xs font-bold border-b p-2'>
            <p>Size</p>
            <p>Price Adjustment</p>
          </div>
          {sizes && sizes.length > 0 ? (
            <ul className='w-full p-2'>
              {filteredSizes.map((size) => (
                <li key={size.size_id} className='w-full flex flex-col'>
                  <div className='flex flex-row items-center justify-between'>
                    <label
                      className='container'
                      htmlFor={`size-${size.size_id}`}
                    >
                      {size.size}
                      <input
                        type='checkbox'
                        id={`size-${size.size_id}`}
                        name='sizes[]'
                        value={size.size}
                        onChange={(e) =>
                          handleCheckboxChange(size, e.target.checked)
                        }
                      />
                      <span className='checkmark'></span>
                    </label>
                    {(() => {
                      const modifierObj = sizePriceModifiers.find(
                        (mod) => mod.size_id === size.size_id
                      );
                      if (modifierObj !== undefined) {
                        return (
                          <input
                            type='text'
                            name={`modifier-${size.size_id}`}
                            value={modifierObj.price_mod}
                            onChange={(e) =>
                              handleModifierChange(
                                size.size_id,
                                Number(e.target.value)
                              )
                            }
                            className='border rounded p-1 w-10 text-xs mb-3 text-right'
                          />
                        );
                      }
                      return null;
                    })()}
                  </div>
                  {(() => {
                    const modifierObj = sizePriceModifiers.find(
                      (mod) => mod.size_id === size.size_id
                    );
                    if (modifierObj !== undefined) {
                      const priceMod = modifierObj.price_mod;
                      return (
                        <div className='w-full text-xs text-red-500 flex flex-row items-center justify-between -mt-2 mb-2'>
                          <div>Base: ${numericBasePrice.toFixed(2)}</div>
                          <div>Adj: ${priceMod.toFixed(2)}</div>
                          <div>
                            Final:&nbsp;
                            <span className='font-bold underline text-green-600'>
                              ${(numericBasePrice + priceMod).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </li>
              ))}
            </ul>
          ) : null}
          <div className='p-2'>
            {showAddSizeForm ? (
              <div className='p-2 border rounded mb-2'>
                <label htmlFor='add-size' className='text-xs font-bold'>
                  Size Name
                </label>
                <input
                  type='text'
                  id='add-size'
                  name='add-size'
                  className='p-2 text-sm w-full border'
                  value={sizeText}
                  onChange={(e) => setSizeText(e.target.value)}
                />
                <button
                  type='button'
                  className={`w-full ${
                    showAddSizeForm && sizeText === ''
                      ? 'bg-red-600'
                      : 'bg-black'
                  } text-white text-sm p-2 rounded cursor-pointer ${
                    showAddSizeForm ? 'hover:bg-red-400' : 'hover:bg-slate-700'
                  } mt-2`}
                  onClick={handleAddSizeFormButtonClick}
                >
                  {showAddSizeForm
                    ? sizeText === ''
                      ? 'Cancel'
                      : 'Add'
                    : null}
                </button>
              </div>
            ) : null}
            {showAddSizeForm ? null : (
              <button
                type='button'
                className='w-full bg-white border text-black text-sm p-2 rounded cursor-pointer hover:bg-slate-200 disabled:bg-slate-200'
                onClick={toggleShowAddSizeForm}
                disabled={showAddSizeForm}
              >
                Create New Size
              </button>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
