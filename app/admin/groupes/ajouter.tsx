import { useState, useEffect } from "react";
import axios from "axios";

interface Groupe {
  matricule: number; // Assurez-vous que c'est un nombre
  nom: string;
  categorie: string;
  ville: string;
  pays: string;
}

interface AjouterGroupeProps {
  onSuccess: () => void;
  initialGroupe?: Groupe | null; // Pour l'édition
  isEditing: boolean; // Pour savoir si on est en mode édition
}

export default function AjouterGroupe({ onSuccess, initialGroupe, isEditing }: AjouterGroupeProps) {
  const [groupe, setGroupe] = useState<Groupe>({
    matricule: 0, // Initialiser avec 0 ou une autre valeur par défaut
    nom: "",
    categorie: "Other",
    ville: "",
    pays: "",
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing && initialGroupe) {
      setGroupe(initialGroupe);
    }
  }, [isEditing, initialGroupe]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGroupe((prevState) => ({
      ...prevState,
      [name]: name === 'matricule' ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    console.log(groupe);
    if (isEditing && initialGroupe) {
      // Mettre à jour la personne existante
      axios
        .put(`/api/groupes/${initialGroupe.matricule}`, groupe)
        .then(() => {
          onSuccess(); // Appeler la fonction de succès
        })
        .catch((error) => {
          setError("Erreur lors de la mise à jour du groupe.");
          console.error(error);
        });
    } else {
      // Ajouter une nouvelle personne
      axios
        .post("/api/groupes", groupe)
        .then(() => {
          onSuccess(); // Appeler la fonction de succès
        })
        .catch((error) => {
          setError("Erreur lors de l'ajout du groupe.");
          console.error(error);
        });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 flex justify-center">
        {isEditing ? "Modifier un groupe" : "Ajouter un groupe"}
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <label className="block text-gray-700">Nom</label>
            <input
              type="text"
              name="nom"
              value={groupe.nom}
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
              value={groupe.ville}
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
              value={groupe.pays}
              onChange={handleChange}
              className="border rounded p-2 w-full"
              required
            />
          </div>
          <div className="col-span-1">
            <label className="block text-gray-700">Catégorie</label>
            <select
              name="categorie"
              value={groupe.categorie}
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
