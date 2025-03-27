'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { uploadAvatarImage } from '@/app/lib/actions/actions';

interface AvatarUploaderProps {
  userId: string;
}

const AvatarUploader = ({ userId }: AvatarUploaderProps) => {
  const router = useRouter();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a file first.');
      return;
    }
    setUploading(true);
    setMessage('Uploading...');
    try {
      await uploadAvatarImage(selectedFile, userId);
      setMessage('Upload successful!');
      router.refresh();
    } catch (error) {
      console.error(error);
      setMessage('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setMessage('');
  };

  return (
    <div className='flex flex-col items-center -mt-6'>
      <input
        id='avatar-upload'
        type='file'
        onChange={handleFileChange}
        className='hidden'
      />
      <label htmlFor='avatar-upload' className='cursor-pointer'>
        <div className='bg-black text-white text-xs px-4 py-2 rounded-full shadow-lg shadow-slate-700 hover:bg-slate-700'>
          Edit profile photo
        </div>
      </label>
      {selectedFile && (
        <p className='mt-4 text-sm font-black'>{selectedFile.name}</p>
      )}
      {selectedFile && (
        <div className='flex flex-row items-center rounded-full shadow-lg shadow-slate-700'>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className='mt-2 px-4 py-2 bg-blue-600 text-white rounded-l-full text-xs cursor-pointer font-bold hover:bg-blue-800'
          >
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
          <button
            onClick={handleCancel}
            disabled={uploading}
            className='mt-2 px-4 pr-6 py-2 bg-red-500 text-white rounded-r-full text-xs cursor-pointer font-bold hover:bg-red-800'
          >
            Cancel
          </button>
        </div>
      )}
      {message && <p className='mt-2 text-sm'>{message}</p>}
    </div>
  );
};

export default AvatarUploader;
