interface NumberInputProps {
    label: string;
    description: string;
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    is_required?: boolean;
    input_type?: string;
    min?: number;
    max?: number;
}

export default function NumberInput({
    label,
    description,
    value,
    onChange,
    is_required = true,
    input_type = "number",
    min=0,
    max=Infinity
}: NumberInputProps) {
    return (
        <div>
            <label htmlFor={label}>{description}:</label>
            <input 
                name={label} 
                placeholder={description} 
                value={value} 
                onChange={onChange}
                type={input_type}
                required={is_required}
                min={min}
                max={max}
            />
        </div>
    )
}