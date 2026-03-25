interface RadioInputProps {
    label: string;
    description: string;
    options: { value: string; label: string }[];
    error?: string; // Zod error message for this field
}

export default function RadioInput({
    label,
    description,
    options,
    error,
    ...rest // catches name, ref, onChange, onBlur from register()
}: RadioInputProps) {
    return (
        <div>
            <fieldset>
                <legend className="font-bold">{description}</legend>
                <div>
                    {options.map((option) => (
                        <div key={option.value}>
                            <input
                                type="radio"
                                id={`${label}-${option.value}`} // Unique ID for label pairing
                                value={option.value}
                                {...rest} // Spread Zod/RHF props here
                            />
                            <label htmlFor={`${label}-${option.value}`}>
                                {option.label}
                            </label>
                        </div>
                    ))}
                </div>
            </fieldset>
            
            
            {/* Zod Error Message */}
            {error && (
                <span className="text-red-500 text-sm">{error}</span>
            )}
        </div>
    )
}