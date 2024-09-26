// lib/db.js
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost', // Remplacez par votre hôte MySQL
  user: 'Fatoumata', // Remplacez par votre utilisateur MySQL
  password: '1234', // Remplacez par votre mot de passe MySQL
  database: 'association',
  port: 3306, // Remplacez par le nom de votre base de données
});

export default pool;
