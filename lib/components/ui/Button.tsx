'use client';

import React, { ButtonHTMLAttributes, FormEvent } from 'react';
import Link from 'next/link';
import { HTMLMotionProps, motion } from 'framer-motion';

// Separate HTML props from Motion props to avoid conflicts
type HTMLButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onAnimationStart' | 'onDrag' | 'onDragEnd' | 'onDragStart'
>;

type MotionButtonProps = Omit<
  HTMLMotionProps<'button'>,
  keyof ButtonHTMLAttributes<HTMLButtonElement>
>;

interface ButtonProps extends HTMLButtonProps, MotionButtonProps {
  children: React.ReactNode;
  href?: string;
  target?: '_blank' | '_self';
  variant?: 'primary' | 'outline' | 'seamless' | 'danger';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  linkClasses?: string
  type?: 'button' | 'submit' | 'reset';
  onClick?:
    | (() => void)
    | ((e: FormEvent<Element>) => Promise<void>)
    | ((e: FormEvent<Element>) => void);
}

const Button: React.FC<ButtonProps> = ({
  children,
  href,
  target,
  variant = 'primary',
  size = 'default',
  className = '',
  linkClasses ='',
  type = 'button',
  onClick,
  ...props
}) => {
  // base styles
  const baseStyles =
    'flex items-center justify-center font-medium rounded-full transition-colors focus:outline-none cursor-pointer';

  // variant styles
  const variantStyles = {
    primary:
      'bg-accent text-foreground hover:opacity-90 border border-foreground/30',
    outline:
      'bg-transparent border border-accent/50 text-foreground hover:bg-accent/5',
    seamless: 'bg-transparent text-foreground hover:bg-background-light !p-2',
    danger: 'bg-red-500 text-background hover:bg-red-600',
  };

  // size styles
  const sizeStyles = {
    sm: 'text-sm px-3 py-1',
    default: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  };

  // combine styles
  const buttonStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} target={target} className={linkClasses}>
        <motion.button
          // whileHover={{ scale: 0.98 }}
          whileTap={{ scale: 1.02 }}
          type={type}
          className={buttonStyles}
          onClick={onClick}
          {...props}>
          {children}
        </motion.button>
      </Link>
    );
  }

  return (
    <motion.button
      // whileHover={{ scale: 0.98 }}
      whileTap={{ scale: 1.02 }}
      type={type}
      className={buttonStyles}
      onClick={onClick}
      {...props}>
      {children}
    </motion.button>
  );
};

export default Button;
