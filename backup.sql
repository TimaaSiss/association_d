-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: localhost    Database: association
-- ------------------------------------------------------
-- Server version	8.0.31

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cotisation`
--

DROP TABLE IF EXISTS `cotisation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cotisation` (
  `type` enum('Groupe','Personne') NOT NULL,
  `montant` float NOT NULL,
  `date` date NOT NULL,
  `groupe_matricule` int DEFAULT NULL,
  `personne_matricule` int DEFAULT NULL,
  `matricule` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`matricule`),
  KEY `fk_cotisation_groupe` (`groupe_matricule`),
  KEY `fk_cotisation_personne` (`personne_matricule`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cotisation`
--

LOCK TABLES `cotisation` WRITE;
/*!40000 ALTER TABLE `cotisation` DISABLE KEYS */;
INSERT INTO `cotisation` VALUES ('Groupe',35000000,'2024-08-29',2,NULL,1),('Groupe',40000,'2024-08-29',3,NULL,2),('Personne',100000,'2024-08-29',NULL,3,3),('Personne',500000,'2024-08-29',NULL,4,4),('Personne',400000,'2024-08-29',NULL,2,5),('Groupe',2000,'2024-08-29',4,NULL,6);
/*!40000 ALTER TABLE `cotisation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `donation`
--

DROP TABLE IF EXISTS `donation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `donation` (
  `type` enum('Groupe','Personne') NOT NULL,
  `montant` float NOT NULL,
  `date` date NOT NULL,
  `groupe_matricule` int DEFAULT NULL,
  `personne_matricule` int DEFAULT NULL,
  `matricule` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`matricule`),
  KEY `fk_donation_groupe` (`groupe_matricule`),
  KEY `fk_donation_personne` (`personne_matricule`)
) ENGINE=MyISAM AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donation`
--

LOCK TABLES `donation` WRITE;
/*!40000 ALTER TABLE `donation` DISABLE KEYS */;
INSERT INTO `donation` VALUES ('Groupe',20000,'2024-09-06',2,NULL,15),('Personne',30000,'2024-09-06',NULL,3,14),('Personne',500000,'2024-09-05',NULL,2,10),('Groupe',100000,'2024-09-05',3,NULL,11),('Groupe',150000,'2024-09-05',2,NULL,12),('Personne',20000,'2024-09-05',NULL,2,13);
/*!40000 ALTER TABLE `donation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `groupe`
--

DROP TABLE IF EXISTS `groupe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `groupe` (
  `matricule` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `categorie` enum('Diamond','Gold','Silver','Bronze','Other') NOT NULL,
  `ville` varchar(100) NOT NULL,
  `pays` varchar(100) NOT NULL,
  PRIMARY KEY (`matricule`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groupe`
--

LOCK TABLES `groupe` WRITE;
/*!40000 ALTER TABLE `groupe` DISABLE KEYS */;
INSERT INTO `groupe` VALUES (2,'BNDA','Silver','Bamako','Mali'),(3,'Champion','Diamond','Saint-Denis','France'),(4,'Waliy','Gold','M├®dine','Emirats Arabe-Unis');
/*!40000 ALTER TABLE `groupe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personne`
--

DROP TABLE IF EXISTS `personne`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personne` (
  `matricule` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `categorie` enum('Diamond','Gold','Silver','Bronze','Other') NOT NULL,
  `ville` varchar(100) NOT NULL,
  `pays` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  PRIMARY KEY (`matricule`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personne`
--

LOCK TABLES `personne` WRITE;
/*!40000 ALTER TABLE `personne` DISABLE KEYS */;
INSERT INTO `personne` VALUES (3,'Sissoko','Adambary','Diamond','S├®gou','Mali','','','user'),(2,'Tour├®','Oumar','Silver','Marseille','France','','','user'),(4,'Guindo','Fanta','Gold','Bamako','Mali','','','user'),(6,'Sissoko','Fatoumata','Gold','Bamako','Mali','timasiss@gmail.com','$2a$10$TNZhojeV4vpNSOOKerv4xe.SRN7zeQeuf/6OI/DinW12X5R33M5IW','admin'),(7,'Baby','Titi','Other','Kinshassa','Congo','','','user'),(8,'Berth├®','Binta','Bronze','Tunis','Tunisie','','','user');
/*!40000 ALTER TABLE `personne` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-03 13:23:53
