import { fieldClasses } from './atoms/fieldClasses';

const TextInput = ({
  value,
  onChange,
  placeholder = '',
  type = 'text',
  name,
  disabled = false,
  error = false,
  className = '',
  ...props
}) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      disabled={disabled}
      onChange={onChange}
      placeholder={placeholder}
      className={fieldClasses({ error, className })}
      {...props}
    />
  );
};

export default TextInput;
