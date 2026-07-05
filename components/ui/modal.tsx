'use client';

import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onSubmit?: () => void | Promise<void>;
  submitLabel?: string;
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({
  isOpen,
  title,
  children,
  onClose,
  onSubmit,
  submitLabel = 'Guardar',
  isLoading = false,
  size = 'md',
}: ModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className={`${sizeClasses[size]} w-full mx-4 bg-white rounded-lg shadow-lg`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">{children}</div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          {onSubmit && (
            <Button
              onClick={onSubmit}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Guardando...' : submitLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
