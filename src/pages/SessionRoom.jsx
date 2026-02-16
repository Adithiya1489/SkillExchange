import { useState, useEffect } from 'react';
import RateUser from '../components/RateUser';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';

import { doc, getDoc } from 'firebase/firestore';
import Chat from '../components/Chat';
import FileVault from '../components/FileVault';
import Card from '../components/Card';
import Btn from '../components/Btn';
import { Video, Share2 } from 'lucide-react';

export default function SessionRoom() {
    const { sessionId } = useParams();
    const { currentUser } = useAuth();

    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showRating, setShowRating] = useState(false);

    useEffect(() => {
        async function fetchSession() {
            if (!sessionId) return;
            const docRef = doc(db, "sessions", sessionId);
            const snap = await getDoc(docRef);
            if (snap.exists()) {
                setSession({ id: snap.id, ...snap.data() });
            }
            setLoading(false);
        }
        fetchSession();
    }, [sessionId]);

    if (loading) return <div className="p-6 text-center">Loading Session...</div>;
    if (!session) return <div className="p-6 text-center">Session not found</div>;

    const jitsiLink = `https://meet.jit.si/skill-ses-${sessionId}`;
    const isTeacher = currentUser.uid === session.tId;
    const targetUserId = isTeacher ? session.sId : session.tId;

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Main Content: Video/Details */}
            <div className="lg:col-span-2 space-y-6">
                <Card title={`${session.skill} Session`}>
                    <div className="flex flex-col gap-4">
                        <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-lg text-center">
                            <Video className="h-12 w-12 mx-auto mb-3 text-blue-600" />
                            <h3 className="text-xl font-bold mb-2 text-gray-900">Video Room</h3>
                            <p className="text-slate-500 mb-6">
                                Click below to join the video call for this session.
                            </p>
                            <div className="flex justify-center gap-4">
                                <a href={jitsiLink} target="_blank" rel="noopener noreferrer">
                                    <Btn variant="primary" className="flex items-center gap-2">
                                        Join Jitsi Call <Share2 className="h-4 w-4" />
                                    </Btn>
                                </a>
                                {session.status !== 'completed' && (
                                    <Btn
                                        variant="outline"
                                        onClick={() => setShowRating(true)}
                                        className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                                    >
                                        Mark Completed
                                    </Btn>
                                )}
                            </div>
                        </div>

                        {/* File Vault */}
                        <div className="h-64">
                            <FileVault
                                sessionId={sessionId}
                                isTeacher={isTeacher}
                            />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Right Sidebar: Chat */}
            <div className="lg:col-span-1">
                <Chat sessionId={sessionId} currentUser={currentUser} />
            </div>

            {/* Rating Modal */}
            {showRating && (
                <RateUser
                    session={session}
                    targetUserId={targetUserId}
                    onClose={() => setShowRating(false)}
                />
            )}
        </div>
    );
}
