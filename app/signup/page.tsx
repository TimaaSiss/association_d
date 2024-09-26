"use client";
import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation"; // Importer useRouter

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [matricule, setMatricule] = useState("");
  const [categorie, setCategorie] = useState("");
  const [ville, setVille] = useState("");
  const [pays, setPays] = useState("");

  const router = useRouter(); // Initialiser useRouter

  useEffect(() => {
    const generateMatricule = () => {
      const randomMatricule = `MAT-${Math.floor(1000 + Math.random() * 9000)}`;
      setMatricule(randomMatricule);
    };
    generateMatricule();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        role,
        nom,
        prenom,
        matricule,
        categorie,
        ville,
        pays,
      }),
    });

    if (response.ok) {
      alert("Inscription réussie !");

      if (role === "admin") {
        router.push("/signin"); // Rediriger vers la page de connexion pour les admins
      } else {
        alert("Vous pouvez maintenant vous connecter.");
      }
    } else {
      alert("Erreur lors de l’inscription. Veuillez réessayer.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Inscription</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {/* Colonne de gauche */}
          <div className="space-y-4">
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Nom"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <select
              name="categorie"
              value={categorie}
              onChange={(e) => setCategorie(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            >
              <option value="" disabled selected>
                Sélectionnez une catégorie
              </option>
              <option value="Diamond">Diamond</option>
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
              <option value="Bronze">Bronze</option>
              <option value="Other">Other</option>
            </select>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="user">Utilisateur</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {/* Colonne de droite */}
          <div className="space-y-4">
            <input
              type="text"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              placeholder="Prénom"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              value={ville}
              onChange={(e) => setVille(e.target.value)}
              placeholder="Ville"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              value={pays}
              onChange={(e) => setPays(e.target.value)}
              placeholder="Pays"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          {/* Bouton d'inscription sur une seule ligne */}
          <div className="col-span-2">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
            >
              S inscrire
            </button>
          </div>
        </form>
        {/* Message de connexion */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Vous avez déjà un compte ?{" "}
          <a href="/signin" className="text-blue-500 hover:underline">
            Connectez-vous
          </a>
        </p>
      </div>
    </div>
  );
}
