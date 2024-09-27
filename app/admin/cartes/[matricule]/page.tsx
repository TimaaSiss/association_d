"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../loading";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/solid";

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
  const { matricule } = useParams();
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

      const matriculeStr = matricule as string;

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
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
            {personne.prenom} {personne.nom}
          </h1>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-lg text-gray-700">
                <strong className="text-blue-600">Matricule:</strong>{" "}
                {personne.matricule}
              </p>
              <p className="text-lg text-gray-700">
                <strong className="text-blue-600">Catégorie:</strong>{" "}
                {personne.categorie}
              </p>
            </div>
            <div>
              <p className="text-lg text-gray-700">
                <strong className="text-blue-600">Ville:</strong>{" "}
                {personne.ville}
              </p>
              <p className="text-lg text-gray-700">
                <strong className="text-blue-600">Pays:</strong> {personne.pays}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div
              className="flex justify-between items-center bg-gray-100 p-4 rounded-lg cursor-pointer"
              onClick={() => setShowDonations(!showDonations)}
            >
              <h2 className="text-xl font-semibold text-gray-900">Donations</h2>
              {showDonations ? (
                <ArrowUpIcon className="h-6 w-6 text-gray-900" />
              ) : (
                <ArrowDownIcon className="h-6 w-6 text-gray-900" />
              )}
            </div>
            {showDonations && (
              <div className="mt-4">
                {donations.length ? (
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    {donations.map((donation) => (
                      <li key={donation.matricule}>
                        Montant: {donation.montant} FCFA | Date:{" "}
                        {new Date(donation.date).toLocaleDateString()}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600 mt-2">
                    Aucune donation enregistrée.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="mt-6">
            <div
              className="flex justify-between items-center bg-gray-100 p-4 rounded-lg cursor-pointer"
              onClick={() => setShowCotisations(!showCotisations)}
            >
              <h2 className="text-xl font-semibold text-gray-900">
                Cotisations
              </h2>
              {showCotisations ? (
                <ArrowUpIcon className="h-6 w-6 text-gray-900" />
              ) : (
                <ArrowDownIcon className="h-6 w-6 text-gray-900" />
              )}
            </div>
            {showCotisations && (
              <div className="mt-4">
                {cotisations.length ? (
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    {cotisations.map((cotisation) => (
                      <li key={cotisation.matricule}>
                        Montant: {cotisation.montant} FCFA | Date:{" "}
                        {new Date(cotisation.date).toLocaleDateString()}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600 mt-2">
                    Aucune cotisation enregistrée.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <h3 className="text-2xl font-bold text-red-600">
              Montant Total : {totalMontant.toFixed(2)} FCFA
            </h3>
          </div>
        </div>
      )}
    </div>
  );
}
