import * as React from "react";
import toast, { ToastOptions } from "react-hot-toast";
import { useGlobalContext } from "../types/context.type";
export function useClickOutside<T extends HTMLElement>(onClose: () => void) {
  const ref = React.useRef<T | null>(null);

  React.useEffect(() => {
    // Function to handle click events
    function handleClickOutside(event: MouseEvent) {
      // Check if the clicked element is outside the target element
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose(); // Trigger the onClose function
      }
    }

    // Add event listener for clicks
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return ref;
}

export function useShowToast() {
  const ctx = useGlobalContext();

  const showToast = (
    type: "success" | "error",
    data: string,
    option?: ToastOptions
  ) => {
    if (ctx.toastid) {
      toast.dismiss(ctx.toastid); // Dismiss the existing toast
      ctx.settoastid(""); // Reset the toast ID
    }

    // Show new toast and store its ID in context
    const newToastId =
      type === "success"
        ? toast.success(data, { duration: 1000, ...option })
        : toast.error(data, { duration: 1000, ...option });

    ctx.settoastid(newToastId);
  };

  const SuccessToast = (data: string, option?: ToastOptions) =>
    showToast("success", data, option);

  const ErrorToast = (data: string, option?: ToastOptions) =>
    showToast("error", data, option);

  return { SuccessToast, ErrorToast };
}
