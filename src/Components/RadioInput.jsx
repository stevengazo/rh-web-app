// Fluent 2 — Radio
const RadioInput = ({
  label,
  name,
  value,
  checked,
  onChange,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <label
      className={`inline-flex items-center gap-2 text-sm text-ink select-none ${
        disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="h-4 w-4 accent-brand cursor-pointer disabled:cursor-not-allowed"
        {...props}
      />
      {label && <span>{label}</span>}
    </label>
  );
};

export default RadioInput;
