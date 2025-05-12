import React, { useState } from "react";
import "../styles/RegisterForm.css";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase.ts"; // popravi pot glede na strukturo
import { serverTimestamp } from 'firebase/firestore';
type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setError("");

    const { email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError("Gesli se ne ujemata.");
      return;
    }

    try {
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // Shrani uporabnika v Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: serverTimestamp(),
      });

      console.log("Registracija uspešna:", user.email);
    } catch (err) {
      setError("Napaka pri registraciji: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <h2>Registracija</h2>

      <input
        type="email"
        name="email"
        placeholder="E-pošta"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Geslo"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <input
        type="password"
        name="confirmPassword"
        placeholder="Potrdi geslo"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
      />

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Registriram..." : "Registriraj se"}
      </button>
    </form>
  );
};

export default RegisterForm;
