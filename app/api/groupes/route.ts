import { NextResponse } from 'next/server';
import pool from '@/app/lib/database';

// Gestionnaire des requêtes pour les groupes
export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM groupe');
    console.log('Fetched rows:', rows);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des groupes' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { nom, categorie, ville, pays } = await req.json();
  console.log('Received data:', { nom, categorie, ville, pays });

  try {
    const [result] = await pool.query(
      'INSERT INTO groupe (nom, categorie, ville, pays) VALUES (?, ?, ?, ?)',
      [nom, categorie, ville, pays]
    );
    console.log('Insert result:', result);
    return NextResponse.json(
      { matricule: (result as any).insertId, nom, categorie, ville, pays },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error inserting data:', error);
    return NextResponse.json({ error: 'Erreur lors de la création du groupe' }, { status: 500 });
  }
}
