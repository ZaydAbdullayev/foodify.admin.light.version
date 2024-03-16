import { useEffect } from "react";

export const Mousedown = (props) => {
  const { modalRef = null, onClose = null } = props;

  useEffect(() => {
    // Close modal by click outside the modal
    const heandlerMouse = (e) => {
      if (!modalRef?.current?.contains(e.target)) return onClose();
    };

    // Add event listeners
    document.addEventListener("mousedown", heandlerMouse);

    // Remove event listeners
    return () => document.removeEventListener("mousedown", heandlerMouse);
  });
  return null;
};
