const Card = ({ children, className = '', padding = 'medium' }) => {
    const paddingClasses = {
        none: '',
        small: 'p-4',
        medium: 'p-6',
        large: 'p-8'
    };

    return (
        <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${paddingClasses[padding]} ${className}`}>
            {children}
        </div>
    );
};
export default Card