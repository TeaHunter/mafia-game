'use client';

import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded bg-blue-500 text-white font-bold hover:bg-blue-600 transition ${props.className || ''}`}
    >
      {children}
    </button>
  );
}
