//PICO Alert Component
const Alert = ({ type = 'info', title, children, onClose }) => {
    const types = {
        info: 'bg-blue-50 border-blue-200 text-blue-800',
        success: 'bg-green-50 border-green-200 text-green-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        error: 'bg-red-50 border-red-200 text-red-800'
    };

    return (
        <div className={`border rounded-lg p-4 ${types[type]}`}>
            <div className="flex justify-between">
                <div className="flex">
                    <div className="ml-3">
                        {title && <h3 className="text-sm font-medium">{title}</h3>}
                        <div className="mt-2 text-sm">{children}</div>
                    </div>
                </div>
                {onClose && (
                    <button onClick={onClose} className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 hover:bg-gray-100 focus:outline-none">
                        <span className="sr-only">Dismiss</span>
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};
export default Alert