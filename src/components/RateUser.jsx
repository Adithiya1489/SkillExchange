import { useState } from 'react';
import { db } from '../firebase';
import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import Btn from './Btn';
import { Star, X } from 'lucide-react';

export default function RateUser({ session, targetUserId, onClose }) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit() {
        if (rating === 0) return alert("Please select a rating");
        setSubmitting(true);

        try {
            // 1. Update Target User (Credits + Rating)
            if (!targetUserId) {
                console.error("No target user ID to rate");
                alert("Error: Could not identify user to rate.");
                setSubmitting(false);
                return;
            }

            const userRef = doc(db, "users", targetUserId);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const data = userSnap.data();
                const currentRate = data.rate || 5;
                const currentCount = data.ratingCount || 0;

                // Calculate new average
                const newRate = ((currentRate * currentCount) + rating) / (currentCount + 1);

                await updateDoc(userRef, {
                    rate: parseFloat(newRate.toFixed(1)),
                    ratingCount: increment(1),
                    credits: increment(1), // Earn 1 credit per completed session
                });
            }

            // 2. Mark session as completed
            if (session && session.id) {
                const sessionRef = doc(db, "sessions", session.id);
                await updateDoc(sessionRef, {
                    status: 'completed',
                    completedAt: new Date()
                });
            }

            alert("Rating submitted! +1 Credit to your partner.");

            // Reload page to reflect changes (simple way)
            window.location.reload();

        } catch (err) {
            console.error("submit err:", err);
            alert("Failed to submit rating");
        }
        setSubmitting(false);
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl max-w-sm w-full p-6 relative shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                >
                    <X className="h-5 w-5" />
                </button>

                <h3 className="text-xl font-bold text-center mb-2 text-gray-900">Rate Session</h3>
                <p className="text-center text-slate-500 mb-6 text-sm">
                    How was your experience?
                </p>

                <div className="flex justify-center gap-2 mb-8">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            className="transition-transform hover:scale-110 focus:outline-none"
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            onClick={() => setRating(star)}
                        >
                            <Star
                                className={`h-8 w-8 ${star <= (hover || rating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-slate-300 dark:text-slate-600"
                                    }`}
                            />
                        </button>
                    ))}
                </div>

                <Btn
                    onClick={handleSubmit}
                    className="w-full"
                    disabled={submitting}
                >
                    {submitting ? "Submitting..." : "Submit Rating"}
                </Btn>
            </div>
        </div>
    );
}
