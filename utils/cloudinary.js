// src/utils/cloudinary.js
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_APP_CLOUDINARY_UNSIGNED_PRESET; // e.g. "ecom_unsigned"
const CLOUDINARY_CLOUD_NAME   = import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME;   // e.g. "mycloud"

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) throw new Error('Upload failed');
  const data = await res.json();
  return data.secure_url;
};