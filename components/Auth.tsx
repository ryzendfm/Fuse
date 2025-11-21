import { useState, FC, FormEvent } from 'react';
import { supabase } from '../services/supabaseClient';

const Auth: FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleAuth = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                setMessage('Registration successful! Please check your email to verify your account.');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0e0e10] relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/c38a2d52-138e-48a3-ab68-36787ece46b3/eeb03fc9-99bf-4734-9593-82eb485611b4/IN-en-20240101-popsignuptwoweeks-perspective_alpha_website_large.jpg')] bg-cover bg-center opacity-30 blur-sm"></div>
            <div className="absolute inset-0 bg-black/60"></div>

            <div className="relative z-10 w-full max-w-md p-8 md:bg-black/70 md:backdrop-blur-md border-0 md:border md:border-white/10 rounded-2xl md:shadow-2xl animate-fade-in">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-extrabold text-white tracking-tighter mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>fuse</h1>
                    <p className="text-gray-400 text-sm">Premium Streaming Dashboard</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-200 text-xs text-center">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded text-green-200 text-xs text-center">
                        {message}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1 uppercase tracking-wider">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#1f1f22] border border-[#333] text-white text-sm rounded-lg focus:ring-[#46d369] focus:border-[#46d369] block p-3 placeholder-gray-500"
                            placeholder="name@company.com"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1 uppercase tracking-wider">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#1f1f22] border border-[#333] text-white text-sm rounded-lg focus:ring-[#46d369] focus:border-[#46d369] block p-3 placeholder-gray-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full text-white bg-[#46d369] hover:bg-[#3cb35a] focus:ring-4 focus:outline-none focus:ring-green-800 font-bold rounded-lg text-sm px-5 py-3 text-center transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Processing...
                            </div>
                        ) : (
                            isSignUp ? 'Create Account' : 'Sign In'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-400">
                        {isSignUp ? "Already have an account?" : "New to Fuse?"}{" "}
                        <button
                            onClick={() => {
                                setIsSignUp(!isSignUp);
                                setError(null);
                                setMessage(null);
                            }}
                            className="text-white font-bold hover:underline"
                        >
                            {isSignUp ? "Sign In" : "Sign Up"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth;