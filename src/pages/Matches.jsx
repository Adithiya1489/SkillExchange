import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { findMatches } from '../utils/match';
import { getDist, formatDist } from '../utils/dist';
import Card from '../components/Card';
import Btn from '../components/Btn';
import { MapPin, Wifi, Users } from 'lucide-react';

export default function Matches() {
    const { userProfile, currentUser } = useAuth();
    const [matches, setMatches] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMatches() {
            if (!userProfile) return;

            try {
                const querySnapshot = await getDocs(collection(db, "users"));
                const users = [];
                querySnapshot.forEach((doc) => {
                    // Exclude current user
                    if (doc.id !== currentUser.uid) {
                        users.push({ id: doc.id, ...doc.data() });
                    }
                });
                setAllUsers(users);

                const found = findMatches({ id: currentUser.uid, ...userProfile }, users);
                setMatches(found);
            } catch (err) {
                console.error("Error fetching matches:", err);
            }
            setLoading(false);
        }

        fetchMatches();
    }, [userProfile, currentUser]);

    async function handleConnect(matchUser) {
        if (!userProfile) return;

        try {
            // Determine skill: user offers matchUser.skillsWanted? OR matchUser offers user.skillsWanted?
            // Simple logic: pick the first skill matchUser offers that user wants
            const skill = matchUser.skillsOffered?.find(s => userProfile.skillsWanted?.includes(s))
                || matchUser.skillsWanted?.find(s => userProfile.skillsOffered?.includes(s))
                || matchUser.skillsOffered?.[0] // Fallback to first skill they offer
                || "General Exchange";

            await addDoc(collection(db, "sessions"), {
                tId: matchUser.id, // The other person is teacher (simplification)
                sId: currentUser.uid,
                tName: matchUser.name,
                sName: userProfile.name,
                skill: skill,
                mode: "online",
                status: "pending",
                createdAt: new Date(),
                otherName: matchUser.name // Helper for list view
            });

            alert(`Connect request sent to ${matchUser.name}! Check 'My Sessions'.`);
        } catch (err) {
            console.error("Error creating session:", err);
            alert("Failed to connect.");
        }
    }

    if (loading) return <div className="p-4 text-center">Finding matches...</div>;

    // Decide what to show: Matches or Everyone (fallback)
    const displayUsers = matches.length > 0 ? matches : allUsers;
    const isFallback = matches.length === 0 && allUsers.length > 0;

    return (
        <div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">
                {matches.length > 0 ? `Found ${matches.length} Matches` : `Explore Community (${displayUsers.length})`}
            </h2>
            {isFallback && (
                <p className="mb-6 text-slate-500">
                    No strict mutual matches found. Here are other people you can connect with!
                </p>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {displayUsers.map((m) => {
                    let dist = 0;
                    let mode = "Online Only";

                    // Simple logic to show what they offer matches what I want
                    const isMatch = matches.some(match => match.id === m.id);

                    // Calculate distance if locations exist
                    /* 
                    if (userProfile.loc && m.loc) {
                        dist = getDist(userProfile.loc.lat, userProfile.loc.lng, m.loc.lat, m.loc.lng);
                        if (dist < 10) mode = "Offline Available";
                    }
                    */

                    return (
                        <Card key={m.id} className={`relative overflow-hidden ${isMatch ? 'ring-2 ring-blue-500' : ''}`}>
                            {isMatch && (
                                <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-bl-lg font-bold">
                                    MATCH
                                </div>
                            )}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-14 w-14 rounded-full bg-slate-200 flex items-center justify-center text-xl font-bold text-slate-500">
                                        {m.name?.[0]}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900">{m.name}</h3>
                                        <p className="text-sm text-slate-500">Lvl {m.lvl || 1} • {m.rate || 5}★</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4 space-y-2">
                                <div className="text-sm">
                                    <span className="font-semibold text-blue-600">Can Teach: </span>
                                    {m.skillsOffered?.join(', ')}
                                </div>
                                <div className="text-sm">
                                    <span className="font-semibold text-green-600">Wants: </span>
                                    {m.skillsWanted?.join(', ')}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-xs text-slate-500 mb-6">
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {dist > 0 ? formatDist(dist) : 'Online'}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Wifi className="h-3 w-3" />
                                    {mode}
                                </div>
                            </div>

                            <Btn onClick={() => handleConnect(m)} className="w-full">
                                Connect
                            </Btn>
                        </Card>
                    );
                })}
                {displayUsers.length === 0 && (
                    <div className="col-span-full text-center py-10 text-slate-500">
                        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No matches found yet. update your skills profile!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
