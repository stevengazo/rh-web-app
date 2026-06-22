// Fluent 2 — Primary (filled brand) button
const PrimaryButton = ({
  onClick,
  children,
  type = 'button',
  className = '',
  disabled = false,
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2
        h-8 px-3 rounded-md
        text-sm font-semibold
        bg-brand text-white border border-transparent
        transition-colors duration-150
        hover:bg-brand-hover active:bg-brand-pressed
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1
        disabled:bg-surface-alt disabled:text-ink-disabled disabled:cursor-not-allowed disabled:border-transparent
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
