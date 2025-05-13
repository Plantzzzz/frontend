import React, { useState } from 'react';
import { auth, googleProvider, facebookProvider } from '../../firebase.ts';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { FaGoogle, FaFacebook } from 'react-icons/fa'; // Uporabi ikone
import '../../styles/RegisterForm.css';

const RegisterForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const { email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError('Gesli se ne ujemata.');
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Registracija uspešna:', userCredential.user);
    } catch (err) {
      setError('Napaka pri registraciji: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Prijava z Google
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      console.log('Google prijava uspešna');
    } catch (err) {
      setError('Napaka pri prijavi z Google: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Prijava z Facebook
  const handleFacebookLogin = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, facebookProvider);
      console.log('Facebook prijava uspešna');
    } catch (err) {
      setError('Napaka pri prijavi z Facebook: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-form">
      <h2>Registracija</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          placeholder="Geslo"
          required
        />
        <input
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          placeholder="Potrdi geslo"
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          Registriraj se
        </button>
      </form>
      <div className="social-buttons">
        <button className="google-btn" onClick={handleGoogleLogin} disabled={loading}>
          <FaGoogle size={20} />
          Google
        </button>
        <button className="facebook-btn" onClick={handleFacebookLogin} disabled={loading}>
          <FaFacebook size={20} />
          Facebook
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
