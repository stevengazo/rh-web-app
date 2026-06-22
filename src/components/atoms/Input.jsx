import { fieldClasses } from './fieldClasses';

const Input = ({ className = '', error = false, ...props }) => {
  return <input className={fieldClasses({ error, className })} {...props} />;
};

export default Input;
