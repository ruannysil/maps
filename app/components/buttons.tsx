'use client'

import React from 'react'

interface ButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
}

export default function Buttons({ label, onClick, className }: ButtonProps) {
  return (
    <button onClick={onClick} className={`${className}`}>
      {label}
    </button>
  )
}
