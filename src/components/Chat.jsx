import { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { Send } from 'lucide-react';

export default function Chat({ sessionId, currentUser }) {
    const [msgs, setMsgs] = useState([]);
    const [text, setText] = useState('');
    const bottomRef = useRef(null);

    useEffect(() => {
        if (!sessionId) return;

        const q = query(
            collection(db, "sessions", sessionId, "msgs"),
            orderBy("createdAt", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = [];
            snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
            setMsgs(list);
            // Scroll to bottom
            setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        });

        return unsubscribe;
    }, [sessionId]);

    async function sendMsg(e) {
        e.preventDefault();
        if (!text.trim()) return;

        try {
            await addDoc(collection(db, "sessions", sessionId, "msgs"), {
                text: text.trim(),
                by: currentUser.uid,
                name: currentUser.displayName || 'User',
                createdAt: serverTimestamp()
            });
            setText('');
        } catch (err) {
            console.error("Msg send failed:", err);
        }
    }

    return (
        <div className="flex flex-col h-[500px] border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-t-lg">
                <h3 className="font-bold text-gray-900">Session Chat</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {msgs.map(m => {
                    const isMe = m.by === currentUser.uid;
                    return (
                        <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${isMe ? 'bg-blue-600 text-white' : 'bg-slate-100 text-gray-900'
                                }`}>
                                {!isMe && <div className="text-xs opacity-70 mb-1">{m.name}</div>}
                                {m.text}
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef}></div>
            </div>

            <form onSubmit={sendMsg} className="p-3 border-t border-slate-200 dark:border-slate-700 flex gap-2">
                <input
                    type="text"
                    className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-600 bg-white text-gray-900"
                    placeholder="Type a message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <button type="submit" className="rounded-md bg-blue-600 p-2 text-white hover:bg-blue-700">
                    <Send className="h-5 w-5" />
                </button>
            </form>
        </div>
    );
}
