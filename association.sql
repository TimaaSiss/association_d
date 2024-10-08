-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : db
-- Généré le : mar. 08 oct. 2024 à 15:09
-- Version du serveur : 8.0.39
-- Version de PHP : 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `association`
--

-- --------------------------------------------------------

--
-- Structure de la table `cotisation`
--

CREATE TABLE `cotisation` (
  `type` enum('Groupe','Personne') NOT NULL,
  `montant` float NOT NULL,
  `date` date NOT NULL,
  `groupe_matricule` int DEFAULT NULL,
  `personne_matricule` int DEFAULT NULL,
  `matricule` int NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `cotisation`
--

INSERT INTO `cotisation` (`type`, `montant`, `date`, `groupe_matricule`, `personne_matricule`, `matricule`) VALUES
('Groupe', 35000000, '2024-08-29', 2, NULL, 1),
('Groupe', 40000, '2024-08-29', 3, NULL, 2),
('Personne', 100000, '2024-08-29', NULL, 3, 3),
('Personne', 500000, '2024-08-29', NULL, 4, 4),
('Personne', 400000, '2024-08-29', NULL, 2, 5),
('Groupe', 2000, '2024-08-29', 4, NULL, 6);

-- --------------------------------------------------------

--
-- Structure de la table `donation`
--

CREATE TABLE `donation` (
  `type` enum('Groupe','Personne') NOT NULL,
  `montant` float NOT NULL,
  `date` date NOT NULL,
  `groupe_matricule` int DEFAULT NULL,
  `personne_matricule` int DEFAULT NULL,
  `matricule` int NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `donation`
--

INSERT INTO `donation` (`type`, `montant`, `date`, `groupe_matricule`, `personne_matricule`, `matricule`) VALUES
('Groupe', 20000, '2024-09-06', 2, NULL, 15),
('Personne', 30000, '2024-09-06', NULL, 3, 14),
('Personne', 500000, '2024-09-05', NULL, 2, 10),
('Groupe', 100000, '2024-09-05', 3, NULL, 11),
('Groupe', 150000, '2024-09-05', 2, NULL, 12),
('Personne', 20000, '2024-09-05', NULL, 2, 13);

-- --------------------------------------------------------

--
-- Structure de la table `groupe`
--

CREATE TABLE `groupe` (
  `matricule` int NOT NULL,
  `nom` varchar(100) NOT NULL,
  `categorie` enum('Diamond','Gold','Silver','Bronze','Other') NOT NULL,
  `ville` varchar(100) NOT NULL,
  `pays` varchar(100) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `groupe`
--

INSERT INTO `groupe` (`matricule`, `nom`, `categorie`, `ville`, `pays`) VALUES
(2, 'BNDA', 'Silver', 'Bamako', 'Mali'),
(3, 'Champion', 'Diamond', 'Saint-Denis', 'France'),
(4, 'Waliy', 'Gold', 'Médine', 'Emirats Arabe-Unis');

-- --------------------------------------------------------

--
-- Structure de la table `personne`
--

CREATE TABLE `personne` (
  `matricule` int NOT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `categorie` enum('Diamond','Gold','Silver','Bronze','Other') NOT NULL,
  `ville` varchar(100) NOT NULL,
  `pays` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `personne`
--

INSERT INTO `personne` (`matricule`, `nom`, `prenom`, `categorie`, `ville`, `pays`, `email`, `password`, `role`) VALUES
(3, 'Sissoko', 'Adambary', 'Diamond', 'Ségou', 'Mali', '', '', 'user'),
(2, 'Touré', 'Oumar', 'Silver', 'Marseille', 'France', '', '', 'user'),
(4, 'Guindo', 'Fanta', 'Gold', 'Bamako', 'Mali', '', '', 'user'),
(6, 'Sissoko', 'Fatoumata', 'Gold', 'Bamako', 'Mali', 'timasiss@gmail.com', '$2a$10$TNZhojeV4vpNSOOKerv4xe.SRN7zeQeuf/6OI/DinW12X5R33M5IW', 'admin'),
(7, 'Baby', 'Titi', 'Other', 'Kinshassa', 'Congo', '', '', 'user'),
(8, 'Berthé', 'Binta', 'Bronze', 'Tunis', 'Tunisie', '', '', 'user');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `cotisation`
--
ALTER TABLE `cotisation`
  ADD PRIMARY KEY (`matricule`),
  ADD KEY `fk_cotisation_groupe` (`groupe_matricule`),
  ADD KEY `fk_cotisation_personne` (`personne_matricule`);

--
-- Index pour la table `donation`
--
ALTER TABLE `donation`
  ADD PRIMARY KEY (`matricule`),
  ADD KEY `fk_donation_groupe` (`groupe_matricule`),
  ADD KEY `fk_donation_personne` (`personne_matricule`);

--
-- Index pour la table `groupe`
--
ALTER TABLE `groupe`
  ADD PRIMARY KEY (`matricule`);

--
-- Index pour la table `personne`
--
ALTER TABLE `personne`
  ADD PRIMARY KEY (`matricule`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `cotisation`
--
ALTER TABLE `cotisation`
  MODIFY `matricule` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `donation`
--
ALTER TABLE `donation`
  MODIFY `matricule` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT pour la table `groupe`
--
ALTER TABLE `groupe`
  MODIFY `matricule` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `personne`
--
ALTER TABLE `personne`
  MODIFY `matricule` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
