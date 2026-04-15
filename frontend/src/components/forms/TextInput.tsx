import "../../styles/components/forms/TextInput.css";

interface TextInputProps {
  label: string;
  description: string;
  is_required?: boolean;
  input_type?: string;
  error?: string; // Zod error message for this field
}

export default function TextInput({
  label,
  description,
  is_required = true,
  input_type = "text",
  error,
  ...rest // catches name, ref, onChange, onBlur from register()
}: TextInputProps) {
  return (
    <div className="input-container">
      <label htmlFor={label}>{description}:</label>
      <input
        id={label}
        className={"text-input " + (error ? "input-error" : "")}
        name={label}
        placeholder={description}
        type={input_type}
        required={is_required}
        aria-invalid={!!error}
        aria-describedby={error ? `${label}-error` : undefined}
        {...rest}
      />
      {error && (
        <span id={`${label}-error`} className="error">
          {error}
        </span>
      )}
    </div>
  );
}