const PageTitle = ({ children, className = '' }) => {
  return (
    <h1 className={`text-3xl font-semibold text-ink mb-6 ${className}`}>
      {children}
    </h1>
  );
};
export default PageTitle;
