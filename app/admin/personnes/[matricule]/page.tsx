"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../../components/loading";
import { QRCode } from "react-qrcode-logo";
import Image from "next/image";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { HiArrowLeft } from "react-icons/hi";

interface Personne {
  matricule: number;
  nom: string;
  prenom: string;
  categorie: string;
  ville: string;
}

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

export default function PersonneDetail() {
  const { matricule } = useParams();
  const [personne, setPersonne] = useState<Personne | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [cotisations, setCotisations] = useState<Cotisation[]>([]);
  const [totalMontant, setTotalMontant] = useState<number>(0);

  useEffect(() => {
    if (matricule) {
      setIsLoading(true);
      const matriculeStr = matricule as string;

      // Fetch details of the person
      axios
        .get(`/api/personnes/${matriculeStr}`)
        .then((response) => {
          setPersonne(response.data);
        })
        .catch((error) => {
          setError(
            "Erreur lors de la récupération des détails de la personne."
          );
          console.error("Erreur :", error);
        });

      // Fetch donations of the person
      axios
        .get(`/api/donations?personne_matricule=${matriculeStr}`)
        .then((response) => {
          if (Array.isArray(response.data)) {
            setDonations(response.data);
          } else {
            console.error("Les donations reçues ne sont pas un tableau.");
          }
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la récupération des donations :",
            error
          );
        });

      // Fetch cotisations of the person
      axios
        .get(`/api/cotisations?personne_matricule=${matriculeStr}`)
        .then((response) => {
          if (Array.isArray(response.data)) {
            setCotisations(response.data);
          } else {
            console.error("Les cotisations reçues ne sont pas un tableau.");
          }
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la récupération des cotisations :",
            error
          );
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [matricule]);

  // Calcul du montant total
  useEffect(() => {
    const totalDonations = donations.reduce((sum, donation) => {
      const montant = parseFloat(donation.montant);
      return sum + (isNaN(montant) ? 0 : montant);
    }, 0);

    const totalCotisations = cotisations.reduce((sum, cotisation) => {
      const montant = parseFloat(cotisation.montant);
      return sum + (isNaN(montant) ? 0 : montant);
    }, 0);

    setTotalMontant(totalDonations + totalCotisations);
  }, [donations, cotisations]);

  if (isLoading) return <Loading />;
  if (error)
    return <div className="text-red-500 text-center mt-4">{error}</div>;

  const getCategoryBackground = (categorie: string) => {
    switch (categorie) {
      case "Diamond":
        return "url('/images/diament.jpg')";
      case "Gold":
        return "url('/images/ORR.jpg')";
      case "Silver":
        return "url('/images/argent.jpg')";
      case "Bronze":
        return "url('/images/bronze.jpg')";
      case "Other":
        return "url('/images/autre.jpg')";
    }
  };

  const getTextColor = (categorie: string) => {
    return categorie === "Gold" ||
      categorie === "Diamond" ||
      categorie === "Bronze"
      ? "text-white"
      : "text-black";
  };

  const downloadCard = () => {
    const input = document.getElementById("card");
    if (input) {
      html2canvas(input, {
        scale: 4,
        useCORS: true,
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png", 1.0);

        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        // Calcul des dimensions pour ajuster l'image au PDF sans distorsion
        const ratio = Math.min(
          150 / canvasWidth, // Réduire à une largeur de 150mm
          pageHeight / canvasHeight
        );
        const imgWidth = canvasWidth * ratio;
        const imgHeight = canvasHeight * ratio;

        // Ajouter des marges pour éviter que le logo ne soit coupé
        const xOffset = (pageWidth - imgWidth) / 2 + 5; // Marge à gauche
        const yOffset = (pageHeight - imgHeight) / 2 + 5; // Marge en haut

        pdf.addImage(
          imgData,
          "PNG",
          xOffset, // Ajuste cette valeur si nécessaire
          yOffset, // Ajuste cette valeur pour un meilleur positionnement vertical
          imgWidth - 10,
          imgHeight - 10
        );

        pdf.save("carte_personne.pdf");
      });
    }
  };

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen flex items-center justify-center">
      <button
        onClick={() => (window.location.href = "/admin/personnes")}
        className="absolute top-4 left-4 flex items-center px-4 py-2 text-black rounded transition"
        aria-label="Retour à la page principale"
      >
        <HiArrowLeft className="h-5 w-5 mr-2" />
      </button>
      <button
        onClick={downloadCard}
        className="absolute top-4 right-4 p-2 text-black font-bold  "
        title="Télécharger la carte"
      >
        <ArrowDownTrayIcon className="h-6 w-6" />
      </button>{" "}
      {personne && (
        <div
          id="card" // Ajoutez un ID pour référencer l'élément à télécharger
          className="bg-white shadow-lg rounded-lg p-6 max-w-2xl w-full border-t-4 relative flex flex-col"
          style={{
            backgroundImage: getCategoryBackground(personne.categorie),
            backgroundSize: "100%auto", // Ajuste l'image à l'intérieur de la carte
            backgroundPosition: "center",
          }}
        >
          <div className="absolute w-[100px] h-[100px] top-2 right-2 p-2 bg-white rounded-full z-50">
            <Image
              src="/images/FDGD.jpg"
              alt="Logo de la Fondation"
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div className={`text-left mb-4 ${getTextColor(personne.categorie)}`}>
            <p className="text-xl font-bold">Nom : {personne.nom}</p>
            <p className="text-xl font-bold">Prénom : {personne.prenom}</p>
            <p className="text-xl font-bold">Ville : {personne.ville}</p>
          </div>
          <div
            className={`text-center text-5xl italic my-4 ${getTextColor(
              personne.categorie
            )}`}
          >
            {personne.categorie}
          </div>

          <div
            className={`flex justify-start mt-auto ${getTextColor(
              personne.categorie
            )}`}
          >
            <h3
              className={`text-xl font-bold ${getTextColor(
                personne.categorie
              )} `}
            >
              Total Cotisations/Donations: {totalMontant.toFixed(2)} FCFA
            </h3>
          </div>

          <div className="flex justify-end mt-auto">
            <QRCode
              value={`${window.location.origin}/personne/${personne.matricule}`}
              size={100}
            />
          </div>
        </div>
      )}
    </div>
  );
}
