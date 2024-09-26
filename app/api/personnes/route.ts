// /app/api/personnes/route.ts
import { NextResponse } from 'next/server';
import pool from '@/app/lib/database';

// Gestionnaire pour la méthode GET
export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM personne');
    console.log('Fetched rows:', rows);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des personnes' }, { status: 500 });
  }
}

// Gestionnaire pour la méthode POST
export async function POST(req: Request) {
  const { matricule, nom, prenom, categorie, ville, pays } = await req.json();
  try {
    const [result] = await pool.query(
      'INSERT INTO personne (matricule, nom, prenom, categorie, ville, pays) VALUES (?, ?, ?, ?, ?, ?)',
      [matricule, nom, prenom, categorie, ville, pays]
    );
    return NextResponse.json({ id: (result as any).insertId, matricule, nom, prenom, categorie, ville, pays }, { status: 201 });
  } catch (error) {
    console.error('Error inserting data:', error);
    return NextResponse.json({ error: 'Erreur lors de la création de la personne' }, { status: 500 });
  }
}