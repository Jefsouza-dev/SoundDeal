import { RegisterOptions, UseFormRegister } from "react-hook-form";

interface IInputProps {
  type: string;
  placeholder?: string;
  name: string;
  register: UseFormRegister<any>;
  error?: string;
  rules?: RegisterOptions;
  className?: string;
}

const Input = ({
  type,
  placeholder,
  name,
  register,
  error,
  rules,
  className,
}: IInputProps) => {
  return (
    <div>
      <input
        className="w-full border-2 rounded-md h-11 px-3"
        type={type}
        placeholder={placeholder}
        {...register(name, rules)}
        id={name}
      />

      {error && (
        <p className={`my-1 text-red-500 -mt-0 italic  ${className}`}>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
