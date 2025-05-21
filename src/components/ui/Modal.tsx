'use client';

import { useEffect, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Handle animation states
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure the enter animation plays
      requestAnimationFrame(() => setIsVisible(true));
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen && !isVisible) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 transition-all duration-500 ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div 
        className={`fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl transform transition-all duration-500 ease-out ${
          isVisible 
            ? 'translate-x-0 scale-100 opacity-100' 
            : 'translate-x-full scale-95 opacity-0'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex justify-end p-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors duration-200 ease-in-out"
              aria-label="Close modal"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 