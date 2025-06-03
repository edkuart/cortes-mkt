// 📁 components/Modal.tsx

import { useEffect, useRef } from 'react';

interface ModalProps {
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  title?: string;
  footer?: React.ReactNode;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl'
};

const Modal: React.FC<ModalProps> = ({
  onClose,
  onPrev,
  onNext,
  children,
  size = 'md',
  title,
  footer
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    contentRef.current?.focus();
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm"
    >
      <div
        ref={contentRef}
        tabIndex={-1}
        className={`bg-white rounded-xl p-6 w-full ${sizeClasses[size]} shadow-lg relative animate-fadeIn outline-none`}
      >
        <div className="flex justify-between items-center mb-4">
          {onPrev && (
            <button
              onClick={onPrev}
              className="text-sm text-blue-500 hover:underline"
            >
              ◀ Anterior
            </button>
          )}
          <h3 className="text-lg font-semibold text-center flex-1">
            {title || 'Detalle'}
          </h3>
          {onNext && (
            <button
              onClick={onNext}
              className="text-sm text-blue-500 hover:underline"
            >
              Siguiente ▶
            </button>
          )}
          <button
            onClick={onClose}
            className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
        <div className="mb-4">
          {children}
        </div>
        {footer && (
          <div className="mt-4 border-t pt-4 text-right">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
