import { motion } from 'framer-motion';

// Fluent 2 — subtle icon button
const IconButton = ({
  icon: Icon,
  onClick,
  variant = 'default',
  disabled = false,
  size = 18,
  type = 'button',
  className = '',
  ...props
}) => {
  const variants = {
    default: 'text-ink-secondary hover:bg-surface-alt active:bg-stroke-soft',
    primary: 'text-brand hover:bg-brand-tint active:bg-brand-100',
    danger: 'text-red-600 hover:bg-red-50 active:bg-red-100',
  };

  return (
    <motion.button
      type={type}
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center
        h-8 w-8 rounded-md
        transition-colors duration-150
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1
        disabled:text-ink-disabled disabled:cursor-not-allowed disabled:hover:bg-transparent
        ${variants[variant]} ${className}
      `}
      {...props}
    >
      <Icon size={size} />
    </motion.button>
  );
};

export default IconButton;
