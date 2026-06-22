// Fluent 2 — surface card
const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`
        bg-surface rounded-xl shadow-sm
        border border-stroke-soft
        p-6
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
