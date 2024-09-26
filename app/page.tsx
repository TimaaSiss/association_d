"use client";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faDonate,
  faHandHoldingUsd,
  faUsersCog,
  faSignOutAlt, // Icône de déconnexion
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "./admin/loading";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log("Session:", session); // Ajoutez cette ligne pour vérifier la session
    console.log("Status:", status); // Ajoutez cette ligne pour vérifier le status
    // Vérifie si la session est chargée et si session.user existe
    if (status === "loading") return; // Si la session est en cours de chargement, ne rien faire
    if (!session || !session.user || session.user.role !== "admin") {
      router.push("/signin"); // Redirection si non-admin
    }
  }, [session, status, router]);

  // Si la session est en cours de chargement
  if (status === "loading") {
    return <Loading />;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <main>
      <div className="absolute top-4 right-4 z-50">
        {" "}
        <button
          onClick={handleSignOut}
          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
        >
          <FontAwesomeIcon icon={faSignOutAlt} />
        </button>
      </div>

      {/* Image de l'en-tête avec le texte */}
      <div className="relative w-full h-64">
        <Image
          src="/images/gris.jpg"
          alt="Image de bienvenue"
          fill
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white">
            Bienvenue sur Donation Dama Guile
          </h1>
        </div>
      </div>

      {/* Description de l'association */}
      <section className="mt-8 text-center max-w-screen-md mx-auto">
        <p className="text-lg text-gray-700">
          Notre association se consacre à .... Nous travaillons avec passion
          pour .....
        </p>
      </section>

      <section className="my-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-screen-lg mx-auto">
        <Link href="/admin/personnes">
          <div
            className="
            h-full bg-white shadow-md rounded-lg p-6 text-center cursor-pointer hover:bg-gray-100 flex flex-col justify-between items-center"
          >
            <FontAwesomeIcon
              icon={faUser}
              className="h-[200px] w-[200px] text-blue-500"
            />
            <h2 className="text-xl font-semibold">Personnes</h2>
          </div>
        </Link>

        <Link href="/admin/donations">
          <div
            className="
            h-full bg-white shadow-md rounded-lg p-6 text-center cursor-pointer hover:bg-gray-100 flex flex-col justify-between items-center"
          >
            <FontAwesomeIcon
              icon={faDonate}
              className="h-[200px] w-[200px] text-green-500"
            />
            <h2 className="text-xl font-semibold">Donations</h2>
          </div>
        </Link>

        <Link href="/admin/cotisations">
          <div
            className="
            h-full bg-white shadow-md rounded-lg p-6 text-center cursor-pointer hover:bg-gray-100"
          >
            <FontAwesomeIcon
              icon={faHandHoldingUsd}
              className="h-[200px] w-[200px] text-yellow-500"
            />
            <h2 className="text-xl font-semibold">Cotisations</h2>
          </div>
        </Link>

        <Link href="/admin/groupes">
          <div
            className="
            h-full bg-white shadow-md rounded-lg p-6 text-center cursor-pointer hover:bg-gray-100"
          >
            <FontAwesomeIcon
              icon={faUsersCog}
              className="h-[200px] w-[200px] text-red-500"
            />
            <h2 className="text-xl font-semibold">Groupes</h2>
          </div>
        </Link>
      </section>
    </main>
  );
}
