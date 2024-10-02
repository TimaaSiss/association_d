"use client";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import AjouterGroupe from "./ajouter";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Groupe {
  matricule: number;
  nom: string;
  categorie: string;
  ville: string;
  pays: string;
}

export default function GroupeList() {
  const [groupes, setGroupes] = useState<Groupe[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGroupe, setCurrentGroupe] = useState<Groupe | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    fetchGroupes();
  }, []);

  const fetchGroupes = () => {
    setIsLoading(true);
    axios
      .get("/api/groupes")
      .then((response) => {
        setGroupes(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError("Erreur lors de la récupération des groupe.");
        setIsLoading(false);
        console.error("Erreur lors de la récupération des groupes:", error);
        toast.error("Erreur lors de la récupération des groupes", {
          style: { background: "black", color: "white" },
        });
      });
  };

  const handleEdit = (groupe: Groupe) => {
    setCurrentGroupe(groupe);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = (matricule: number) => {
    const isConfirmed = window.confirm(
      "Êtes-vous sûr de vouloir supprimer cette cotisation ?"
    );

    if (isConfirmed) {
      axios
        .delete(`/api/groupes/${matricule}`)
        .then(() => {
          setGroupes(groupes.filter((g) => g.matricule !== matricule));
        })
        .catch((error) => {
          setError("Erreur lors de la suppression du groupe");
          console.error("Erreur lors de la suppression du groupe:", error);
          toast.success("Groupe supprimé avec succès", {
            style: { background: "black", color: "white" },
          });
        });
    }
  };

  const handleAddSuccess = () => {
    setIsModalOpen(false);
    fetchGroupes();
    setCurrentGroupe(null);
    setIsEditing(false);

    if (isEditing) {
      toast.success("Groupe modifiée avec succès", {
        style: { background: "black", color: "white" },
      });
    } else {
      toast.success("Groupe ajoutée avec succès", {
        style: { background: "black", color: "white" },
      });
    }
  };

  const totalPages = Math.ceil(groupes.length / itemsPerPage);

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

  const displayedGroupes = groupes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {session === null && <p>Loading...</p>}
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
          background: "black",
          color: "white",
        }}
      />
      {!isLoading && (
        <>
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Liste des Groupes
          </h1>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                setCurrentGroupe(null);
                setIsEditing(false);
                setIsModalOpen(true);
              }}
              className="mb-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition flex items-center justify-center"
            >
              <HiOutlinePlus className="h-5 w-5" />
              Ajouter un nouveau groupe
            </button>
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <tr>
                  <th className="py-3 px-6 text-left">Matricule</th>
                  <th className="py-3 px-6 text-left">Nom</th>
                  <th className="py-3 px-6 text-left">Catégorie</th>
                  <th className="py-3 px-6 text-left">Ville</th>
                  <th className="py-3 px-6 text-left">Pays</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm font-light">
                {displayedGroupes.map((groupe) => (
                  <tr
                    key={groupe.matricule}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      ASS_DG{groupe.matricule}
                    </td>
                    <td className="py-3 px-6 text-left">{groupe.nom}</td>
                    <td className="py-3 px-6 text-left">{groupe.categorie}</td>
                    <td className="py-3 px-6 text-left">{groupe.ville}</td>
                    <td className="py-3 px-6 text-left">{groupe.pays}</td>
                    <td className="py-3 px-6 text-center flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(groupe)}
                        className="text-blue-500 hover:text-blue-700 transition"
                        aria-label="Modifier"
                      >
                        <HiOutlinePencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(groupe.matricule)}
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
          {groupes.length > 10 && (
            <div className="flex justify-center mt-4">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage == 1}
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
                disabled={currentPage == totalPages}
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
            <AjouterGroupe
              onSuccess={handleAddSuccess}
              initialGroupe={currentGroupe}
              isEditing={isEditing}
            />
          </Modal>
        </>
      )}
    </div>
  );
}
