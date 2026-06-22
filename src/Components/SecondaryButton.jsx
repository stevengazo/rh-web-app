// Fluent 2 — Default (secondary) button: neutral surface + stroke
const SecondaryButton = ({
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
        bg-surface text-ink border border-stroke
        transition-colors duration-150
        hover:bg-surface-alt hover:border-stroke active:bg-stroke-soft
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1
        disabled:bg-surface disabled:text-ink-disabled disabled:border-stroke-soft disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default SecondaryButton;
