// Code ajusté
import { useState, useEffect } from "react";
import axios from "axios";

interface Donation {
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

interface AjouterDonationProps {
  onSuccess: () => void;
  initialDonation?: Donation | null;
  isEditing: boolean;
}

export default function AjouterDonation({
  onSuccess,
  initialDonation,
  isEditing,
}: AjouterDonationProps) {
  const [donation, setDonation] = useState<Donation>({
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
    if (donation.type === "Groupe") {
      axios
        .get("/api/groupes")
        .then((response) => setGroupes(response.data))
        .catch((err) => {
          console.error("Erreur lors de la récupération des groupes:", err);
        });
    } else if (donation.type === "Personne") {
      axios
        .get("/api/personnes")
        .then((response) => setPersonnes(response.data))
        .catch((err) => {
          console.error("Erreur lors de la récupération des personnes:", err);
        });
    }
  }, [donation.type]);

  useEffect(() => {
    if (isEditing && initialDonation) {
      setDonation({
        ...initialDonation,
        date: new Date(initialDonation.date),
        personne_matricule:
          initialDonation.type === "Personne"
            ? initialDonation.personne_matricule
            : undefined,
        groupe_matricule:
          initialDonation.type === "Groupe"
            ? initialDonation.groupe_matricule
            : undefined,
      });
    }
  }, [isEditing, initialDonation]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDonation((prevState) => ({
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
    setDonation((prevState) => ({
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

    if (donation.type === "Groupe" && !donation.groupe_matricule) {
      setError("Veuillez sélectionner un groupe.");
      return;
    }

    if (donation.type === "Personne" && !donation.personne_matricule) {
      setError("Veuillez sélectionner une personne.");
      return;
    }

    const payload = {
      ...donation,
      groupe_matricule:
        donation.type === "Groupe" ? donation.groupe_matricule : null,
      personne_matricule:
        donation.type === "Personne" ? donation.personne_matricule : null,
    };

    const apiPath = isEditing
      ? `/api/donations/${initialDonation?.matricule}`
      : "/api/donations";

    try {
      await axios({
        method: isEditing ? "put" : "post",
        url: apiPath,
        data: payload,
      });
      onSuccess();
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la donation :", error);
      setError(
        `Erreur lors de ${
          isEditing ? "la mise à jour" : "l'ajout"
        } de la donation.`
      );
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 flex justify-center">
        {isEditing ? "Modifier une donation" : "Ajouter une donation"}
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <label className="block text-gray-700">Type</label>
            <select
              name="type"
              value={donation.type}
              onChange={handleTypeChange}
              className="border rounded p-2 w-full"
              required
            >
              <option value="">Sélectionnez un type</option>
              <option value="Groupe">Groupe</option>
              <option value="Personne">Personne</option>
            </select>
          </div>

          {donation.type === "Groupe" && (
            <div className="col-span-1">
              <label className="block text-gray-700">Groupe</label>
              <select
                name="groupe_matricule"
                value={donation.groupe_matricule || ""}
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

          {donation.type === "Personne" && (
            <div className="col-span-1">
              <label className="block text-gray-700">Personne</label>
              <select
                name="personne_matricule"
                value={donation.personne_matricule || ""}
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
              value={donation.montant}
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
              value={donation.date.toISOString().split("T")[0]}
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
