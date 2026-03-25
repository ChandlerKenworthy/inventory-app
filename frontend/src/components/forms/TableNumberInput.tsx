interface TableNumberInputProps {
    label: string;
    description: string;
    error?: string;
}

export default function TableNumberInput({
    label,
    description,
    error,
    ...rest
} : TableNumberInputProps) {
    return (
        <input 
            type="number" 
            required
            step="any"
            name={label}
            placeholder={description}
            aria-invalid={!!error}
            aria-describedby={error ? `${label}-error` : undefined}
            {...rest}
        />
    );
}