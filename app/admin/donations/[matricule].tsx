import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

interface Donation {
  matricule: number;
  type: string;
  montant: string;
  date: Date;

}

export default function DonationDetails() {
  const [donation, setDonation] = useState<Donation | null>(null);
  const router = useRouter();
  const { matricule } = router.query;

  useEffect(() => {
    if (matricule) {
      axios.get(`/api/donations/${matricule}`)
        .then(response => {
          setDonation(response.data);
        })
        .catch(error => {
          console.error("Erreur lors de la récupération des détails de la donation:", error);
        });
    }
  }, [matricule]);

  const handleDelete = () => {
    axios.delete(`/api/donations/${matricule}`)
      .then(() => {
        router.push("/admin/donations");
      })
      .catch(error => {
        console.error("Erreur lors de la suppression de la donation:", error);
      });
  };

  const handleEdit = () => {
    // Redirect to the edit page (can be handled in a different manner)
    router.push(`/admin/donations/ajouter?edit=true&matricule=${matricule}`);
  };

  if (!donation) return <div>Chargement...</div>;

  return (
    <div>
      <h1>Détails de la donation</h1>
      <p><strong>Matricule:</strong> {donation.matricule}</p>
      <p><strong>Type:</strong> {donation.type}</p>
      <p><strong>Montant:</strong> {donation.montant}</p>
      <p><strong>Date:</strong> {donation.date ? new Date(donation.date).toLocaleDateString('fr-FR') : ''}</p>
      <button onClick={handleEdit}>Modifier</button>
      <button onClick={handleDelete}>Supprimer</button>
    </div>
  );
}
