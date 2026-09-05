"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export interface ConfirmOptions {
  title: string;
  /** One or two sentences: what happens, and whether it can be undone. */
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** "danger" for destructive actions, "brand" for ordinary confirmations. */
  tone?: "danger" | "brand";
}

type Resolver = (value: boolean) => void;

const ConfirmContext = createContext<
  ((options: ConfirmOptions) => Promise<boolean>) | null
>(null);

/**
 * Ask the user to confirm, in the app's own dialog.
 *
 * Reads like `window.confirm` at the call site but renders in-app, so a
 * destructive action never depends on a browser chrome popup that ignores our
 * styling and cannot say which item is about to disappear.
 */
export function useConfirm() {
  const confirm = useContext(ConfirmContext);
  if (!confirm) {
    throw new Error("useConfirm must be used within ConfirmProvider");
  }
  return confirm;
}

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolverRef = useRef<Resolver | null>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const confirm = useCallback((next: ConfirmOptions) => {
    previouslyFocused.current = document.activeElement as HTMLElement;
    setOptions(next);
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const settle = useCallback((value: boolean) => {
    resolverRef.current?.(value);
    resolverRef.current = null;
    setOptions(null);
    // Send focus back where it came from, so keyboard users do not restart
    // from the top of the page after every confirmation.
    previouslyFocused.current?.focus?.();
  }, []);

  useEffect(() => {
    if (!options) return;

    confirmButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") settle(false);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [options, settle]);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {options && (
        <div
          className="confirm-scrim"
          onClick={() => settle(false)}
          role="presentation"
        >
          <div
            className="confirm-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            aria-describedby={options.description ? "confirm-desc" : undefined}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="confirm-title" id="confirm-title">
              {options.title}
            </h2>
            {options.description && (
              <p className="confirm-desc" id="confirm-desc">
                {options.description}
              </p>
            )}
            <div className="confirm-actions">
              <button
                type="button"
                className="confirm-btn is-cancel"
                onClick={() => settle(false)}
              >
                {options.cancelLabel || "Volver"}
              </button>
              <button
                type="button"
                ref={confirmButtonRef}
                className={`confirm-btn is-${options.tone || "brand"}`}
                onClick={() => settle(true)}
              >
                {options.confirmLabel || "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}
