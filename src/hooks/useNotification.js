import { useEffect, useRef, useState, useCallback } from 'react';

const POLL_INTERVAL_MS = 5_000;
const NOTIFICATION_WINDOW_MS = 300_000;
const NOTIFICATION_SOUND_SRC =
  'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbsGczHjqIqt/LdUEjOIS04eFwPBkvi6TesXA5JkF4r9rJfUspK3Wnzr6FWjgnaLHg0qxxRSk2gZjPsIRdOCVTo8fEooRdNiVdq9HDoIRfPzBxtd3WjYxgRzRsq87CmYVcPy1xtNvQiohlSDRrrM7CmIRdQDV0t+DXkY1qUjxxudvOh4BXOCdYnMG3jF06LF+z3+N4TC4ycb/e0H+BUTcnWZ3Au4xdOixfs9/jeEwuMnG/3tB/gVE3J1mdwLuMXTosX7Pf43hMLjJxv97Qf4FRNydZncC7jF06LF+z3+N4TC4ycb/e0H+BUQ=';

let cachedAudio = null;

function playNotificationSound() {
  try {
    if (!cachedAudio) {
      cachedAudio = new Audio(NOTIFICATION_SOUND_SRC);
      cachedAudio.volume = 0.5;
    }
    cachedAudio.currentTime = 0;
    cachedAudio.play().catch(() => {});
  } catch {
    /* audio API unavailable */
  }
}

function showBrowserNotification(reminder) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('⏰ Reminder Due!', {
      body: reminder.title,
      icon: '/favicon.svg',
      tag: reminder.id,
    });
  }
}

export function useNotification(reminders) {
  const notifiedRef = useRef(new Set());
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const checkReminders = () => {
      const now = Date.now();

      reminders.forEach((reminder) => {
        if (reminder.completed || notifiedRef.current.has(reminder.id)) return;

        const diff = new Date(reminder.datetime).getTime() - now;

        if (diff <= 0 && diff > -NOTIFICATION_WINDOW_MS) {
          notifiedRef.current.add(reminder.id);

          setToasts((prev) => [
            ...prev,
            {
              id: reminder.id,
              title: reminder.title,
              datetime: reminder.datetime,
              color: reminder.color,
            },
          ]);

          playNotificationSound();
          showBrowserNotification(reminder);
        }
      });
    };

    checkReminders();
    const interval = setInterval(checkReminders, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [reminders]);

  return { toasts, dismissToast, dismissAllToasts };
}
