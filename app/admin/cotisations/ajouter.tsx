import { useState, useEffect } from "react";
import axios from "axios";
import { Inter_Tight } from "next/font/google";

interface Cotisation {
  matricule: number;
  groupe_matricule?: number;
  personne_matricule?: number;
  type: string;
  montant: string;
  date: Date;
}

interface Groupe {
  matricule: number;
  nom: string;
  categorie: string;
  ville: string;
  pays: string;
}

interface Personne {
  matricule: number;
  nom: string;
  prenom: string;
  categorie: string;
  ville: string;
  pays: string;
}

interface AjouterCotisationProps {
  onSuccess: () => void;
  initialCotisation?: Cotisation | null;
  isEditing: boolean;
}

export default function AjouterCotisation({
  onSuccess,
  initialCotisation,
  isEditing,
}: AjouterCotisationProps) {
  const [cotisation, setCotisation] = useState<Cotisation>({
    matricule: 0,
    type: "",
    montant: "",
    groupe_matricule: undefined,
    personne_matricule: undefined,
    date: new Date(),
  });

  const [groupes, setGroupes] = useState<Groupe[]>([]);
  const [personnes, setPersonnes] = useState<Personne[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cotisation.type === "Groupe") {
      axios
        .get("/api/groupes")
        .then((response) => setGroupes(response.data))
        .catch((err) => {
          console.error("Erreur lors de la récupération des groupes:", err);
        });
    } else if (cotisation.type === "Personne") {
      axios
        .get("/api/personnes")
        .then((response) => setPersonnes(response.data))
        .catch((err) => {
          console.error("Erreur lors de la récupération des personnes:", err);
        });
    }
  }, [cotisation.type]);

  useEffect(() => {
    if (isEditing && initialCotisation) {
      setCotisation({
        ...initialCotisation,
        date: new Date(initialCotisation.date),
        personne_matricule:
          initialCotisation.type === "Personne"
            ? initialCotisation.personne_matricule
            : undefined,
        groupe_matricule:
          initialCotisation.type === "Groupe"
            ? initialCotisation.groupe_matricule
            : undefined,
      });
    }
  }, [isEditing, initialCotisation]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCotisation((prevState) => ({
      ...prevState,
      [name]:
        name === "groupe_matricule" || name === "personne_matricule"
          ? value
            ? parseInt(value, 10)
            : undefined
          : name === "date"
          ? new Date(value) // Formate correctement la date dès la saisie
          : value,
    }));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value;
    setCotisation((prevState) => ({
      ...prevState,
      type: newType,
      personne_matricule:
        newType === "Personne" ? prevState.personne_matricule || 0 : undefined,
      groupe_matricule:
        newType === "Groupe" ? prevState.groupe_matricule || 0 : undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (cotisation.type === "Groupe" && !cotisation.groupe_matricule) {
      setError("Veuillez sélectionner un groupe.");
      return;
    }

    if (cotisation.type === "Personne" && !cotisation.personne_matricule) {
      setError("Veuillez sélectionner une personne.");
      return;
    }

    const payload = {
      ...cotisation,
      groupe_matricule:
        cotisation.type === "Groupe" ? cotisation.groupe_matricule : null,
      personne_matricule:
        cotisation.type === "Personne" ? cotisation.personne_matricule : null,
    };

    const apiPath = isEditing
      ? `/api/cotisations/${initialCotisation?.matricule}`
      : "/api/cotisations";

    try {
      await axios({
        method: isEditing ? "put" : "post",
        url: apiPath,
        data: payload,
      });
      onSuccess();
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la cotisation :", error);
      setError(
        `Erreur lors de ${
          isEditing ? "la mise à jour" : "l'ajout"
        } de la cotisation.`
      );
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        {isEditing ? "Modifier la cotisation" : "Ajouter une cotisation"}
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <label className="block text-gray-700">Type</label>
            <select
              name="type" // Assurez-vous que cela correspond bien à la propriété `type`
              value={cotisation.type}
              onChange={handleTypeChange}
              className="border rounded p-2 w-full"
              required
            >
              <option value="">Sélectionnez le type de la cotisation</option>
              <option value="Groupe">Groupe</option>
              <option value="Personne">Personne</option>
            </select>
          </div>

          {cotisation.type === "Groupe" && (
            <div className="col-span-1">
              <label className="block text-gray-700">Groupe</label>
              <select
                name="groupe_matricule"
                value={cotisation.groupe_matricule || ""}
                onChange={handleChange}
                className="border rounded p-2 w-full"
                required
              >
                <option value="">Sélectionnez un groupe</option>
                {groupes.map((groupe) => (
                  <option key={groupe.matricule} value={groupe.matricule}>
                    {groupe.matricule} - {groupe.nom}
                  </option>
                ))}
              </select>
            </div>
          )}

          {cotisation.type === "Personne" && (
            <div className="col-span-1">
              <label className="block text-gray-700">Personne</label>
              <select
                name="personne_matricule"
                value={cotisation.personne_matricule || ""}
                onChange={handleChange}
                className="border rounded p-2 w-full"
                required
              >
                <option value="">Sélectionnez une personne</option>
                {personnes.map((personne) => (
                  <option key={personne.matricule} value={personne.matricule}>
                    {personne.matricule} - {personne.nom} {personne.prenom}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="col-span-1">
            <label className="block text-gray-700">Montant</label>
            <input
              type="text"
              name="montant"
              value={cotisation.montant}
              onChange={handleChange}
              className="border rounded p-2 w-full"
              placeholder="Montant"
              required
            />
          </div>

          <div className="col-span-1">
            <label className="block text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={cotisation.date.toISOString().split("T")[0]}
              onChange={handleChange}
              className="border rounded p-2 w-full"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          {isEditing ? "Modifier" : "Ajouter"}
        </button>
      </form>
    </div>
  );
}
