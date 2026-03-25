interface NumberInputProps {
    label: string;
    description: string;
    is_required?: boolean;
    input_type?: string;
    error?: string; // Zod error message for this field
}

export default function NumberInput({
    label,
    description,
    is_required = true,
    input_type = "number",
    error,
    ...rest // catches name, ref, onChange, onBlur from register()
}: NumberInputProps) {
    return (
        <div>
            <label htmlFor={label}>{description}:</label>
            <input 
                name={label} 
                placeholder={description} 
                type={input_type}
                required={is_required}
                step="any"
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
    )
}