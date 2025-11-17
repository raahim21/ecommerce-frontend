// src/data/categories.js
import { ShoppingBag } from 'lucide-react';

export const CATEGORIES = [
  {
    name: 'Men',
    icon: <ShoppingBag className="w-6 h-6" />,
    sub: ['Hoodies', 'T-Shirts', 'Jeans', 'Shirts', 'Shorts', 'Jackets', 'Pants'],
  },
  {
    name: 'Women',
    icon: <ShoppingBag className="w-6 h-6" />,
    sub: ['Hoodies', 'T-Shirts', 'Jeans', 'Dresses', 'Skirts', 'Jackets', 'Pants'],
  },
  {
    name: 'Kids',
    icon: <ShoppingBag className="w-6 h-6" />,
    sub: ['Hoodies', 'T-Shirts', 'Jeans', 'Shorts', 'Jackets'],
  },
  {
    name: 'Babies',
    icon: <ShoppingBag className="w-6 h-6" />,
    sub: ['Onesies', 'Rompers', 'T-Shirts', 'Pants', 'Hats'],
  },
];

export const CATEGORY_NAMES = CATEGORIES.map(c => c.name);
export const ALL_SUBCATEGORIES = [...new Set(CATEGORIES.flatMap(c => c.sub))];