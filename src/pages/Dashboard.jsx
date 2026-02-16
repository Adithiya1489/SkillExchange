import Card from '../components/Card';
import Btn from '../components/Btn';
import { Plus, Search, Video, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
                    <p className="mt-1 text-gray-500">Welcome back to SkillExchange</p>
                </div>
                <Btn variant="primary" className="shadow-lg shadow-primary-500/30">
                    <Plus className="h-5 w-5 mr-2" />
                    New Session
                </Btn>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 xl:grid-cols-4">
                {/* Quick Action Cards */}
                <Card className="hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex flex-col items-center justify-center p-2 text-center h-full">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-sm">
                            <Plus className="h-7 w-7" />
                        </div>
                        <h4 className="mb-2 text-lg font-bold text-gray-900">Add Skill</h4>
                        <span className="mb-6 text-sm font-medium text-gray-500">List a skill you can teach</span>
                        <Btn variant="secondary" className="w-full mt-auto">Add New</Btn>
                    </div>
                </Card>

                <Card className="hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex flex-col items-center justify-center p-2 text-center h-full">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-600 shadow-sm">
                            <Search className="h-7 w-7" />
                        </div>
                        <h4 className="mb-2 text-lg font-bold text-gray-900">Find Match</h4>
                        <span className="mb-6 text-sm font-medium text-gray-500">Search for skills you want</span>
                        <Link to="/matches" className="w-full mt-auto">
                            <Btn variant="secondary" className="w-full">Search</Btn>
                        </Link>
                    </div>
                </Card>

                <Card className="hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex flex-col items-center justify-center p-2 text-center h-full">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 shadow-sm">
                            <Video className="h-7 w-7" />
                        </div>
                        <h4 className="mb-2 text-lg font-bold text-gray-900">Start Session</h4>
                        <span className="mb-6 text-sm font-medium text-gray-500">Join upcoming session</span>
                        <Btn variant="primary" className="w-full mt-auto">Join Now</Btn>
                    </div>
                </Card>

                {/* Stats Card */}
                <Card title="Your Stats" className="row-span-2">
                    <div className="flex flex-col gap-5">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                            <span className="text-gray-500 font-medium">Credits</span>
                            <span className="font-bold text-gray-900 text-lg">12</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                            <span className="text-gray-500 font-medium">Completed</span>
                            <span className="font-bold text-gray-900 text-lg">8</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                            <span className="text-gray-500 font-medium">Rating</span>
                            <span className="font-bold text-yellow-500 text-lg flex items-center gap-1">4.8 <span className="text-sm">★</span></span>
                        </div>
                        <div className="mt-2 pt-4 border-t border-gray-100">
                            <h5 className="font-semibold mb-3 text-sm uppercase text-gray-400 tracking-wider">Weekly Goal</h5>
                            <div className="relative h-2 w-full rounded-full bg-gray-100">
                                <div className="absolute left-0 h-full w-3/4 rounded-full bg-primary-500"></div>
                            </div>
                            <div className="flex justify-between mt-2">
                                <span className="text-xs text-gray-500 font-medium">3/4 Sessions</span>
                                <span className="text-xs text-primary-600 font-bold">75%</span>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Active Sessions List */}
                <div className="col-span-1 md:col-span-2 xl:col-span-3">
                    <Card title="Active Sessions" className="h-full">
                        <div className="flex flex-col min-h-[200px]">
                            <div className="grid grid-cols-3 rounded-xl bg-gray-50 py-3 px-4 sm:grid-cols-5 mb-4">
                                <div className="text-left">
                                    <h5 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Skill</h5>
                                </div>
                                <div className="text-center">
                                    <h5 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Partner</h5>
                                </div>
                                <div className="text-center">
                                    <h5 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Status</h5>
                                </div>
                                <div className="hidden text-center sm:block">
                                    <h5 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Time</h5>
                                </div>
                                <div className="hidden text-center sm:block">
                                    <h5 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Action</h5>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
                                <Clock className="h-10 w-10 mb-3 opacity-20" />
                                <p>No active sessions found.</p>
                                <Btn variant="outline" className="mt-4 text-sm py-2">Schedule Session</Btn>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
