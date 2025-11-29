import React from 'react';

type ErrorAlertProps = {
  message: React.ReactNode;
  className?: string;
};

const ErrorAlert: React.FC<ErrorAlertProps> = ({
  message,
  className = 'rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive',
}) => <div className={className}>{message}</div>;

export default ErrorAlert;
