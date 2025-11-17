











// src/components/ProductForm.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { uploadToCloudinary } from '../../../utils/cloudinary.js';
import showError from '../../../utils/showError.js';
import toast from 'react-hot-toast';
import { CATEGORIES, CATEGORY_NAMES } from '../../data/categories.jsx';
import Navbar from '../../components/Navbar.jsx';
import { useThemeClasses } from '../../hooks/useThemeClasses'; // ← Added

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProductForm = ({ productToEdit, onSuccess }) => {
  const theme = useThemeClasses(); // ← Get all theme classes

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    subCategory: '',
    image: '',
    images: [],
    variants: [{ size: '', price: '', stock: '', sku: '' }],
  });

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  // ---------- Fill form on edit ----------
  useEffect(() => {
    if (productToEdit) {
      setForm({
        name: productToEdit.name || '',
        description: productToEdit.description || '',
        category: productToEdit.category || '',
        subCategory: productToEdit.subCategory || '',
        image: productToEdit.image || '',
        images: productToEdit.images || [],
        variants:
          productToEdit.variants?.length > 0
            ? productToEdit.variants.map(v => ({
                size: v.size || '',
                price: v.price || '',
                stock: v.stock || '',
                sku: v.sku || '',
              }))
            : [{ size: '', price: '', stock: '', sku: '' }],
      });
    }
  }, [productToEdit]);

  // ---------- Available sub-categories ----------
  const availableSubs = useMemo(() => {
    if (!form.category) return [];
    const catObj = CATEGORIES.find(c => c.name === form.category);
    return catObj ? catObj.sub : [];
  }, [form.category]);

  // Reset sub-category when main category changes
  useEffect(() => {
    setForm(p => ({ ...p, subCategory: '' }));
  }, [form.category]);

  // ---------- Handlers ----------
  const handleText = e => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
  };

  const handleVariant = (i, field, val) => {
    const updated = [...form.variants];
    updated[i][field] = val;
    setForm(p => ({ ...p, variants: updated }));
  };

  const addVariant = () =>
    setForm(p => ({
      ...p,
      variants: [...p.variants, { size: '', price: '', stock: '', sku: '' }],
    }));

  const removeVariant = i => {
    if (form.variants.length === 1) {
      showError('At least one variant is required');
      return;
    }
    setForm(p => ({ ...p, variants: p.variants.filter((_, idx) => idx !== i) }));
  };

  // ---------- Image upload ----------
  const handleMainImage = async e => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setForm(p => ({ ...p, image: url }));
      toast.success('Main image uploaded');
    } catch {
      showError('Failed to upload main image');
    } finally {
      setUploading(false);
    }
  };

  const handleExtraImages = async e => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(files.map(uploadToCloudinary));
      setForm(p => ({ ...p, images: [...p.images, ...urls] }));
      toast.success(`${urls.length} extra image(s) uploaded`);
    } catch {
      showError('Failed to upload extra images');
    } finally {
      setUploading(false);
    }
  };

  const removeExtraImage = idx =>
    setForm(p => ({ ...p, images: p.images.filter((_, i) => i !== idx) }));

  // ---------- Validation ----------
  const validate = () => {
    const errors = [];

    if (!form.name.trim()) errors.push('Product name is required');
    if (!form.description.trim()) errors.push('Description is required');
    if (!form.category) errors.push('Please select a category');
    if (!form.subCategory) errors.push('Please select a sub-category');
    if (!form.image) errors.push('Main image is required');

    form.variants.forEach((v, i) => {
      if (!v.size.trim()) errors.push(`Size required for variant ${i + 1}`);
      if (!v.price || v.price <= 0) errors.push(`Valid price required for variant ${i + 1}`);
      if (v.stock === '' || v.stock < 0) errors.push(`Valid stock required for variant ${i + 1}`);
    });

    if (errors.length) {
      showError(errors[0]);
      return false;
    }
    return true;
  };

  // ---------- Submit ----------
  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const url = productToEdit
      ? `${API_BASE_URL}/api/products/${productToEdit._id}`
      : `${API_BASE_URL}/api/products`;
    const method = productToEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim(),
          category: form.category,
          subCategory: form.subCategory,
          image: form.image,
          images: form.images,
          variants: form.variants.map(v => ({
            size: v.size.trim(),
            price: Number(v.price),
            stock: Number(v.stock),
            sku: v.sku.trim() || undefined,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        showError(data.msg || 'Failed to save product');
        return;
      }

      toast.success(`${data.product.name} ${productToEdit ? 'updated' : 'created'} successfully!`);
      onSuccess?.(data.product);

      if (!productToEdit) {
        setForm({
          name: '',
          description: '',
          category: '',
          subCategory: '',
          image: '',
          images: [],
          variants: [{ size: '', price: '', stock: '', sku: '' }],
        });
      }
    } catch {
      showError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ---------- UI ----------
  return (
    <>
      <Navbar />
      <div className={`max-w-5xl mb-12 mt-12 mx-auto p-6 ${theme.cardBg} ${theme.textMain} rounded-lg shadow-lg`}>
        <h2 className="text-2xl font-bold mb-6">
          {productToEdit ? 'Edit Product' : 'Add New Product'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Name */}
          <div>
            <label className={`block text-sm font-medium ${theme.textSub}`}>Product Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleText}
              className={`mt-1 block w-full rounded-md border ${theme.border} shadow-sm focus:border-purple-500 focus:ring-purple-500 ${theme.cardBg} ${theme.textMain} sm:text-sm p-2`}
              placeholder="e.g., Oversized Hoodie"
            />
          </div>

          {/* Description */}
          <div>
            <label className={`block text-sm font-medium ${theme.textSub}`}>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleText}
              rows={3}
              className={`mt-1 block w-full rounded-md border ${theme.border} shadow-sm focus:border-purple-500 focus:ring-purple-500 ${theme.cardBg} ${theme.textMain} sm:text-sm p-2`}
              placeholder="Comfortable, premium cotton..."
            />
          </div>

          {/* Category & Sub-Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${theme.textSub}`}>Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleText}
                className={`mt-1 block w-full rounded-md border ${theme.border} shadow-sm focus:border-purple-500 focus:ring-purple-500 ${theme.cardBg} ${theme.textMain} sm:text-sm p-2`}
              >
                <option value="">-- Select Category --</option>
                {CATEGORY_NAMES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium ${theme.textSub}`}>Sub-Category</label>
              <select
                name="subCategory"
                value={form.subCategory}
                onChange={handleText}
                disabled={!form.category}
                className={`mt-1 block w-full rounded-md border ${theme.border} shadow-sm focus:border-purple-500 focus:ring-purple-500 ${theme.cardBg} ${theme.textMain} sm:text-sm p-2 disabled:opacity-50`}
              >
                <option value="">
                  {form.category ? '-- Select Sub-Category --' : '-- Choose Category First --'}
                </option>
                {availableSubs.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Main Image */}
          <div>
            <label className={`block text-sm font-medium ${theme.textSub}`}>Main Image *</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleMainImage}
              disabled={uploading}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
            />
            {uploading && <p className="mt-1 text-sm text-purple-600">Uploading…</p>}
            {form.image && (
              <img src={form.image} alt="main" className="mt-2 h-48 w-full object-cover rounded-md border border-gray-200 dark:border-gray-700" />
            )}
          </div>

          {/* Extra Images */}
          <div>
            <label className={`block text-sm font-medium ${theme.textSub}`}>Extra Images (optional)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleExtraImages}
              disabled={uploading}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {form.images.map((url, i) => (
                <div key={i} className="relative group">
                  <img src={url} alt={`extra-${i}`} className="h-24 w-24 object-cover rounded-md border border-gray-200 dark:border-gray-700" />
                  <button
                    type="button"
                    onClick={() => removeExtraImage(i)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Variants */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className={`block text-sm font-medium ${theme.textSub}`}>Size Variants</label>
              <button type="button" onClick={addVariant} className={`${theme.accent} hover:underline text-sm`}>
                + Add Variant
              </button>
            </div>

            {form.variants.map((v, i) => (
              <div
                key={i}
                className={`grid grid-cols-1 sm:grid-cols-5 gap-2 p-3 border ${theme.border} rounded-md mb-3 ${theme.hoverBg}`}
              >
                <input
                  placeholder="Size (S, M, L)"
                  value={v.size}
                  onChange={e => handleVariant(i, 'size', e.target.value)}
                  className={`p-2 border ${theme.border} rounded text-sm ${theme.cardBg} ${theme.textMain}`}
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={v.price}
                  onChange={e => handleVariant(i, 'price', e.target.value)}
                  className={`p-2 border ${theme.border} rounded text-sm ${theme.cardBg} ${theme.textMain}`}
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={v.stock}
                  onChange={e => handleVariant(i, 'stock', e.target.value)}
                  className={`p-2 border ${theme.border} rounded text-sm ${theme.cardBg} ${theme.textMain}`}
                />
                <input
                  placeholder="SKU (opt)"
                  value={v.sku}
                  onChange={e => handleVariant(i, 'sku', e.target.value)}
                  className={`p-2 border ${theme.border} rounded text-sm ${theme.cardBg} ${theme.textMain}`}
                />
                {form.variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariant(i)}
                    className="text-red-600 hover:underline text-sm self-center"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || uploading}
              className={`px-6 py-2 rounded-md font-medium text-white transition ${theme.buttonBg} disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {loading ? 'Saving…' : productToEdit ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ProductForm;