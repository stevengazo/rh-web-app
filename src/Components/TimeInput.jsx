const TimeInput = ({
  value,
  onChange,
  disabled = false,
  error = false,
}) => {
  return (
    <input
      type="time"
      value={value}
      disabled={disabled}
      onChange={onChange}
      className={`
        w-full rounded-lg px-4 py-2
        border text-sm
        focus:outline-none focus:ring-2 transition
        ${error
          ? "border-red-500 focus:ring-red-500"
          : "border-gray-300 focus:ring-indigo-500"}
        ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
      `}
    />
  )
}

export default TimeInput
