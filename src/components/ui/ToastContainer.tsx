import { useEffect, useRef } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { removeToast } from '../../store/slices/uiSlice';

const icons = {
  success: <CheckCircle size={18} />,
  error: <XCircle size={18} />,
  info: <Info size={18} />,
  warning: <AlertTriangle size={18} />,
};

const colors = {
  success: 'border-l-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400',
  error: 'border-l-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400',
  info: 'border-l-sky-500 bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400',
  warning: 'border-l-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400',
};

function ToastItem({ id, message, type }: { id: string; message: string; type: keyof typeof icons }) {
  const dispatch = useAppDispatch();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => dispatch(removeToast(id)), 4000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [id, dispatch]);

  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border-l-4 shadow-lg animate-slide-up min-w-72 max-w-sm ${colors[type]}`}>
      <span className="mt-0.5 shrink-0">{icons[type]}</span>
      <p className="text-sm font-medium flex-1">{message}</p>
      <button onClick={() => dispatch(removeToast(id))} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
        <X size={14} />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const toasts = useAppSelector(s => s.ui.toasts);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <ToastItem key={toast.id} {...toast} type={toast.type as keyof typeof icons} />
      ))}
    </div>
  );
}
