import { useState, useEffect, createContext, useContext } from 'react';
import { X, CheckCircle, AlertCircle, InfoIcon } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

interface ToasterContextType {
  toast: (message: string, type: Toast['type'], duration?: number) => void;
}

const ToasterContext = createContext<ToasterContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToasterContext);
  if (!context) {
    throw new Error('useToast must be used within a ToasterProvider');
  }
  return context;
}

export function ToasterProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (message: string, type: Toast['type'] = 'info', duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  return (
    <ToasterContext.Provider value={{ toast }}>
      {children}
      <Toaster toasts={toasts} setToasts={setToasts} />
    </ToasterContext.Provider>
  );
}

interface ToasterProps {
  toasts: Toast[];
  setToasts: React.Dispatch<React.SetStateAction<Toast[]>>;
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [toast.duration, onClose]);

  const iconMap = {
    success: <CheckCircle className="h-5 w-5 text-white" />,
    error: <AlertCircle className="h-5 w-5 text-white" />,
    info: <InfoIcon className="h-5 w-5 text-white" />,
  };

  const bgColorMap = {
    success: 'bg-success-500',
    error: 'bg-error-500',
    info: 'bg-primary-500',
  };

  return (
    <div 
      className={`${bgColorMap[toast.type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between w-full animate-fade-in`}
    >
      <div className="flex items-center space-x-3">
        {iconMap[toast.type]}
        <p>{toast.message}</p>
      </div>
      <button 
        onClick={onClose}
        className="text-white/80 hover:text-white"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

export function Toaster({ toasts = [], setToasts }: ToasterProps) {
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <div className="fixed bottom-0 right-0 p-4 z-50 flex flex-col items-end space-y-2 max-w-md w-full">
      {toasts?.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

export default Toaster;