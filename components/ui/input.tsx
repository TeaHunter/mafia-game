'use client';

import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`border p-2 rounded w-full ${props.className || ''}`}
    />
  );
}
