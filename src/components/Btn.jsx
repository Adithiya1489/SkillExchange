export default function Btn({ children, onClick, type = "button", variant = "primary", className = "", disabled }) {
    const baseStyle = "relative inline-flex items-center justify-center rounded-xl px-6 py-3 text-center font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group active:scale-95 border border-transparent overflow-hidden";

    const variants = {
        primary: "bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:shadow-lg hover:shadow-primary-500/30 hover:-translate-y-0.5 before:absolute before:inset-0 before:bg-white/20 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500",
        secondary: "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-primary-600 hover:border-primary-100 hover:shadow-sm",
        danger: "bg-red-50 text-red-600 hover:bg-red-100 border-red-100",
        outline: "bg-transparent border-gray-300 text-gray-600 hover:border-primary-500 hover:text-primary-600"
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyle} ${variants[variant]} ${className}`}
        >
            <span className="flex items-center gap-2">{children}</span>
        </button>
    );
}
