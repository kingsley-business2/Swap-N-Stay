// ========================== src/components/ErrorToast.tsx ==========================
import toast from 'react-hot-toast';

export const showError = (message: string = 'Something went wrong.') => {
  toast.error(message);
};

export const showSuccess = (message: string = 'Action completed successfully.') => {
  toast.success(message);
};
