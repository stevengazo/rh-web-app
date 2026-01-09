import Input from '../atoms/Input';

const InputField = ({ icon: Icon, className = '', ...props }) => {
  return (
    <div className={`relative ${className}`}>
      {Icon && <Icon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />}
      <Input className="pl-10" {...props} />
    </div>
  );
};

export default InputField;
