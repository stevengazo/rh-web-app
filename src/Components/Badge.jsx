// Fluent 2 — status badge
const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-[#f0f0f0] text-ink-secondary',
    success: 'bg-green-50 text-green-700',
    warning: 'bg-amber-50 text-amber-800',
    danger: 'bg-red-50 text-red-700',
    info: 'bg-brand-tint text-brand-700',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
