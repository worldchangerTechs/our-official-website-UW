import React from 'react';
import './Button.css'; // optional if you want extra styles

export default function Button({ children, variant = 'primary', className = '', onClick, type = 'button' }) {
  const base = 'button';
  const variantClass = {
    primary: 'button-primary',
    secondary: 'button-secondary',
    ghost: 'button-ghost',
  }[variant] || 'button-primary';
  return (
    <button
      type={type}
      className={`${base} ${variantClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

