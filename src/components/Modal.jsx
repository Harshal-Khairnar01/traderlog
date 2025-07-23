"use client";

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const Modal = ({ children, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [onClose]);

  if (typeof window === "undefined") {
    return null; // Don't render on the server
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        ref={modalRef}
        // Removed max-h-[90vh] and overflow-y-auto to disable scrolling within the modal itself
        className="relative bg-zinc-900 rounded-lg shadow-xl w-11/12 max-w-5xl"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-200 text-4xl cursor-pointer"
          aria-label="Close modal"
        >
          &times;
        </button>
        <div className="">
          {children}
        </div>
      </div>
    </div>,
    document.body // Append to the body
  );
};

export default Modal;