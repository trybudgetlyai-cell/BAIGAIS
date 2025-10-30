import React from 'react';

// FIX: Extend React.ButtonHTMLAttributes to allow all standard button props like `type` and make onClick optional.
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
}

const Button: React.FC<ButtonProps> = ({ children, className = '', variant = 'primary', ...props }) => {
  const baseStyles = 'px-4 py-2 rounded-md font-semibold transition-all duration-200 flex items-center justify-center gap-2';
  const variantStyles = {
    primary: 'bg-accent-primary text-accent-text hover:bg-opacity-80',
    secondary: 'bg-text-secondary/20 text-text-primary hover:bg-opacity-30',
    danger: 'bg-accent-secondary text-accent-text hover:bg-opacity-80',
  };
  const disabledStyles = 'opacity-50 cursor-not-allowed';

  return (
    <button
      {...props}
      className={`${baseStyles} ${variantStyles[variant]} ${props.disabled ? disabledStyles : ''} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
