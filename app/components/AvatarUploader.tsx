'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { uploadAvatarImage } from '@/app/lib/actions';

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

  return (
    <div>
      <input type='file' onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload Image'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AvatarUploader;
