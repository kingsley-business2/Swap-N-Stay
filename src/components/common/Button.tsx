// ========================== src/components/common/Button.tsx ==========================
import React from 'react';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({ label, onClick, disabled, className, type = 'button' }) => (
  <button type={type} className={`btn btn-primary ${className}`} onClick={onClick} disabled={disabled}>
    {label}
  </button>
);

export default Button;
