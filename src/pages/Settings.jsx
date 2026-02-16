import { useState, useEffect } from 'react';
import Card from '../components/Card';
import Btn from '../components/Btn'; // Assuming Btn is updated to be the new component
import { User, Bell, Shield, LogOut, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { defaultAvatars } from '../utils/avatars';
import { X } from 'lucide-react';

export default function Settings() {


    const { userProfile, signOut, updateUserProfile } = useAuth();
    const [isAvatarOpen, setIsAvatarOpen] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        title: 'Software Engineer', // Default or from profile
        bio: ''
    });

    // Initialize form with user profile data
    // Initialize form with user profile data
    useEffect(() => {
        if (userProfile) {
            setFormData({
                name: userProfile.name || '',
                title: userProfile.title || 'Software Engineer',
                bio: userProfile.bio || ''
            });
        }
    }, [userProfile]);

    // Update local state when userProfile changes (e.g. on initial load)


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveProfile = async () => {
        try {
            await updateUserProfile(formData);
            // Optional: Add success notification here
            console.log("Profile updated successfully");
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    const handleAvatarSelect = async (avatarUrl) => {
        try {
            await updateUserProfile({ avatar: avatarUrl });
            setIsAvatarOpen(false);
        } catch (error) {
            console.error("Error updating avatar:", error);
        }
    };

    // Mock state for settings
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        updates: false
    });

    const toggleNotification = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Settings</h1>
                    <p className="mt-1 text-gray-500">Manage your account preferences</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {/* Left Sidebar / Navigation within Settings - Optional, simplified for now */}

                {/* Main Settings Content */}
                <div className="md:col-span-2 space-y-8">

                    {/* Profile Settings */}
                    <Card title="Profile Information">
                        {/* Header/Title is handled by Card prop now? Let's check Card.jsx usage. 
                            The previous Card refactor had: title && <div className="border-b..."><h3...>...</h3></div> 
                            So yes, title prop works.
                         */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-6">
                                <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200 overflow-hidden relative group">
                                    {userProfile?.avatar ? (
                                        <img
                                            src={userProfile.avatar}
                                            alt="Profile"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <User className="h-10 w-10" />
                                    )}
                                </div>
                                <div>
                                    <Btn
                                        variant="secondary"
                                        className="mr-3"
                                        onClick={() => setIsAvatarOpen(true)}
                                    >
                                        Change Avatar
                                    </Btn>
                                    {userProfile?.avatar && (
                                        <Btn
                                            variant="outline"
                                            className="text-red-600 border-red-100 hover:bg-red-50 hover:border-red-200"
                                            onClick={() => handleAvatarSelect(null)}
                                        >
                                            Remove
                                        </Btn>
                                    )}
                                </div>
                            </div>

                            {/* Avatar Selection Modal */}
                            {isAvatarOpen && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                            <h3 className="text-lg font-bold text-gray-900">Choose an Avatar</h3>
                                            <button
                                                onClick={() => setIsAvatarOpen(false)}
                                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                                                {defaultAvatars.map((avatar, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => handleAvatarSelect(avatar)}
                                                        className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all hover:scale-105 ${userProfile?.avatar === avatar
                                                            ? 'border-primary-600 ring-2 ring-primary-100'
                                                            : 'border-transparent hover:border-gray-200'
                                                            }`}
                                                    >
                                                        <img
                                                            src={avatar}
                                                            alt={`Avatar ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        {userProfile?.avatar === avatar && (
                                                            <div className="absolute inset-0 bg-primary-600/20 flex items-center justify-center">
                                                                <div className="bg-primary-600 text-white p-1 rounded-full">
                                                                    <Check className="w-4 h-4" />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-gray-200 bg-white py-3 px-4 text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Title / Role</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-gray-200 bg-white py-3 px-4 text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                                <textarea
                                    rows="3"
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    placeholder="Tell us a little about yourself..."
                                    className="w-full rounded-xl border border-gray-200 bg-white py-3 px-4 text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all resize-none"
                                ></textarea>
                            </div>

                            <div className="flex justify-end">
                                <Btn variant="primary" onClick={handleSaveProfile}>Save Changes</Btn>
                            </div>
                        </div>
                    </Card>

                    {/* Account Settings */}
                    <Card title="Account Security">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                <div className="flex gap-4">
                                    <input
                                        type="email"
                                        defaultValue="user@example.com"
                                        disabled
                                        className="flex-1 rounded-xl border border-gray-200 bg-gray-50 py-3 px-4 text-gray-500 outline-none cursor-not-allowed"
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-400">Contact support to change your email.</p>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <h4 className="text-sm font-bold text-gray-900 mb-4">Change Password</h4>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <input
                                        type="password"
                                        placeholder="Current Password"
                                        className="w-full rounded-xl border border-gray-200 bg-white py-3 px-4 text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                                    />
                                    <input
                                        type="password"
                                        placeholder="New Password"
                                        className="w-full rounded-xl border border-gray-200 bg-white py-3 px-4 text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                                    />
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <Btn variant="secondary">Update Password</Btn>
                                </div>
                            </div>
                        </div>
                    </Card>

                </div>

                {/* Right Sidebar */}
                <div className="space-y-8">
                    <Card title="Notifications">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                                        <Bell className="h-5 w-5" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">Email Notifications</span>
                                </div>
                                <button
                                    onClick={() => toggleNotification('email')}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${notifications.email ? 'bg-primary-600' : 'bg-gray-200'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.email ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                                        <Bell className="h-5 w-5" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">Push Notifications</span>
                                </div>
                                <button
                                    onClick={() => toggleNotification('push')}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${notifications.push ? 'bg-primary-600' : 'bg-gray-200'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.push ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-red-50/50 border-red-100">
                        <h3 className="font-bold text-lg text-red-700 mb-2">Danger Zone</h3>
                        <p className="text-sm text-red-600/80 mb-4">
                            Once you delete your account, there is no going back. Please be certain.
                        </p>
                        <Btn className="w-full bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300">
                            Delete Account
                        </Btn>
                    </Card>
                </div>
            </div>
        </div>
    );
}
