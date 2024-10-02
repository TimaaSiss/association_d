"use client";
import React, { useRef, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/solid";
import Loading from "@/app/components/loading";
import Image from "next/image";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { HiPlus } from "react-icons/hi";

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
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null); // Référence pour le modal

  useEffect(() => {
    if (matricule) {
      const storedImage = localStorage.getItem(`profileImage-${matricule}`);
      if (storedImage) {
        setProfileImage(storedImage);
      }
    }
  }, [matricule]);

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

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          const imageData = reader.result as string;
          setProfileImage(imageData);
          if (matricule) {
            localStorage.setItem(`profileImage-${matricule}`, imageData);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = (): void => {
    setProfileImage(null);
    if (matricule) {
      localStorage.removeItem(`profileImage-${matricule}`); // Optionnel : supprimer l'image stockée
    }
  };

  const handleImageClick = (): void => {
    setIsImageModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setIsImageModalOpen(false);
  };

  // Fonction pour fermer le modal si on clique à l'extérieur
  const handleClickOutside = (event: MouseEvent): void => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      handleCloseModal();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

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
          <div className="flex flex-col items-center mb-6">
            <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden">
              {profileImage ? (
                <Image
                  src={profileImage}
                  alt="Profile"
                  width={100}
                  height={100}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={handleImageClick}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  Aucune image
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              ref={fileInputRef}
              style={{ display: "none" }}
            />
            <div className="absolute top-0 right-0 flex space-x-2"></div>
          </div>
          {isImageModalOpen && (
            <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
              <div ref={modalRef} className="p-2 rounded-lg w-64 h-64">
                <Image
                  src={profileImage as string}
                  alt="Profile"
                  width={500}
                  height={500}
                  className="object-contain"
                />
                <button
                  onClick={handleCloseModal}
                  className="absolute top-2 right-2 text-black text-2xl"
                ></button>
              </div>
            </div>
          )}
          <div className="flex items-center w-full">
            {profileImage ? (
              <div className="w-full flex justify-between items-center">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleImageRemove();
                  }}
                  className="flex items-center justify-center px-3 py-2 bg-black text-white rounded hover:bg-white hover:text-black hover:border-black-500 hover:border-2"
                >
                  Editer la photo
                  <PencilIcon className="h-6 w-6 text-gray-700 cursor-pointer" />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleImageRemove();
                  }}
                  className="flex items-center justify-center px-3 py-2 bg-red-500 text-white rounded hover:bg-white hover:text-red-500 hover:border-red-500 hover:border-2"
                >
                  Supprimer la photo
                  <TrashIcon className="h-6 w-6 cursor-pointer" />
                </button>
              </div>
            ) : (
              <div className="w-full flex justify-center items-center">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }}
                  className="flex justify-center items-center bg-blue-400 px-4 py-2 rounded-lg hover:bg-black hover:text-white"
                >
                  Ajouter une image
                  <HiPlus className="h-6 w-6 text-gray-700 cursor-pointer" />
                </button>
              </div>
            )}
          </div>

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

          {/* Affichage des donations */}
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

          {/* Affichage des cotisations */}
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
