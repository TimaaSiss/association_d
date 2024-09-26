import { NextResponse } from 'next/server';
import pool from '@/app/lib/database';
import { RowDataPacket, OkPacket } from 'mysql2';

// Fonction pour gérer les requêtes GET
export async function GET(req: Request, { params }: { params: { matricule: string } }) {
  const matriculeInt = parseInt(params.matricule, 10);

  if (isNaN(matriculeInt)) {
    return NextResponse.json({ error: 'Matricule invalide' }, { status: 400 });
  }

  try {
    // Spécifiez le type pour le résultat de la requête
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM personne WHERE matricule = ?', [matriculeInt]);
    if (rows.length > 0) {
      return NextResponse.json(rows[0]);
    } else {
      return NextResponse.json({ message: 'Personne non trouvée' }, { status: 404 });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération de la personne' }, { status: 500 });
  }
}

// Fonction pour gérer les requêtes PUT
export async function PUT(req: Request, { params }: { params: { matricule: string } }) {
  const { nom, prenom, categorie, ville, pays } = await req.json();
  const matriculeInt = parseInt(params.matricule, 10);

  if (isNaN(matriculeInt)) {
    return NextResponse.json({ error: 'Matricule invalide' }, { status: 400 });
  }

  try {
    const [result] = await pool.query<OkPacket>(
      'UPDATE personne SET nom = ?, prenom = ?, categorie = ?, ville = ?, pays = ? WHERE matricule = ?',
      [nom, prenom, categorie, ville, pays, matriculeInt]
    );
    if (result.affectedRows > 0) {
      return NextResponse.json({ message: 'Personne mise à jour avec succès' });
    } else {
      return NextResponse.json({ message: 'Personne non trouvée' }, { status: 404 });
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour des données:', error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour de la personne' }, { status: 500 });
  }
}

// Fonction pour gérer les requêtes DELETE
export async function DELETE(req: Request, { params }: { params: { matricule: string } }) {
  const matriculeInt = parseInt(params.matricule, 10);

  if (isNaN(matriculeInt)) {
    return NextResponse.json({ error: 'Matricule invalide' }, { status: 400 });
  }

  try {
    const [result] = await pool.query<OkPacket>('DELETE FROM personne WHERE matricule = ?', [matriculeInt]);
    if (result.affectedRows > 0) {
      return NextResponse.json({ message: 'Personne supprimée avec succès' });
    } else {
      return NextResponse.json({ message: 'Personne non trouvée' }, { status: 404 });
    }
  } catch (error) {
    console.error('Erreur lors de la suppression des données:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression de la personne' }, { status: 500 });
  }
}
