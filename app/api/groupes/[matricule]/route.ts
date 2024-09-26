import { NextResponse } from 'next/server';
import pool from '@/app/lib/database';
import { RowDataPacket, OkPacket } from 'mysql2';

// Gestionnaire des requêtes pour un groupe spécifique par matricule
export async function GET(req: Request, { params }: { params: { matricule: string } }) {
  const groupeMatricule = parseInt(params.matricule, 10);
  console.log('Received request with matricule:', groupeMatricule);

  if (isNaN(groupeMatricule)) {
    return NextResponse.json({ error: 'Matricule invalide' }, { status: 400 });
  }

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM groupe WHERE matricule = ?',
      [groupeMatricule]
    );
    console.log('Fetched rows:', rows);
    if (rows.length > 0) {
      return NextResponse.json(rows[0]);
    } else {
      return NextResponse.json({ message: 'Groupe non trouvé' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération du groupe' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { matricule: string } }) {
  const groupeMatricule = parseInt(params.matricule, 10);
  const { nom, categorie, ville, pays } = await req.json();
  console.log('Received data for update:', { nom, categorie, ville, pays });

  if (isNaN(groupeMatricule)) {
    return NextResponse.json({ error: 'Matricule invalide' }, { status: 400 });
  }

  try {
    const [result] = await pool.query<OkPacket>(
      'UPDATE groupe SET nom = ?, categorie = ?, ville = ?, pays = ? WHERE matricule = ?',
      [nom, categorie, ville, pays, groupeMatricule]
    );
    console.log('Update result:', result);
    if (result.affectedRows > 0) {
      return NextResponse.json({ message: 'Groupe mis à jour avec succès' });
    } else {
      return NextResponse.json({ message: 'Groupe non trouvé' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error updating data:', error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour du groupe' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { matricule: string } }) {
  const groupeMatricule = parseInt(params.matricule, 10);
  console.log('Received delete request with matricule:', groupeMatricule);

  if (isNaN(groupeMatricule)) {
    return NextResponse.json({ error: 'Matricule invalide' }, { status: 400 });
  }

  try {
    const [result] = await pool.query<OkPacket>(
      'DELETE FROM groupe WHERE matricule = ?',
      [groupeMatricule]
    );
    console.log('Delete result:', result);
    if (result.affectedRows > 0) {
      return NextResponse.json({ message: 'Groupe supprimé avec succès' });
    } else {
      return NextResponse.json({ message: 'Groupe non trouvé' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting data:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression du groupe' }, { status: 500 });
  }
}
