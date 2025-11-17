import Navbar from "../Navbar";

// src/components/Cart/CartSkeleton.jsx
const CartSkeleton = ({ theme }) => (
  <>
  
  <div className={`min-h-screen overflow-hidden ${theme.pageBg}`}>
    <Navbar/>
    <div className="h-16" aria-hidden="true" />

    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded w-48 mx-auto mb-10 animate-pulse" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items column */}
        <div className="lg:col-span-2 space-y-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`rounded-2xl p-5 border ${theme.cardBg} ${theme.border} animate-pulse flex gap-5`}
            >
              <div className="w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
                <div className="flex gap-2 mt-2">
                  <div className="h-9 w-9 bg-gray-300 dark:bg-gray-600 rounded-full" />
                  <div className="h-9 w-12 bg-gray-300 dark:bg-gray-600 rounded" />
                  <div className="h-9 w-9 bg-gray-300 dark:bg-gray-600 rounded-full" />
                </div>
                <div className="h-5 w-20 bg-gray-300 dark:bg-gray-600 rounded mt-2" />
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="space-y-4">
          <div className={`rounded-2xl p-6 border ${theme.cardBg} ${theme.border} animate-pulse`}>
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-32 mb-4" />
            <div className="space-y-3">
              <div className="flex justify-between">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20" />
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-12" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24" />
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16" />
              </div>
              <div className="h-1 bg-gray-300 dark:bg-gray-600 rounded my-3" />
              <div className="flex justify-between">
                <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-20" />
                <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-20" />
              </div>
            </div>
            <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded mt-6" />
          </div>
        </div>
      </div>
    </div>
  </div>
  </>
);

export default CartSkeleton;