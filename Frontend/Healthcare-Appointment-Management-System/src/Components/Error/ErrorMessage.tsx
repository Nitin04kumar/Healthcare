
import React from 'react';
import './ErrorMessage.css';

interface ErrorMessageProps {
  type: 'error' | 'loading' | 'success' | 'info' | 'warning';
  message: string;
  onDismiss?: () => void;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  type, 
  message, 
  onDismiss, 
  className = '' 
}) => {
  const iconMap = {
    error: '❌',
    loading: '⏳',
    success: '✅',
    info: 'ℹ️',
    warning: '⚠️'
  };

  return (
    <div className={`error-message error-message--${type} ${className}`}>
      <div className="error-message__content">
        <span className="error-message__icon">{iconMap[type]}</span>
        <span className="error-message__text">{message}</span>
      </div>
      {onDismiss && (
        <button 
          className="error-message__dismiss"
          onClick={onDismiss}
          aria-label="Dismiss message"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;