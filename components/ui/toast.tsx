'use client';

import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

let toastId = 0;
let subscribers: Array<(toast: Toast | null) => void> = [];

export function showToast(message: string, type: ToastType = 'info', duration: number = 4000) {
  const id = String(toastId++);
  const toast = { id, message, type };
  
  subscribers.forEach(subscriber => subscriber(toast));
  
  if (duration > 0) {
    setTimeout(() => {
      subscribers.forEach(subscriber => subscriber(null));
    }, duration);
  }
}

interface ToastContainerProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export function ToastContainer({ position = 'top-right' }: ToastContainerProps) {
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    subscribers.push(setToast);
    return () => {
      subscribers = subscribers.filter(sub => sub !== setToast);
    };
  }, []);

  if (!toast) return null;

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  const bgClasses = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
  };

  const iconClasses = {
    success: 'text-green-600',
    error: 'text-red-600',
    info: 'text-blue-600',
  };

  const textClasses = {
    success: 'text-green-800',
    error: 'text-red-800',
    info: 'text-blue-800',
  };

  const icons = {
    success: <CheckCircle className={`w-5 h-5 ${iconClasses.success}`} />,
    error: <AlertCircle className={`w-5 h-5 ${iconClasses.error}`} />,
    info: <Info className={`w-5 h-5 ${iconClasses.info}`} />,
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50 max-w-md`}>
      <div className={`${bgClasses[toast.type]} border rounded-lg shadow-lg p-4 flex items-start gap-3`}>
        {icons[toast.type]}
        <div className="flex-1">
          <p className={`${textClasses[toast.type]} font-medium`}>{toast.message}</p>
        </div>
        <button
          onClick={() => setToast(null)}
          className={`${textClasses[toast.type]} opacity-50 hover:opacity-100 transition`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
