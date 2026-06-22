import { fieldClasses } from './atoms/fieldClasses';

const DateInput = ({
  value,
  onChange,
  disabled = false,
  error = false,
  className = '',
  ...props
}) => {
  return (
    <input
      type="date"
      value={value}
      disabled={disabled}
      onChange={onChange}
      className={fieldClasses({ error, className })}
      {...props}
    />
  );
};

export default DateInput;
