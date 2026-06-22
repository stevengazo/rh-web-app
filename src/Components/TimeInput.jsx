import { fieldClasses } from './atoms/fieldClasses';

const TimeInput = ({
  value,
  onChange,
  disabled = false,
  error = false,
  className = '',
  ...props
}) => {
  return (
    <input
      type="time"
      value={value}
      disabled={disabled}
      onChange={onChange}
      className={fieldClasses({ error, className })}
      {...props}
    />
  );
};

export default TimeInput;
