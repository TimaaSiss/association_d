"use client";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import AjouterCotisation from "./ajouter";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Style pour les notifications
import {
  HiArrowLeft,
  HiChevronLeft,
  HiChevronRight,
  HiOutlinePencil,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineX,
} from "react-icons/hi";

import Loading from "../../components/loading";

interface Cotisation {
  matricule: number;
  personne_matricule?: number;
  groupe_matricule?: number;
  type: string;
  montant: string;
  date: Date;
}

export default function CotisationList() {
  const [cotisations, setCotisations] = useState<Cotisation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCotisation, setCurrentCotisation] = useState<Cotisation | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchCotisations();
  }, []);

  const fetchCotisations = () => {
    setIsLoading(true);
    axios
      .get("/api/cotisations")
      .then((response) => {
        setCotisations(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError("Erreur lors de la récupération des cotisations.");
        setIsLoading(false);
        console.error("Erreur lors de la récupération des cotisations:", error);
        toast.error("Erreur lors de la récupération des cotisations.", {
          style: { backgroundColor: "black", color: "white" }, // Style du message
        });
      });
  };

  const handleEdit = (cotisation: Cotisation) => {
    setCurrentCotisation(cotisation);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = (cotisation: Cotisation) => {
    const isConfirmed = window.confirm(
      "Êtes-vous sûr de vouloir supprimer cette cotisation ?"
    );
    if (isConfirmed) {
      axios
        .delete(`/api/cotisations/${cotisation.matricule}`)
        .then(() => {
          setCotisations(cotisations.filter((c) => c !== cotisation));
          toast.success("Cotisation supprimée avec succès.", {
            style: { backgroundColor: "black", color: "white" }, // Style du message
          });
        })
        .catch((error) => {
          setError("Erreur lors de la suppression de la cotisation");
          console.error(
            "Erreur lors de la suppression de la cotisation:",
            error
          );
          toast.error("Erreur lors de la suppression de la cotisation.", {
            style: { backgroundColor: "black", color: "white" }, // Style du message
          });
        });
    }
  };

  const handleAddSuccess = () => {
    setIsModalOpen(false);
    fetchCotisations();
    setCurrentCotisation(null);
    setIsEditing(false);
    if (isEditing) {
      toast.success("Cotisation modifiée avec succès.", {
        style: { backgroundColor: "black", color: "white" },
      });
    } else {
      toast.success("Cotisation ajoutée avec succès.", {
        style: { backgroundColor: "black", color: "white" },
      });
    }
  };

  const totalPages = Math.ceil(cotisations.length / itemsPerPage);

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

  const displayedCotisations = cotisations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
        closeOnClick
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
            Liste des cotisations
          </h1>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                setCurrentCotisation(null);
                setIsEditing(false);
                setIsModalOpen(true);
              }}
              className="mb-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition flex items-center justify-center"
            >
              <HiOutlinePlus className="h-5 w-5" />
              Ajouter une nouvelle cotisation
            </button>
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <tr>
                  <th className="py-3 px-6 text-left">Matricule</th>
                  <th className="py-3 px-6 text-left">Type</th>
                  <th className="py-3 px-6 text-left">Montant</th>
                  <th className="py-3 px-6 text-left">Date</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm font-light">
                {displayedCotisations.map((cotisation) => (
                  <tr
                    key={
                      cotisation.type === "Groupe"
                        ? cotisation.groupe_matricule
                        : cotisation.personne_matricule
                    }
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      {cotisation.type === "Groupe"
                        ? `Groupe de matricule ${cotisation.groupe_matricule}` // Afficher le matricule du groupe
                        : `Personne de matricule ${cotisation.personne_matricule}`}{" "}
                    </td>
                    <td className="py-3 px-6 text-left">{cotisation.type}</td>
                    <td className="py-3 px-6 text-left">
                      {cotisation.montant}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {cotisation.date
                        ? new Date(cotisation.date).toLocaleDateString("fr-FR")
                        : ""}
                    </td>
                    <td className="py-3 px-6 text-center flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(cotisation)}
                        className="text-blue-500 hover:text-blue-700 transition"
                        aria-label="Modifier"
                      >
                        <HiOutlinePencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cotisation)}
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
          {cotisations.length > 10 && (
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
            contentLabel={
              isEditing ? "Modifier une Cotisation" : "Ajouter une Cotisation"
            }
            className="modal bg-white p-8 rounded shadow-md max-w-lg mx-auto relative"
            overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 left-2 text-gray-500 hover:text-gray-700 transition"
              aria-label="Close"
            >
              <HiOutlineX className="h-6 w-6" />
            </button>
            <AjouterCotisation
              onSuccess={handleAddSuccess}
              initialCotisation={currentCotisation}
              isEditing={isEditing}
            />
          </Modal>
        </>
      )}
    </div>
  );
}
