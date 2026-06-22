import { fieldClasses } from './atoms/fieldClasses';

// Fluent 2 — Dropdown / select.
// Accepts either `children` (<option>…</option>) or an `options` array.
const SelectInput = ({
  options,
  value,
  onChange,
  name,
  disabled = false,
  error = false,
  placeholder,
  className = '',
  children,
  ...props
}) => {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`${fieldClasses({ error, className })} cursor-pointer appearance-none bg-no-repeat bg-position-[right_0.5rem_center] pr-8`}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23616161' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
      }}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {children
        ? children
        : (options || []).map((opt) => {
            const val = typeof opt === 'object' ? opt.value : opt;
            const label = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={val} value={val}>
                {label}
              </option>
            );
          })}
    </select>
  );
};

export default SelectInput;
