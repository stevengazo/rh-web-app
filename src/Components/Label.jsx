const Label = ({ children, htmlFor, className = '' }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-semibold text-ink-secondary mb-1 ${className}`}
    >
      {children}
    </label>
  );
};

export default Label;
