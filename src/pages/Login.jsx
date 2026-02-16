import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Btn from '../components/Btn';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, googleLogin } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    async function handleLogin(e) {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError('Failed to log in. Check credentials.');
            console.error(err);
        }
    }

    async function handleGoogleLogin() {
        try {
            await googleLogin();
            navigate('/');
        } catch (err) {
            setError('Failed to log in with Google.');
            console.error(err);
        }
    }

    return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-card border border-gray-100">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome Back</h2>
                    <p className="text-gray-500 mt-2">Sign in to continue to SkillExchange</p>
                </div>

                {error && <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-100">{error}</div>}

                <form onSubmit={handleLogin} className="space-y-6">
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
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-semibold text-gray-700">Password</label>
                            <Link to="#" className="text-sm font-medium text-primary-600 hover:text-primary-700">Forgot password?</Link>
                        </div>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full rounded-xl border border-gray-200 bg-white py-3.5 px-4 text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <Btn type="submit" variant="primary" className="w-full py-3.5 shadow-lg shadow-primary-500/20">Sign In</Btn>
                </form>

                <div className="my-8 flex items-center justify-center gap-4">
                    <span className="h-px w-full bg-gray-200"></span>
                    <span className="text-sm text-gray-400 font-medium">OR</span>
                    <span className="h-px w-full bg-gray-200"></span>
                </div>

                <Btn onClick={handleGoogleLogin} variant="outline" className="w-full py-3.5">
                    <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Sign in with Google
                </Btn>

                <p className="mt-8 text-center text-gray-500">
                    Don't have an account? <Link to="/signup" className="font-semibold text-primary-600 hover:text-primary-700">Create account</Link>
                </p>
            </div>
        </div>
    );
}
