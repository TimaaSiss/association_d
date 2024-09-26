"use client";

import { useParams } from "next/navigation"; // Importez useParams depuis next/navigation
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../loading"; // Assurez-vous que le chemin est correct

interface Donation {
  matricule: number;
  montant: string;
  date: string;
}

interface Cotisation {
  matricule: number;
  montant: string;
  date: string;
}

interface Personne {
  matricule: number;
  nom: string;
  prenom: string;
  categorie: string;
  ville: string;
  pays: string;
}

export default function Detail() {
  const { matricule } = useParams(); // Utilisez useParams pour obtenir les paramètres de la route
  const [personne, setPersonne] = useState<Personne | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [cotisations, setCotisations] = useState<Cotisation[]>([]);
  const [showDonations, setShowDonations] = useState(false);
  const [showCotisations, setShowCotisations] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (matricule) {
      setDonations([]);
      setCotisations([]);
      setPersonne(null);
      setError(null);
      setIsLoading(true);

      setIsLoading(true);
      const matriculeStr = matricule as string;

      // Vérifier que le matricule est bien passé dans l'URL
      console.log("Matricule utilisé pour l'API:", matriculeStr);

      // Fetch details of the person
      axios
        .get(`/api/personnes/${matriculeStr}`)
        .then((response) => {
          setPersonne(response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          setError(
            "Erreur lors de la récupération des détails de la personne."
          );
          setIsLoading(false);
          console.error("Erreur :", error);
        });

      // Fetch donations de la personne
      axios
        .get(`/api/donations?personne_matricule=${matriculeStr}`)
        .then((response) => {
          setDonations(response.data);
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la récupération des donations :",
            error
          );
        });

      // Fetch cotisations de la personne
      axios
        .get(`/api/cotisations?personne_matricule=${matriculeStr}`)
        .then((response) => {
          setCotisations(response.data);
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la récupération des cotisations :",
            error
          );
        });
    }
  }, [matricule]);

  if (isLoading) return <Loading />;
  if (error)
    return <div className="text-red-500 text-center mt-4">{error}</div>;

  const totalDonations = donations.reduce((sum, donation) => {
    const montant = parseFloat(donation.montant);
    return sum + (isNaN(montant) ? 0 : montant);
  }, 0);

  const totalCotisations = cotisations.reduce((sum, cotisation) => {
    const montant = parseFloat(cotisation.montant);
    return sum + (isNaN(montant) ? 0 : montant);
  }, 0);

  const totalMontant = totalDonations + totalCotisations;

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen flex items-center justify-center">
      {personne && (
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-3xl w-full border-t-4 border-blue-500">
          <h1 className="text-2xl font-semibold mb-6 text-gray-900 text-center">
            {personne.prenom} {personne.nom}
          </h1>
          <div className="space-y-4 text-gray-700">
            <p className="flex items-center">
              <span className="font-medium text-blue-600 mr-3">Matricule:</span>
              {personne.matricule}
            </p>
            <p className="flex items-center">
              <span className="font-medium text-blue-600 mr-3">Catégorie:</span>
              {personne.categorie}
            </p>
            <p className="flex items-center">
              <span className="font-medium text-blue-600 mr-3">Ville:</span>
              {personne.ville}
            </p>
            <p className="flex items-center">
              <span className="font-medium text-blue-600 mr-3">Pays:</span>
              {personne.pays}
            </p>
          </div>

          <div className="mt-8">
            <h2
              className="text-xl font-semibold mb-4 text-gray-900 flex items-center cursor-pointer"
              onClick={() => setShowDonations(!showDonations)}
            >
              Donations
              <svg
                className={`ml-2 transition-transform ${
                  showDonations ? "rotate-180" : ""
                }`}
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </h2>
            {showDonations && (
              <>
                {donations.length ? (
                  <ul className="list-disc pl-5 space-y-2">
                    {donations.map((donation) => (
                      <li key={donation.matricule} className="text-gray-700">
                        Montant: {donation.montant} | Date:{" "}
                        {new Date(donation.date).toLocaleDateString()}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">Aucune donation enregistrée.</p>
                )}
              </>
            )}
          </div>

          <div className="mt-8">
            <h2
              className="text-xl font-semibold mb-4 text-gray-900 flex items-center cursor-pointer"
              onClick={() => setShowCotisations(!showCotisations)}
            >
              Cotisations
              <svg
                className={`ml-2 transition-transform ${
                  showCotisations ? "rotate-180" : ""
                }`}
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </h2>
            {showCotisations && (
              <>
                {cotisations.length ? (
                  <ul className="list-disc pl-5 space-y-2">
                    {cotisations.map((cotisation) => (
                      <li key={cotisation.matricule} className="text-gray-700">
                        Montant: {cotisation.montant} | Date:{" "}
                        {new Date(cotisation.date).toLocaleDateString()}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">
                    Aucune cotisation enregistrée.
                  </p>
                )}
              </>
            )}
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold text-red-900">
              Montant Total : {totalMontant.toFixed(2)} FCFA
            </h3>
          </div>
        </div>
      )}
    </div>
  );
}
