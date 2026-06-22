const SectionTitle = ({ children, className = '' }) => {
  return (
    <h2 className={`text-xl font-semibold text-ink-secondary mb-4 ${className}`}>
      {children}
    </h2>
  );
};

export default SectionTitle;
