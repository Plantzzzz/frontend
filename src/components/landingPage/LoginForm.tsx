import React, { useState } from 'react';
import { auth, facebookProvider } from '../../firebase.ts';
import { signInWithEmailAndPassword, signInWithPopup, getAuth, GoogleAuthProvider} from 'firebase/auth';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import {Link, useLocation, useNavigate} from 'react-router-dom';

export const LoginForm = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [token, setToken] = useState<string | null>(null);

    const from = (location.state as any)?.from?.pathname || '/dashboard';

    const handleSuccess = (user: any) => {
        const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified,
        };
        console.log("Saving user to session:", userData);
        sessionStorage.setItem('user', JSON.stringify(userData));
        navigate(from, { replace: true });
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        try {
            setLoading(true);
            const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
            console.log('Login successful' + userCredential.user.emailVerified);
            handleSuccess(userCredential.user);
        } catch (err) {
            setError('Login error: ' + (err as Error).message);
        } finally {
            setLoading(false);
        }
    };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/calendar");
    const auth = getAuth();

    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken;
      if (accessToken) {
        sessionStorage.setItem("calendarToken", accessToken);
        setToken(accessToken);
        console.log("Google Calendar Access Token:", accessToken);
      }
        handleSuccess(result.user);
    } catch (error) {
      console.error("Google login error", error);
    }
  };

    const handleFacebookLogin = async () => {
        try {
            setLoading(true);
            const result = await signInWithPopup(auth, facebookProvider);
            console.log('Facebook login successful');
            handleSuccess(result.user);
        } catch (err) {
            setError('Facebook login error: ' + (err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 text-black">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Email"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                    <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Password"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition"
                    >
                        {loading ? 'Loading...' : 'Login'}
                    </button>
                </form>

                <div className="mt-1">
                    <p className="text-center text-gray-500 text-sm mb-3">... or use a social media account</p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                        >
                            <FaGoogle /> Google
                        </button>
                        <button
                            onClick={handleFacebookLogin}
                            disabled={loading}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                        >
                            <FaFacebook /> Facebook
                        </button>
                    </div>
                </div>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-green-600 hover:underline">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};
