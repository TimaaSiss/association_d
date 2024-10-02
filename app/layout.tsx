// app/layout.tsx

import { Inter } from "next/font/google";
import "./globals.css"; // Assurez-vous que ce fichier CSS existe et est valide
import SessionProviderWrapper from "./SessionProviderWrapper"; // Assurez-vous que ce fichier existe et est valide

export const metadata = {
  title: "Fondation Dama Guile Diawara",
  description: "Description de Donation Dama Guile",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  );
}
