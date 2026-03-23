import React from 'react';

type SpinnerProps = {
  className?: string;
};

const Spinner: React.FC<SpinnerProps> = ({
  className = 'h-24 rounded-xl border border-border bg-card animate-pulse',
}) => <div className={className} />;

export default Spinner;
