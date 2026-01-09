const PrimaryButton = ({ onClick, children, type = 'button' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="
        inline-flex items-center justify-center
        px-4 py-2 rounded-lg
        bg-indigo-600 text-white font-medium
        hover:bg-indigo-700
        focus:outline-none focus:ring-2 focus:ring-indigo-500
        transition
      "
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
