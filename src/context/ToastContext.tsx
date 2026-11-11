import {
  IToast,
  IToastContextData,
  IToastProviderProps,
} from "@/interfaces/ui/IUiToast";
import { ToastType } from "@/types/Toast";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const ToastContext = createContext<IToastContextData | undefined>(undefined);

export function ToastProvider({ children }: IToastProviderProps) {
  const [toasts, setToasts] = useState<IToast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((currentToasts) =>
      currentToasts.map((toast) =>
        toast.id === id
          ? {
              ...toast,
              leaving: true,
            }
          : toast,
      ),
    );

    setTimeout(() => {
      setToasts((currentToasts) =>
        currentToasts.filter((toast) => toast.id !== id),
      );
    }, 300);
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastType) => {
      const id = `${Date.now()}-${Math.random()}`;

      setToasts((currentToasts) => [
        ...currentToasts,
        {
          id,
          message,
          type,
        },
      ]);

      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast],
  );

  const showSuccess = useCallback(
    (message: string) => {
      addToast(message, "success");
    },
    [addToast],
  );

  const showError = useCallback(
    (message: string) => {
      addToast(message, "error");
    },
    [addToast],
  );

  const contextValue = useMemo<IToastContextData>(
    () => ({
      toasts,
      showSuccess,
      showError,
      removeToast,
    }),
    [toasts, showSuccess, showError, removeToast],
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast(): IToastContextData {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast deve ser usado dentro de um ToastProvider.");
  }

  return context;
}
