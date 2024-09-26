import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

interface Cotisation {
  matricule: number;
  type: string;
  montant: string;
  date: Date;

}

export default function CotisationDetails() {
  const [cotisation, setCotisation] = useState<Cotisation | null>(null);
  const router = useRouter();
  const { matricule } = router.query;

  useEffect(() => {
    if (matricule) {
      axios.get(`/api/cotisations/${matricule}`)
        .then(response => {
          setCotisation(response.data);
        })
        .catch(error => {
          console.error("Erreur lors de la récupération des détails de la cotisation:", error);
        });
    }
  }, [matricule]);

  const handleDelete = () => {
    axios.delete(`/api/cotisations/${matricule}`)
      .then(() => {
        router.push("/admin/cotisations");
      })
      .catch(error => {
        console.error("Erreur lors de la suppression de la donation:", error);
      });
  };

  const handleEdit = () => {
    // Redirect to the edit page (can be handled in a different manner)
    router.push(`/admin/cotisations/ajouter?edit=true&matricule=${matricule}`);
  };

  if (!cotisation) return <div>Chargement...</div>;

  return (
    <div>
      <h1>Détails de la cotisation</h1>
      <p><strong>Matricule:</strong> {cotisation.matricule}</p>
      <p><strong>Type:</strong> {cotisation.type}</p>
      <p><strong>Montant:</strong> {cotisation.montant}</p>
      <p><strong>Date:</strong> {cotisation.date ? new Date(cotisation.date).toLocaleDateString('fr-FR') : ''}</p>
      <button onClick={handleEdit}>Modifier</button>
      <button onClick={handleDelete}>Supprimer</button>
    </div>
  );
}
