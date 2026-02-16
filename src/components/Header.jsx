import { Menu, User, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header({ sidebarOpen, setSidebarOpen }) {
    const { userProfile } = useAuth();

    return (
        <header className="sticky top-0 z-40 flex w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="flex flex-grow items-center justify-between px-4 py-3 shadow-none md:px-6 2xl:px-11">
                <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
                    <button
                        aria-controls="sidebar"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSidebarOpen(!sidebarOpen);
                        }}
                        className="z-50 block rounded-lg border border-gray-200 bg-white p-1.5 text-gray-600 shadow-sm lg:hidden"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div>

                <div className="hidden sm:block">
                    {/* Search bar could go here */}
                </div>

                <div className="flex items-center gap-3 2xl:gap-7">
                    <ul className="flex items-center gap-2 2xl:gap-4">
                        <li className="relative">
                            <Link to="#" className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-primary-600 border-2 border-white"></span>
                            </Link>
                        </li>
                    </ul>

                    <div className="relative pl-4 border-l border-gray-100">
                        <Link className="flex items-center gap-3" to="/profile">
                            <span className="hidden text-right lg:block">
                                <span className="block text-sm font-semibold text-gray-900">
                                    {userProfile?.name || 'User'}
                                </span>
                                <span className="block text-xs font-medium text-gray-500">
                                    Lvl {userProfile?.lvl || 1} • {userProfile?.credits || 0} Credits
                                </span>
                            </span>
                            <span className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden border border-gray-200">
                                {userProfile?.avatar ? (
                                    <img
                                        src={userProfile.avatar}
                                        alt={userProfile?.name || "User"}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <User className="h-6 w-6" />
                                )}
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
