"use client";
import { useEffect, useState } from "react";
import Modal from "react-modal";

import axios from "axios";
import AjouterPersonne from "./ajouter";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaGem, FaCrown, FaStar } from "react-icons/fa";

import {
  HiArrowLeft,
  HiChevronLeft,
  HiChevronRight,
  HiOutlinePencil,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineX,
} from "react-icons/hi";
import Loading from "../loading";
import { QRCodeCanvas } from "qrcode.react";
const bronzeColor = "#cd7f32";

type Categorie = "Diamond" | "Gold" | "Silver" | "Bronze" | "Other";
interface Personne {
  matricule: number;
  nom: string;
  prenom: string;
  categorie: Categorie;
  ville: string;
  pays: string;
  email: string;
  password: string;
  role: "user" | "admin";
}

export default function PersonneList() {
  const [personnes, setPersonnes] = useState<Personne[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPersonne, setCurrentPersonne] = useState<Personne | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [selectedPersonne, setSelectedPersonne] = useState<Personne | null>(
    null
  );

  useEffect(() => {
    fetchPersonnes();
  }, []);

  const fetchPersonnes = () => {
    setIsLoading(true);
    axios
      .get("/api/personnes")
      .then((response) => {
        setPersonnes(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError("Erreur lors de la récupération des personnes.");
        setIsLoading(false);
        console.error("Erreur lors de la récupération des personnes:", error);
        toast.error("Erreur lors de la récupération des personnes", {
          style: { background: "black", color: "white" },
        });
      });
  };

  const handleEdit = (personne: Personne) => {
    setCurrentPersonne(personne);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = (matricule: number) => {
    const isConfirmed = window.confirm(
      "Êtes-vous sûr de vouloir supprimer cette cotisation ?"
    );
    if (isConfirmed) {
      axios
        .delete(`/api/personnes/${matricule}`)
        .then(() => {
          setPersonnes(personnes.filter((p) => p.matricule !== matricule));
        })
        .catch((error) => {
          setError("Erreur lors de la suppression de la personne.");
          console.error("Erreur lors de la suppression de la personne:", error);
          toast.success("Personne supprimée avec succès", {
            style: { background: "black", color: "white" },
          });
        });
    }
  };

  const handleAddSuccess = () => {
    setIsModalOpen(false);
    fetchPersonnes();
    setCurrentPersonne(null);
    setIsEditing(false);

    if (isEditing) {
      toast.success("Personne modifiée avec succès", {
        style: { backgroundColor: "black", color: "white" },
      });
    } else {
      toast.success("Personne ajoutée avec succès", {
        style: { backgroundColor: "black", color: "white" },
      });
    }
  };

  const totalPages = Math.ceil(personnes.length / itemsPerPage);
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const displayedPersonnes = personnes
    .filter((personne) => personne.role !== "admin")
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  /*  const handleQrCode = (personne: Personne) => {
    const url = `${window.location.origin}/admin/personnes/${personne.matricule}`;
    console.log("Generated URL:", url);
    setSelectedPersonne(personne);
    setIsQrModalOpen(true);
  }; */
  const handleCategoryClick = (personne: Personne) => {
    window.location.href = `/admin/personnes/${personne.matricule}`;
  };

  const getCategoryIcon = (categorie: Categorie) => {
    switch (categorie) {
      case "Diamond":
        return <FaGem className="text-blue-500" />; // Icône de diamant
      case "Gold":
        return <FaCrown className="text-yellow-500" />; // Icône d'or
      case "Silver":
        return <FaStar className="text-gray-400" />; // Icône d'argent
      case "Bronze":
        // Ajoutez ici l'icône pour la catégorie "Bronze"
        return <FaStar style={{ color: bronzeColor }} />; // Exemple d'icône pour bronze
      case "Other":
        // Ajoutez ici l'icône pour la catégorie "Other"
        return <FaStar className="text-gray-600" />; // Exemple d'icône pour autres
      default:
        return null; // Pas d'icône pour les autres catégories
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {isLoading && <Loading />}

      <button
        onClick={() => (window.location.href = "/")}
        className="absolute top-4 left-4 flex items-center px-4 py-2 text-black rounded transition"
        aria-label="Retour à la page principale"
      >
        <HiArrowLeft className="h-5 w-5 mr-2" />
      </button>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        pauseOnHover
        draggable
        toastStyle={{
          backgroundColor: "black",
          color: "white",
        }}
      />
      {!isLoading && (
        <>
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Liste des Personnes
          </h1>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                setCurrentPersonne(null);
                setIsEditing(false);
                setIsModalOpen(true);
              }}
              className="mb-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition flex items-center justify-center"
            >
              <HiOutlinePlus className="h-5 w-5" />
              Ajouter une nouvelle personne
            </button>
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <tr>
                  <th className="py-3 px-6 text-left">Matricule</th>
                  <th className="py-3 px-6 text-left">Nom</th>
                  <th className="py-3 px-6 text-left">Prénom</th>
                  <th className="py-3 px-6 text-left">Catégorie</th>
                  <th className="py-3 px-6 text-left">Ville</th>
                  <th className="py-3 px-6 text-left">Pays</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm font-light">
                {displayedPersonnes.map((personne) => (
                  <tr
                    key={personne.matricule}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      {personne.matricule}
                    </td>
                    <td className="py-3 px-6 text-left flex items-center gap-2">
                      {personne.nom}
                    </td>
                    <td className="py-3 px-6 text-left">{personne.prenom}</td>
                    <td className="py-3 px-6 text-left">
                      {personne.categorie}
                    </td>
                    <td className="py-3 px-6 text-left">{personne.ville}</td>
                    <td className="py-3 px-6 text-left">{personne.pays}</td>
                    <td className="py-3 px-6 text-center flex justify-center gap-2">
                      <button
                        onClick={() => handleCategoryClick(personne)}
                        className="text-black hover:text-gray-700 transition"
                        aria-label="Catégorie"
                      >
                        {getCategoryIcon(personne.categorie)}
                      </button>

                      {/*  <button
                        onClick={() => handleQrCode(personne)}
                        className="text-black hover:text-gray-700 transition"
                        aria-label="QR Code"
                      >
                        {getCategoryIcon(personne.categorie)}
                      </button> */}
                      <button
                        onClick={() => handleEdit(personne)}
                        className="text-blue-500 hover:text-blue-700 transition"
                        aria-label="Modifier"
                      >
                        <HiOutlinePencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(personne.matricule)}
                        className="text-red-500 hover:text-red-700 transition"
                        aria-label="Supprimer"
                      >
                        <HiOutlineTrash className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {personnes.length > 10 && (
            <div className="flex justify-center mt-4">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`p-2 rounded ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-500 hover:text-blue-700"
                }`}
                aria-label="Page précédente"
              >
                <HiChevronLeft className="h-5 w-5" />
              </button>
              <span className="px-4 py-2">
                Page {currentPage} sur {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-500 hover:text-blue-700"
                }`}
                aria-label="Page suivante"
              >
                <HiChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
          <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            contentLabel={isEditing ? "Modifier Personne" : "Ajouter Personne"}
            className="modal bg-white p-8 rounded shadow-md max-w-lg mx-auto relative" // Ajoutez 'relative' pour positionner l'icône de fermeture
            overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 left-2 text-gray-500 hover:text-gray-700 transition"
              aria-label="Close"
            >
              <HiOutlineX className="h-6 w-6" />
            </button>
            <AjouterPersonne
              onSuccess={handleAddSuccess}
              initialPersonne={currentPersonne}
              isEditing={isEditing}
            />
          </Modal>

          <Modal
            isOpen={isQrModalOpen}
            onRequestClose={() => setIsQrModalOpen(false)}
            contentLabel="QR Code"
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
          >
            <div className="bg-white p-6 rounded-lg relative">
              <HiOutlineX
                onClick={() => setIsQrModalOpen(false)}
                className="absolute top-3 left-3 h-6 w-6 text-gray-700 cursor-pointer hover:text-gray-900 transition"
                aria-label="Fermer"
              />
              <br />
              <h2 className="text-xl font-bold mb-4 flex justify-center">
                {selectedPersonne?.prenom} {selectedPersonne?.nom}
              </h2>
              {selectedPersonne && (
                <QRCodeCanvas
                  value={`${window.location.origin}/admin/personnes/${selectedPersonne.matricule}`}
                  size={250}
                />
              )}
            </div>
          </Modal>
        </>
      )}
    </div>
  );
}
