"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState, FormEvent } from "react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false, // Pas de redirection immédiate ici
    });

    if (res?.ok) {
      // Récupérer la session pour vérifier le rôle et rediriger
      const response = await fetch("/api/auth/session");
      const session = await response.json();

      // Vérifie si l'utilisateur a le rôle d'admin
      if (session?.user?.role === "admin") {
        window.location.href = "/"; // Redirection vers la page admin (page.tsx)
      } else {
        window.location.href = "/signup"; // Redirige vers la page utilisateur si nécessaire
      }
    } else {
      console.error("Erreur de connexion :", res?.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="absolute top-4 right-4">
        <Link href="/personnes" className="text-blue-500 hover:underline">
          Liste les donateurs
        </Link>
      </div>
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Se connecter</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Entrez votre email"
              required
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entrez votre mot de passe"
              required
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Se connecter
            </button>
          </div>
        </form>
        {/*  <p className="mt-4 text-center text-sm text-gray-600">
          Vous ne possédez pas de compte ?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Inscrivez-vous
          </a>
        </p> */}
      </div>
    </div>
  );
}
