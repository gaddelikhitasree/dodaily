import { useEffect, memo } from 'react';
import { FiBell, FiX } from 'react-icons/fi';
import { format } from 'date-fns';
import './Toast.css';

const TOAST_AUTO_DISMISS_MS = 15_000;

export default function Toast({ toasts, onDismiss, onDismissAll }) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" role="status" aria-live="polite">
      {toasts.length > 1 && (
        <button
          type="button"
          className="toast-dismiss-all"
          onClick={onDismissAll}
          aria-label={`Dismiss all ${toasts.length} notifications`}
        >
          Dismiss all ({toasts.length})
        </button>
      )}
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

const ToastItem = memo(function ToastItem({ toast, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), TOAST_AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div className="toast-item" style={{ '--toast-color': toast.color || '#6366f1' }}>
      <div className="toast-icon-wrap">
        <FiBell size={15} />
      </div>
      <div className="toast-body">
        <span className="toast-label">Reminder Due</span>
        <span className="toast-title">{toast.title}</span>
        <span className="toast-time">
          {format(new Date(toast.datetime), 'h:mm a')}
        </span>
      </div>
      <button
        className="toast-close"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
      >
        <FiX size={15} />
      </button>
    </div>
  );
});
