// src/components/Home/ProductGrid.jsx
import ProductCard from './ProductCard';

const Grid = ({ products, theme }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
    {products.map(p => (
      <ProductCard key={p._id} product={p} theme={theme} />
    ))}
  </div>
);

Grid.Skeleton = ({ theme }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
    {[...Array(8)].map((_, i) => (
      <div key={i} className={`rounded-2xl border ${theme.card} ${theme.border} p-4 animate-pulse space-y-3`}>
        <div className="bg-gray-300 dark:bg-gray-700 h-64 rounded-xl" />
        <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
      </div>
    ))}
  </div>
);

Grid.Error = ({ message, theme }) => (
  <div className={`flex items-center justify-center gap-3 p-5 rounded-2xl border max-w-md mx-auto ${theme.darkMode ? 'bg-red-900/30 border-red-800 text-red-300' : 'bg-red-50 border-red-200 text-red-700'}`}>
    <AlertCircle size={22} />
    <span className="font-medium">{message}</span>
  </div>
);

Grid.Empty = ({ theme }) => (
  <div className="text-center py-16">
    <ShoppingCart size={64} className={`mx-auto mb-4 ${theme.sub}`} />
    <p className={`text-lg ${theme.sub}`}>No products available.</p>
  </div>
);

export default Grid;