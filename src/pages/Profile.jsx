import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Card from '../components/Card';
import Btn from '../components/Btn';
import { User, MapPin, Save, Plus, X } from 'lucide-react';

export default function Profile() {
    const { currentUser, userProfile } = useAuth();
    const [editing, setEditing] = useState(false);

    // Form states
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [skillsOffered, setSkillsOffered] = useState([]);
    const [skillsWanted, setSkillsWanted] = useState([]);
    const [newOffer, setNewOffer] = useState('');
    const [newWant, setNewWant] = useState('');
    const [msg, setMsg] = useState('');

    useEffect(() => {
        if (userProfile) {
            setName(userProfile.name || '');
            setBio(userProfile.bio || '');
            setSkillsOffered(userProfile.skillsOffered || []);
            setSkillsWanted(userProfile.skillsWanted || []);
        }
    }, [userProfile]);

    async function handleSave() {
        if (!currentUser) return;
        try {
            const userRef = doc(db, "users", currentUser.uid);
            await updateDoc(userRef, {
                name,
                bio,
                skillsOffered,
                skillsWanted
            });
            setMsg('Profile updated successfully!');
            setEditing(false);
            setTimeout(() => setMsg(''), 3000);
        } catch (err) {
            console.error(err);
            setMsg('Error updating profile');
        }
    }

    function addSkill(type) {
        if (type === 'offer' && newOffer.trim()) {
            if (!skillsOffered.includes(newOffer.trim())) {
                setSkillsOffered([...skillsOffered, newOffer.trim()]);
            }
            setNewOffer('');
        }
        if (type === 'want' && newWant.trim()) {
            if (!skillsWanted.includes(newWant.trim())) {
                setSkillsWanted([...skillsWanted, newWant.trim()]);
            }
            setNewWant('');
        }
    }

    function removeSkill(type, skill) {
        if (type === 'offer') {
            setSkillsOffered(skillsOffered.filter(s => s !== skill));
        }
        if (type === 'want') {
            setSkillsWanted(skillsWanted.filter(s => s !== skill));
        }
    }

    if (!userProfile) return <div className="p-4">Loading profile...</div>;

    return (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            {/* Left Column: User Info */}
            <div className="xl:col-span-1">
                <Card className="text-center">
                    <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                        <User className="h-12 w-12 text-slate-500" />
                    </div>
                    <h3 className="mb-1 text-xl font-bold text-gray-900">
                        {userProfile.name}
                    </h3>
                    <p className="mb-4 text-sm text-slate-500">
                        {userProfile.email}
                    </p>

                    <div className="mx-auto mt-4 grid grid-cols-2 rounded-md border border-slate-200 py-2.5 dark:border-slate-700">
                        <div className="border-r border-slate-200 px-4 dark:border-slate-700">
                            <span className="block text-lg font-bold text-gray-900">
                                {userProfile.lvl || 1}
                            </span>
                            <span className="text-xs text-slate-500">Level</span>
                        </div>
                        <div className="px-4">
                            <span className="block text-lg font-bold text-gray-900">
                                {userProfile.credits || 0}
                            </span>
                            <span className="text-xs text-slate-500">Credits</span>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500">
                        <MapPin className="h-4 w-4" />
                        <span>Location: {userProfile.loc ? 'Set' : 'Not set'}</span>
                    </div>
                </Card>
            </div>

            {/* Right Column: Edit Details */}
            <div className="xl:col-span-2">
                <Card title="Profile Details">
                    {msg && <div className="mb-4 rounded bg-green-100 p-2 text-green-700">{msg}</div>}

                    <div className="mb-5.5">
                        <label className="mb-2 block text-sm font-medium text-gray-900">
                            Full Name
                        </label>
                        <input
                            className="w-full rounded border border-slate-300 py-2 px-4 text-slate-100 focus:border-blue-600 focus:outline-none dark:border-slate-700 bg-slate-800 dark:text-white"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={!editing}
                        />
                    </div>

                    <div className="mb-5.5">
                        <label className="mb-2 block text-sm font-medium text-gray-900">
                            Bio
                        </label>
                        <textarea
                            className="w-full rounded border border-slate-300 py-2 px-4 text-slate-100 focus:border-blue-600 focus:outline-none dark:border-slate-700 bg-slate-800 dark:text-white"
                            rows="3"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            disabled={!editing}
                            placeholder="Tell others about yourself..."
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Skills Offered */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-900">
                                Skills I Can Teach
                            </label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {skillsOffered.map(s => (
                                    <span key={s} className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600">
                                        {s}
                                        {editing && (
                                            <button onClick={() => removeSkill('offer', s)} className="ml-1 hover:text-blue-800">
                                                <X className="h-3 w-3" />
                                            </button>
                                        )}
                                    </span>
                                ))}
                            </div>
                            {editing && (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        className="w-full rounded border border-slate-300 px-3 py-1 text-sm dark:border-slate-700 bg-slate-800"
                                        placeholder="Add skill (e.g. React)"
                                        value={newOffer}
                                        onChange={(e) => setNewOffer(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addSkill('offer')}
                                    />
                                    <button onClick={() => addSkill('offer')} className="rounded bg-blue-600 p-1 text-white hover:bg-blue-700">
                                        <Plus className="h-5 w-5" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Skills Wanted */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-900">
                                Skills I Want to Learn
                            </label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {skillsWanted.map(s => (
                                    <span key={s} className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-600">
                                        {s}
                                        {editing && (
                                            <button onClick={() => removeSkill('want', s)} className="ml-1 hover:text-green-800">
                                                <X className="h-3 w-3" />
                                            </button>
                                        )}
                                    </span>
                                ))}
                            </div>
                            {editing && (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        className="w-full rounded border border-slate-300 px-3 py-1 text-sm dark:border-slate-700 bg-slate-800"
                                        placeholder="Add skill (e.g. Guitar)"
                                        value={newWant}
                                        onChange={(e) => setNewWant(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addSkill('want')}
                                    />
                                    <button onClick={() => addSkill('want')} className="rounded bg-green-600 p-1 text-white hover:bg-green-700">
                                        <Plus className="h-5 w-5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-4">
                        {!editing ? (
                            <Btn onClick={() => setEditing(true)}>Edit Profile</Btn>
                        ) : (
                            <>
                                <Btn variant="danger" onClick={() => setEditing(false)}>Cancel</Btn>
                                <Btn variant="primary" onClick={handleSave} className="flex items-center gap-2">
                                    <Save className="h-4 w-4" /> Save
                                </Btn>
                            </>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
