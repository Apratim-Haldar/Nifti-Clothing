import React, { useState } from 'react';
import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

// Modal Types
export type ModalType = 'alert' | 'confirm' | 'prompt' | 'custom';

export interface ModalConfig {
  id: string;
  type: ModalType;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: (value?: string) => void;
  onCancel?: () => void;
  inputPlaceholder?: string;
  inputDefaultValue?: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
  children?: ReactNode;
}

interface ModalContextType {
  showAlert: (title: string, message: string, variant?: 'info' | 'success' | 'warning' | 'error') => Promise<void>;
  showConfirm: (title: string, message: string, confirmText?: string, cancelText?: string) => Promise<boolean>;
  showPrompt: (title: string, message: string, placeholder?: string, defaultValue?: string) => Promise<string | null>;
  showCustomModal: (config: Partial<ModalConfig>) => void;
  hideModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modal, setModal] = useState<ModalConfig | null>(null);

  const showAlert = (
    title: string, 
    message: string, 
    variant: 'info' | 'success' | 'warning' | 'error' = 'info'
  ): Promise<void> => {
    return new Promise((resolve) => {
      setModal({
        id: Date.now().toString(),
        type: 'alert',
        title,
        message,
        variant,
        confirmText: 'OK',
        onConfirm: () => {
          hideModal();
          resolve();
        }
      });
    });
  };

  const showConfirm = (
    title: string,
    message: string,
    confirmText = 'Confirm',
    cancelText = 'Cancel'
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      setModal({
        id: Date.now().toString(),
        type: 'confirm',
        title,
        message,
        confirmText,
        cancelText,
        onConfirm: () => {
          hideModal();
          resolve(true);
        },
        onCancel: () => {
          hideModal();
          resolve(false);
        }
      });
    });
  };

  const showPrompt = (
    title: string,
    message: string,
    placeholder = '',
    defaultValue = ''
  ): Promise<string | null> => {
    return new Promise((resolve) => {
      setModal({
        id: Date.now().toString(),
        type: 'prompt',
        title,
        message,
        inputPlaceholder: placeholder,
        inputDefaultValue: defaultValue,
        confirmText: 'OK',
        cancelText: 'Cancel',
        onConfirm: (value) => {
          hideModal();
          resolve(value || null);
        },
        onCancel: () => {
          hideModal();
          resolve(null);
        }
      });
    });
  };

  const showCustomModal = (config: Partial<ModalConfig>) => {
    setModal({
      id: Date.now().toString(),
      type: 'custom',
      title: 'Modal',
      ...config
    });
  };

  const hideModal = () => {
    setModal(null);
  };

  return (
    <ModalContext.Provider value={{
      showAlert,
      showConfirm,
      showPrompt,
      showCustomModal,
      hideModal
    }}>
      {children}
      {modal && <ModalRenderer modal={modal} />}
    </ModalContext.Provider>
  );
};

// Modal Renderer Component
const ModalRenderer: React.FC<{ modal: ModalConfig }> = ({ modal }) => {
  const [inputValue, setInputValue] = useState(modal.inputDefaultValue || '');

  const getVariantStyles = () => {
    switch (modal.variant) {
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getIconForVariant = () => {
    switch (modal.variant) {
      case 'success':
        return (
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const handleConfirm = () => {
    if (modal.type === 'prompt') {
      modal.onConfirm?.(inputValue);
    } else {
      modal.onConfirm?.();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && modal.type !== 'prompt') {
      handleConfirm();
    } else if (e.key === 'Escape') {
      modal.onCancel?.();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onKeyDown={handleKeyPress}
      tabIndex={-1}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-96 overflow-y-auto">
        {/* Header */}
        <div className={`px-6 py-4 border-b ${getVariantStyles()}`}>
          <div className="flex items-center space-x-3">
            {getIconForVariant()}
            <h3 className="text-lg font-semibold">{modal.title}</h3>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {modal.message && (
            <p className="text-gray-700 mb-4">{modal.message}</p>
          )}
          
          {modal.type === 'prompt' && (
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={modal.inputPlaceholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
              onKeyPress={(e) => e.key === 'Enter' && handleConfirm()}
            />
          )}

          {modal.children}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
          {modal.onCancel && (
            <button
              onClick={modal.onCancel}
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 font-medium"
            >
              {modal.cancelText || 'Cancel'}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            {modal.confirmText || 'OK'}
          </button>
        </div>
      </div>
    </div>
  );
};
