"use client";
import { useEffect, useState } from "react";
import Loading from "../admin/loading";
import { FaGem, FaCrown, FaStar } from "react-icons/fa";
import { HiArrowLeft, HiChevronLeft, HiChevronRight } from "react-icons/hi";

const bronzeColor = "#cd7f32";

type Categorie = "Diamond" | "Gold" | "Silver" | "Bronze" | "Other";

const PersonnesCompleteInfo = () => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetch("/api/personnes/complete-info")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          console.log("Données avant filtrage:", data);
          setData(data);
        } else {
          console.error("Les données ne sont pas un tableau");
          setData([]);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching données:", error);
        setIsLoading(false);
      });
  }, []);

  const renderCategorieIcon = (categorie: Categorie) => {
    switch (categorie) {
      case "Diamond":
        return <FaGem className="text-blue-500" />;
      case "Gold":
        return <FaCrown className="text-yellow-500" />;
      case "Silver":
        return <FaStar className="text-gray-400" />;
      case "Bronze":
        return <FaStar className="text-[#cd7f32]" />;
      default:
        return <FaStar className="text-gray-600" />;
    }
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);
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

  const displayedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calcul du total des cotisations et des donations
  const totalCotisation = data.reduce(
    (sum, item) => sum + (item.cotisation_montant || 0),
    0
  );
  const totalDonation = data.reduce(
    (sum, item) => sum + (item.donation_montant || 0),
    0
  );
  const totalGlobal = totalCotisation + totalDonation;

  if (isLoading) {
    return <Loading />;
  }

  if (data.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-green-50">
        <p className="text-gray-500 text-xl">
          Aucune personne ou groupe trouvé.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => (window.location.href = "/signin")}
          className="absolute top-4 left-4 flex items-center px-4 py-2 text-black rounded transition"
          aria-label="Retour à la page principale"
        >
          <HiArrowLeft className="h-5 w-5 mr-2" />
        </button>
        <h1 className="text-3xl font-bold text-green-700 mb-8 text-center">
          Informations sur les différentes Donations et Cotisations éffectuées
          par les Membres de la Fondation
        </h1>
        <div className="overflow-x-auto">
          <table className="w-full table-auto bg-white shadow-md rounded-lg">
            <thead className="bg-green-100">
              <tr>
                <th className="px-4 py-2 text-left text-green-700">
                  Nom/Prénom
                </th>
                <th className="px-4 py-2 text-left text-green-700">
                  Catégorie
                </th>
                <th className="px-4 py-2 text-left text-green-700">
                  Montant de Cotisation
                </th>
                <th className="px-4 py-2 text-left text-green-700">
                  Montant de Donation
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedData.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">
                    {item.nom ? `${item.nom} ${item.prenom}` : item.nom_groupe}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center">
                      {item.categorie}
                      <span className="ml-2">
                        {renderCategorieIcon(item.categorie)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    {item.cotisation_montant || "0"} FCFA
                  </td>
                  <td className="px-4 py-2">
                    {item.donation_montant || "0"} FCFA
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Affichage du total  sous le tableau */}
          </table>{" "}
          <tfoot>
            <tr className="bg-green-100">
              <td colSpan={2} className="px-4 py-2 text-left font-bold">
                Total (Cotisations + Donations)
              </td>
              <td colSpan={2} className="px-4 py-2 text-left font-bold">
                {totalGlobal} FCFA
              </td>
            </tr>
          </tfoot>
        </div>

        {data.length > itemsPerPage && (
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
      </div>
    </div>
  );
};

export default PersonnesCompleteInfo;
