import { NextResponse } from 'next/server';
import pool from '@/app/lib/database';

// Gestionnaire pour la méthode GET
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const personneMatricule = searchParams.get('personne_matricule');
  const groupeMatricule = searchParams.get('groupe_matricule');

  try {
    let query: string;
    let values: (number | null)[] = []; // Initialiser values comme un tableau vide

    // Construire la requête en fonction des paramètres fournis
    if (personneMatricule) {
      query = 'SELECT * FROM cotisation WHERE personne_matricule = ?';
      values.push(parseInt(personneMatricule, 10)); // Ajouter le matricule de la personne
    } else if (groupeMatricule) {
      query = 'SELECT * FROM cotisation WHERE groupe_matricule = ?';
      values.push(parseInt(groupeMatricule, 10)); // Ajouter le matricule du groupe
    } else {
      // Si aucun matricule fourni, récupérer toutes les cotisations
      query = 'SELECT * FROM cotisation';
    }

    const [rows] = await pool.query(query, values);
    console.log('Fetched rows:', rows);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des cotisations:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des cotisations' }, { status: 500 });
  }
}

// Gestionnaire pour la méthode POST
export async function POST(req: Request) {
  const { personne_matricule, groupe_matricule, type, montant, date } = await req.json();

  // Valider le bon matricule en fonction du type
  const groupeMatricule = type === 'Groupe' ? groupe_matricule : null;
  const personneMatriculeValid = type === 'Personne' ? personne_matricule : null;

  try {
    const [result] = await pool.query(
      'INSERT INTO cotisation (personne_matricule, groupe_matricule, type, montant, date) VALUES (?, ?, ?, ?, ?)',
      [personneMatriculeValid, groupeMatricule, type, montant, date]
    );
    return NextResponse.json(
      { id: (result as any).insertId, personne_matricule: personneMatriculeValid, groupe_matricule: groupeMatricule, type, montant, date },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur lors de la création de la cotisation:', error);
    return NextResponse.json({ error: 'Erreur lors de la création de la cotisation' }, { status: 500 });
  }
}
