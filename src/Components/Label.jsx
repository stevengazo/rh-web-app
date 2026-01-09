const Label = ({ children, htmlFor }) => {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-gray-600 mb-1"
    >
      {children}
    </label>
  );
};

export default Label;
