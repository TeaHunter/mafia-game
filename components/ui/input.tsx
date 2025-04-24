'use client';

import React from 'react';

export function Input({
  className = '',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`px-3 py-2 rounded border border-gray-300 text-black ${className}`}
      {...props}
    />
  );
}
