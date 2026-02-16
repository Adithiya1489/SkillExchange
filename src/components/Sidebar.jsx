import { LayoutDashboard, BookOpen, Users, Award, MessageSquare, BarChart2, Settings, LogOut, Database, Zap } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// import logo from '../assets/logo.jpg'; // Removed image logo

const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: BookOpen, label: 'My Sessions', path: '/sessions' },
    { icon: Users, label: 'Matches', path: '/matches' },
    { icon: Award, label: 'My Skills', path: '/skills' },
    { icon: MessageSquare, label: 'Messages', path: '/messages' },
    { icon: BarChart2, label: 'Stats', path: '/stats' },
    { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
    const location = useLocation();
    const { pathname } = location;
    const { logout } = useAuth();

    async function handleLogout() {
        try {
            await logout();
        } catch (error) {
            console.error("Failed to log out", error);
        }
    }

    return (
        <>
            {/* Mobile Backdrop */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-49 bg-slate-900/50 backdrop-blur-sm lg:hidden"
                ></div>
            )}

            <aside
                className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col overflow-y-hidden bg-white border-r border-gray-100 text-gray-600 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } shadow-none lg:shadow-none`}
            >
                <div className="flex items-center justify-between gap-2 px-6 py-6 border-b border-gray-100 lg:border-none">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white shadow-lg shadow-primary-500/30">
                            <Zap className="h-6 w-6 fill-current" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-gray-900">
                            Skill<span className="text-primary-600">Exchange</span>
                        </span>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="block lg:hidden text-gray-500 hover:text-gray-900"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear flex-1">
                    <nav className="mt-6 px-4">
                        <div>
                            <h3 className="mb-4 ml-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                Main Menu
                            </h3>
                            <ul className="mb-6 flex flex-col gap-1">
                                {sidebarItems.map((item) => (
                                    <li key={item.label}>
                                        <Link
                                            to={item.path}
                                            className={`group relative flex items-center gap-3 rounded-xl py-3 px-4 font-medium transition-all duration-300 ease-in-out ${pathname === item.path
                                                ? 'bg-gradient-to-r from-primary-50 to-white text-primary-600 shadow-sm'
                                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                        >
                                            {pathname === item.path && (
                                                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full bg-primary-600"></span>
                                            )}
                                            <item.icon className={`h-5 w-5 transition-transform duration-300 ${pathname === item.path ? 'text-primary-600 scale-110' : 'text-gray-400 group-hover:text-gray-600 group-hover:scale-110'}`} />
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </nav>
                </div>

                <div className="mt-auto p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg py-2.5 px-4 font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors">
                        <LogOut className="h-5 w-5" />
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
}
