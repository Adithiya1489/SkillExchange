import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Btn from '../components/Btn';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { signup, googleLogin } = useAuth();
    const navigate = useNavigate();

    async function handleSignup(e) {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // 1. Create user
            const userCred = await signup(email, password, name);

            // 2. Get location (if allowed)
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        // We would update the user doc here with location
                        // But for now, we'll just let them proceed, 
                        // location can be updated on Dashboard/Profile load
                        console.log("Loc:", position.coords);
                    },
                    (err) => console.log("Loc denied:", err)
                );
            }

            navigate('/');
        } catch (err) {
            setError('Failed to create account. ' + err.message);
            console.error(err);
        }
        setLoading(false);
    }

    return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-card border border-gray-100">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Create Account</h2>
                    <p className="text-gray-500 mt-2">Join SkillExchange today</p>
                </div>

                {error && <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-100">{error}</div>}

                <form onSubmit={handleSignup} className="space-y-5">
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">Full Name</label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            className="w-full rounded-xl border border-gray-200 bg-white py-3.5 px-4 text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">Email Address</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            className="w-full rounded-xl border border-gray-200 bg-white py-3.5 px-4 text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">Password</label>
                        <input
                            type="password"
                            placeholder="Create password"
                            className="w-full rounded-xl border border-gray-200 bg-white py-3.5 px-4 text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <Btn type="submit" variant="primary" className="w-full py-3.5 shadow-lg shadow-primary-500/20" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </Btn>
                </form>

                <p className="mt-8 text-center text-gray-500">
                    Already have an account? <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
