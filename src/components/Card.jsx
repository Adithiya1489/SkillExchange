export default function Card({ title, children, className = "" }) {
    return (
        <div className={`group relative bg-white rounded-2xl border border-gray-100 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 text-gray-900 overflow-hidden ${className}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50/0 via-transparent to-primary-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            {title && (
                <div className="relative border-b border-gray-100 py-5 px-6">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary-700 transition-colors duration-300">
                        {title}
                    </h3>
                </div>
            )}
            <div className="relative p-6">
                {children}
            </div>
        </div>
    );
}
