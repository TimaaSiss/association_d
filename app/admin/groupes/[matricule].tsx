import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

interface Groupe {
  matricule: number;
  nom: string;
  categorie: string;
  ville: string;
  pays: string;
}

export default function GroupeDetails() {
  const [groupe, setGroupe] = useState<Groupe | null>(null);
  const router = useRouter();
  const { matricule } = router.query;

  useEffect(() => {
    if (matricule) {
      axios.get(`/api/groupes/${matricule}`)
        .then(response => {
          setGroupe(response.data);
        })
        .catch(error => {
          console.error("Erreur lors de la récupération des du groupe:", error);
        });
    }
  }, [matricule]);

  const handleDelete = () => {
    axios.delete(`/api/groupes/${matricule}`)
      .then(() => {
        router.push("/admin/groupes");
      })
      .catch(error => {
        console.error("Erreur lors de la suppression du groupe:", error);
      });
  };

  const handleEdit = () => {
    // Redirect to the edit page (can be handled in a different manner)
    router.push(`/admin/groupes/ajouter?edit=true&matricule=${matricule}`);
  };

  if (!groupe) return <div>Chargement...</div>;

  return (
    <div>
      <h1>Détails de la Personne</h1>
      <p><strong>Matricule:</strong> {groupe.matricule}</p>
      <p><strong>Nom:</strong> {groupe.nom}</p>
      <p><strong>Catégorie:</strong> {groupe.categorie}</p>
      <p><strong>Ville:</strong> {groupe.ville}</p>
      <p><strong>Pays:</strong> {groupe.pays}</p>
      <button onClick={handleEdit}>Modifier</button>
      <button onClick={handleDelete}>Supprimer</button>
    </div>
  );
}
