// Fluent 2 — Checkbox
const CheckBoxInput = ({
  label,
  checked,
  onChange,
  name,
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
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="h-4 w-4 rounded-sm accent-brand cursor-pointer disabled:cursor-not-allowed"
        {...props}
      />
      {label && <span>{label}</span>}
    </label>
  );
};

export default CheckBoxInput;
