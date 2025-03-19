'use client';

import Image from 'next/image';
import { FaChevronDown, FaTimes } from 'react-icons/fa';
import { useStore } from '../store';
import { useRef } from 'react';

interface ColorProps {
  color_id: string;
  color_name: string;
  color_hex_code: string;
}

export default function ProductImages() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    message,
    selectedFiles,
    setSelectedFiles,
    imageColorAssignments,
    setImageColorAssignments,
    showColorDropdown,
    setShowColorDropdown,
    selectedColors,
  } = useStore();

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const processImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      const url = URL.createObjectURL(file);
      img.src = url;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const maxWidth = 800;
        const maxHeight = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);
            if (blob) {
              const webpFile = new File(
                [blob],
                file.name.replace(/\.[^/.]+$/, '.webp'),
                { type: 'image/webp' }
              );
              resolve(webpFile);
            } else {
              reject(new Error('Failed to convert image to WebP'));
            }
          },
          'image/webp',
          0.8
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image'));
      };
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    try {
      const processedFiles = await Promise.all(
        Array.from(files).map((file) => processImage(file))
      );
      setSelectedFiles((prev) => {
        const startIndex = prev.length;
        setImageColorAssignments((prevAssignments) => {
          const newAssignments = { ...prevAssignments };
          for (let i = 0; i < processedFiles.length; i++) {
            newAssignments[startIndex + i] = null;
          }
          return newAssignments;
        });
        return [...prev, ...processedFiles];
      });
    } catch (error) {
      console.error('Error processing images:', error);
      useStore.getState().setMessage('Failed to process one or more images');
    }
  };

  const deleteImage = (index: number) => {
    setSelectedFiles((prevFiles) => {
      const newFiles = prevFiles.filter((_, i) => i !== index);

      setImageColorAssignments((prevAssignments) => {
        const newAssignments: { [key: number]: ColorProps | null } = {};
        Object.keys(prevAssignments)
          .map(Number)
          .forEach((key) => {
            if (key < index) {
              newAssignments[key] = prevAssignments[key];
            } else if (key > index) {
              newAssignments[key - 1] = prevAssignments[key];
            }
          });
        return newAssignments;
      });

      setShowColorDropdown((prev) => {
        const newDropdown: { [key: number]: boolean } = {};
        Object.keys(prev)
          .map(Number)
          .forEach((key) => {
            if (key < index) {
              newDropdown[key] = prev[key];
            } else if (key > index) {
              newDropdown[key - 1] = prev[key];
            }
          });
        return newDropdown;
      });

      return newFiles;
    });
  };

  const toggleColorDropdown = (index: number) => {
    setShowColorDropdown((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleAssignColor = (index: number, color: ColorProps) => {
    setImageColorAssignments((prev) => ({ ...prev, [index]: color }));
    setShowColorDropdown((prev) => ({ ...prev, [index]: false }));
  };

  return (
    <div className='border p-2 rounded mt-4'>
      <input
        type='file'
        multiple
        ref={fileInputRef}
        className='hidden'
        onChange={handleFileChange}
      />

      <button
        type='button'
        onClick={triggerFileInput}
        className='w-full bg-black text-white p-2 rounded cursor-pointer hover:bg-slate-700'
      >
        Add Image
      </button>

      {selectedFiles.length > 0 && (
        <div className='flex flex-wrap gap-2 mt-4'>
          {selectedFiles.map((file, index) => (
            <div key={index} className='relative'>
              <Image
                width={100}
                height={100}
                src={URL.createObjectURL(file)}
                alt={`Selected image ${index + 1}`}
                className='w-16 h-16 object-cover rounded border'
              />
              <div
                className='text-white bg-red-500 p-1 rounded-full absolute -top-1 -right-1 cursor-pointer hover:opacity-75'
                onClick={() => deleteImage(index)}
              >
                <FaTimes size='0.5rem' />
              </div>
              {selectedColors?.length > 0 && (
                <div className='relative justify-self-end'>
                  <button
                    type='button'
                    onClick={() => toggleColorDropdown(index)}
                    className='text-xs font-bold text-slate-500 text-center bg-white border border-slate-500 rounded-full cursor-pointer px-2'
                  >
                    {imageColorAssignments[index] ? (
                      <div className='flex flex-row items-center'>
                        <p>
                          {imageColorAssignments[
                            index
                          ]?.color_name.toUpperCase()}
                        </p>
                        <div className='p-1 pr-0 ml-1 text-black'>
                          <FaChevronDown size='0.65rem' />
                        </div>
                      </div>
                    ) : (
                      <div className='flex flex-row items-center'>
                        <p>#Color</p>
                        <div className='p-1 pr-0 ml-1 text-black'>
                          <FaChevronDown size='0.65rem' />
                        </div>
                      </div>
                    )}
                  </button>
                  {showColorDropdown[index] && (
                    <div className='absolute z-10 bg-white border rounded mt-1 w-full'>
                      {selectedColors.map((color, idx) => (
                        <div
                          key={idx}
                          className='p-1 text-xs cursor-pointer hover:bg-slate-200'
                          onClick={() => handleAssignColor(index, color)}
                        >
                          {color.color_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {message && <p className='mt-2 text-sm'>{message}</p>}
    </div>
  );
}
