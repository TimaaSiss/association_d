import { NextResponse } from 'next/server';
import pool from '@/app/lib/database';
import { RowDataPacket, OkPacket } from 'mysql2'; // Import correct types

// Fonction pour gérer les requêtes GET
export async function GET(req: Request, { params }: { params: { matricule: string } }) {
  const matriculeInt = parseInt(params.matricule, 10);

  if (isNaN(matriculeInt)) {
    return NextResponse.json({ error: 'Matricule invalide' }, { status: 400 });
  }

  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM cotisation WHERE matricule = ?', [matriculeInt]);
    if (rows.length > 0) {
      return NextResponse.json(rows[0]);
    } else {
      return NextResponse.json({ message: 'Cotisation non trouvée' }, { status: 404 });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération de la cotisation' }, { status: 500 });
  }
}

// Fonction pour gérer les requêtes PUT
export async function PUT(req: Request, { params }: { params: { matricule: string } }) {
  const { type, montant, date, personne_matricule, groupe_matricule } = await req.json();
  const matriculeInt = parseInt(params.matricule, 10);

  if (isNaN(matriculeInt)) {
    return NextResponse.json({ error: 'Matricule invalide' }, { status: 400 });
  }

  // Déterminer quel matricule utiliser en fonction du type
  const groupeMatricule = type === 'Groupe' ? groupe_matricule : null;
  const personneMatricule = type === 'Personne' ? personne_matricule : null;

  try {
    const [result] = await pool.query<OkPacket>(
      'UPDATE cotisation SET type = ?, montant = ?, date = ?, groupe_matricule = ?, personne_matricule = ? WHERE id = ?',
      [type, montant, date, groupeMatricule, personneMatricule, matriculeInt]
    );
    if (result.affectedRows > 0) {
      return NextResponse.json({ message: 'Cotisation mise à jour avec succès' });
    } else {
      return NextResponse.json({ message: 'Cotisation non trouvée' }, { status: 404 });
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour des données:', error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour de la cotisation' }, { status: 500 });
  }
}

// Fonction pour gérer les requêtes DELETE
export async function DELETE(req: Request, { params }: { params: { matricule: string } }) {
  const matriculeInt = parseInt(params.matricule, 10);

  if (isNaN(matriculeInt)) {
    return NextResponse.json({ error: 'Matricule invalide' }, { status: 400 });
  }

  try {
    const [result] = await pool.query<OkPacket>('DELETE FROM cotisation WHERE id = ?', [matriculeInt]);
    if (result.affectedRows > 0) {
      return NextResponse.json({ message: 'Cotisation supprimée avec succès' });
    } else {
      return NextResponse.json({ message: 'Cotisation non trouvée' }, { status: 404 });
    }
  } catch (error) {
    console.error('Erreur lors de la suppression des données:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression de la cotisation' }, { status: 500 });
  }
}
