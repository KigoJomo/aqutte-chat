'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Button from './Button';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'default';
  isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  isLoading = false,
}) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && !isLoading) {
      onConfirm();
    }
  };

  const variantStyles = {
    danger: 'border-red-300/30',
    warning: 'border-accent/50',
    default: 'border-foreground-light/30',
  };

  const iconVariants = {
    danger: <AlertTriangle size={20} className="text-red-400" />,
    warning: <AlertTriangle size={20} className="text-accent" />,
    default: null,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={handleBackdropClick}
          onKeyDown={handleKeyDown}
          tabIndex={-1}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/10 backdrop-blur-xs" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className={`relative w-full max-w-md bg-background-dark rounded-2xl border-2 ${variantStyles[variant]} shadow-2xl`}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-0">
              <div className="flex items-center gap-3">
                {iconVariants[variant]}
                <h3 className="">
                  {title}
                </h3>
              </div>
              <Button
                variant="seamless"
                onClick={onClose}
                className="!p-1 opacity-70 hover:opacity-100"
                disabled={isLoading}>
                <X size={18} />
              </Button>
            </div>

            {/* Content */}
            <div className="w-full px-6 py-4">
              <span className="w-full text-sm whitespace-pre-wrap text-foreground-light">
                {message}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 p-6 pt-0">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isLoading}>
                {cancelText}
              </Button>
              <Button
                variant={variant === 'danger' ? 'danger' : 'primary'}
                onClick={onConfirm}
                className="flex-1"
                disabled={isLoading}>
                {isLoading ? 'Processing...' : confirmText}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
