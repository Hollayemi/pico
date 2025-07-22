const Input = ({
    type = 'text',
    placeholder = '',
    value,
    onChange,
    label,
    error,
    disabled = false,
    required = false,
    className = ''
}) => {
    return (
        <div className="space-y-1">
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                required={required}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${error ? 'border-red-500' : 'border-gray-300'
                    } ${className}`}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
};
export default Input