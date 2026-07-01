import { AlertTriangle, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { closeDeleteModal } from '../../store/slices/uiSlice';

interface ConfirmDeleteModalProps {
  onConfirm: (id: string) => void;
  title?: string;
  description?: string;
}

export default function ConfirmDeleteModal({ onConfirm, title = 'Delete Property', description = 'Are you sure you want to delete this property? This action cannot be undone.' }: ConfirmDeleteModalProps) {
  const dispatch = useAppDispatch();
  const { deleteModalOpen, deleteTargetId } = useAppSelector(s => s.ui);

  if (!deleteModalOpen) return null;

  const handleConfirm = () => {
    if (deleteTargetId) onConfirm(deleteTargetId);
    dispatch(closeDeleteModal());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => dispatch(closeDeleteModal())}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative dh-card max-w-md w-full p-6 animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={() => dispatch(closeDeleteModal())}
          className="absolute top-4 right-4 text-muted hover:text-custom transition-colors"
        >
          <X size={18} />
        </button>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
            <AlertTriangle size={22} className="text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-custom">{title}</h3>
            <p className="text-sm text-muted mt-0.5">{description}</p>
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={() => dispatch(closeDeleteModal())}
            className="btn-secondary px-5 py-2.5 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white text-sm bg-red-500 hover:bg-red-600 transition-all duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
