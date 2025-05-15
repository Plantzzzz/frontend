import React, { useState } from 'react';
import { auth, googleProvider, facebookProvider } from '../../firebase.ts';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { FaGoogle, FaFacebook } from 'react-icons/fa';

const RegisterForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const { email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError('The passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Registration successful', userCredential.user);
    } catch (err) {
      setError('Registration error: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      console.log('Google auth successful');
    } catch (err) {
      setError('Error with Google auth: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, facebookProvider);
      console.log('Facebok auth successful');
    } catch (err) {
      setError('Error with Facebook auth: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 text-black">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Registracija</h2>
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
            <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Confirm Password"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition"
            >
              {loading ? 'Loading...' : 'Register'}
            </button>
          </form>

          <div className="mt-1">
            <p className="text-center text-gray-500 text-sm mb-3">... or use social a media account</p>
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
        </div>
      </div>
  );
};

export default RegisterForm;
