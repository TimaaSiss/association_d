import { useState, useEffect } from "react";
import axios from "axios";

type Role = "user" | "admin";

interface Personne {
  matricule: number; // Assurez-vous que c'est un nombre
  nom: string;
  prenom: string;
  categorie: string;
  ville: string;
  pays: string;
  email: string;
  password: string;
  role: Role;
}

interface AjouterPersonneProps {
  onSuccess: () => void;
  initialPersonne?: Personne | null; // Pour l'édition
  isEditing: boolean; // Pour savoir si on est en mode édition
}

export default function AjouterPersonne({
  onSuccess,
  initialPersonne,
  isEditing,
}: AjouterPersonneProps) {
  const [personne, setPersonne] = useState<Personne>({
    matricule: 0, // Initialiser avec 0 ou une autre valeur par défaut
    nom: "",
    prenom: "",
    categorie: "Other",
    ville: "",
    pays: "",
    email: "",
    password: "",
    role: "user",
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing && initialPersonne) {
      setPersonne(initialPersonne);
    }
  }, [isEditing, initialPersonne]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPersonne((prevState) => ({
      ...prevState,
      [name]: name === "matricule" ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    console.log(personne);
    if (isEditing && initialPersonne) {
      // Mettre à jour la personne existante
      axios
        .put(`/api/personnes/${initialPersonne.matricule}`, personne)
        .then(() => {
          onSuccess(); // Appeler la fonction de succès
        })
        .catch((error) => {
          setError("Erreur lors de la mise à jour de la personne.");
          console.error(error);
        });
    } else {
      // Ajouter une nouvelle personne
      axios
        .post("/api/personnes", personne)
        .then(() => {
          onSuccess(); // Appeler la fonction de succès
        })
        .catch((error) => {
          setError("Erreur lors de l'ajout de la personne.");
          console.error(error);
        });
    }
  };

  return (
    <div>
      <h2
        className="text-2xl font-bold mb-4 flex justify-center
      "
      >
        {isEditing ? "Modifier une personne" : "Ajouter une personne"}
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <label className="block text-gray-700">Nom</label>
            <input
              type="text"
              name="nom"
              value={personne.nom}
              onChange={handleChange}
              className="border rounded p-2 w-full"
              required
            />
          </div>
          <div className="col-span-1">
            <label className="block text-gray-700">Prénom</label>
            <input
              type="text"
              name="prenom"
              value={personne.prenom}
              onChange={handleChange}
              className="border rounded p-2 w-full"
              required
            />
          </div>
          <div className="col-span-1">
            <label className="block text-gray-700">Ville</label>
            <input
              type="text"
              name="ville"
              value={personne.ville}
              onChange={handleChange}
              className="border rounded p-2 w-full"
              required
            />
          </div>
          <div className="col-span-1">
            <label className="block text-gray-700">Pays</label>
            <input
              type="text"
              name="pays"
              value={personne.pays}
              onChange={handleChange}
              className="border rounded p-2 w-full"
              required
            />
          </div>
          <div className="col-span-1">
            <label className="block text-gray-700">Catégorie</label>
            <select
              name="categorie"
              value={personne.categorie}
              onChange={handleChange}
              className="border rounded p-2 w-full"
              required
            >
              <option value="Diamond">Diamond</option>
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
              <option value="Bronze">Bronze</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <button
            type="submit"
            className="mb-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition flex items-center justify-center"
          >
            {isEditing ? "Modifier" : "Ajouter"}
          </button>
        </div>
      </form>
    </div>
  );
}
