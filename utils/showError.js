// utils/showError.js
import toast from 'react-hot-toast';

const showError = (msg) => {
  console.error(msg);
  toast.error(msg || 'Something went wrong');
};

export default showError;