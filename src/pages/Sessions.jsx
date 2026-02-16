import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import Card from '../components/Card';
import Btn from '../components/Btn';
import { Link } from 'react-router-dom';
import { Video, Calendar, Clock, CheckCircle } from 'lucide-react';

export default function Sessions() {
    const { currentUser } = useAuth();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSessions() {
            if (!currentUser) return;

            try {
                // Fetch sessions where user is teacher or student
                // Note: In real app, might need composite index or separate queries
                const q1 = query(collection(db, "sessions"), where("tId", "==", currentUser.uid));
                const q2 = query(collection(db, "sessions"), where("sId", "==", currentUser.uid));

                const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);

                const list = [];
                snap1.forEach(d => list.push({ id: d.id, ...d.data(), role: 'teacher' }));
                snap2.forEach(d => list.push({ id: d.id, ...d.data(), role: 'student' }));

                // Sort by date manually since we merged results
                list.sort((a, b) => b.createdAt - a.createdAt);

                setSessions(list);
            } catch (err) {
                console.error("Error fetching sessions:", err);
            }
            setLoading(false);
        }

        fetchSessions();
    }, [currentUser]);

    if (loading) return <div className="p-4 text-center">Loading sessions...</div>;

    return (
        <div>
            <h2 className="mb-6 text-2xl font-bold text-gray-900">My Sessions</h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {sessions.length === 0 && (
                    <div className="col-span-full text-center text-slate-500 py-10">
                        No active sessions. Go find a match!
                    </div>
                )}

                {sessions.map(ses => (
                    <Card key={ses.id} className="relative bg-white hover:bg-gray-50 border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900">{ses.skill}</h3>
                                <p className="text-sm text-slate-500">
                                    with {ses.role === 'teacher' ? 'Student' : 'Teacher'} ({ses.otherName || 'Partner'})
                                </p>
                            </div>
                            <div className={`px-2 py-1 rounded text-xs font-semibold 
                    ${ses.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {ses.status.toUpperCase()}
                            </div>
                        </div>

                        <div className="space-y-2 mb-6 text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>{ses.time || 'Time not set'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Video className="h-4 w-4" />
                                <span>{ses.mode}</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Link to={`/session/${ses.id}`} className="w-full">
                                <Btn variant="primary" className="w-full">
                                    Open Room
                                </Btn>
                            </Link>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
