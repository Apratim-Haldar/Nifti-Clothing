import type { Toast as ToastType } from '../context/ToastContext';
import { useToast } from '../context/ToastContext';

const Toast = ({ toast }: { toast: ToastType }) => {
  const { removeToast } = useToast();

  // Handle auto-removal
  if (toast.duration && toast.duration > 0) {
    setTimeout(() => {
      removeToast(toast.id);
    }, toast.duration);
  }

  const getToastStyles = () => {
    const baseStyles = "px-6 py-4 rounded-lg shadow-lg text-white font-medium flex items-center justify-between max-w-sm";
    
    switch (toast.type) {
      case 'success':
        return `${baseStyles} bg-green-500`;
      case 'error':
        return `${baseStyles} bg-red-500`;
      case 'warning':
        return `${baseStyles} bg-yellow-500`;
      case 'info':
        return `${baseStyles} bg-blue-500`;
      default:
        return `${baseStyles} bg-gray-500`;
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '';
    }
  };

  return (
    <div className={`${getToastStyles()} animate-slide-in-right`}>
      <div className="flex items-center">
        <span className="mr-3 text-lg">{getIcon()}</span>
        <span>{toast.message}</span>
      </div>
      <button
        onClick={() => removeToast(toast.id)}
        className="ml-4 text-white hover:text-gray-200 transition-colors"
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
};

const ToastContainer = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

export default ToastContainer;