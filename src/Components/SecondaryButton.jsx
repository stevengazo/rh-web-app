const SecondaryButton = ({ onClick, children, type = 'button' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="
        inline-flex items-center justify-center
        px-4 py-2 rounded-lg
        border border-gray-300
        bg-white text-gray-700 font-medium
        hover:bg-gray-100
        focus:outline-none focus:ring-2 focus:ring-indigo-500
        transition
      "
    >
      {children}
    </button>
  );
};

export default SecondaryButton;
