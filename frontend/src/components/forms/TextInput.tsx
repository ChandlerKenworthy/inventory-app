export default function TextInput(
    {label, description, value, onChange}: 
    {label: string, description: string, value: string | number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}) {
    return (
        <div>
            <label htmlFor={label}>{description}:</label>
            <input name={label} placeholder={description} value={value} onChange={onChange} />
        </div>
    )
}