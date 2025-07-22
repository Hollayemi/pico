
//PICO Badge Component

const Badge = ({ children, variant = 'default', size = 'medium' }) => {
    const variants = {
        default: 'bg-gray-100 text-gray-800',
        primary: 'bg-brand-100 text-brand-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        danger: 'bg-red-100 text-red-800'
    };

    const sizes = {
        small: 'px-2 py-0.5 text-xs',
        medium: 'px-2.5 py-0.5 text-sm',
        large: 'px-3 py-1 text-base'
    };

    return (
        <span className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]}`}>
            {children}
        </span>
    );
};