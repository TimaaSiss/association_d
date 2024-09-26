import { NextRequest, NextResponse } from 'next/server';
import pool from '@/app/lib/database'; // Assure-toi que le chemin est correct
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { email, password, role, nom, prenom, matricule, categorie, ville, pays } = await req.json();

  // Vérification des champs obligatoires
  if (!email || !password || !role) {
    return NextResponse.json({ message: 'Tous les champs sont obligatoires.' }, { status: 400 });
  }

  try {
    // Vérifier si l'utilisateur existe déjà
    const [existingUser]: any = await pool.execute('SELECT * FROM personne WHERE email = ?', [email]);

    // Assurez-vous que `existingUser` est un tableau
    if (Array.isArray(existingUser) && existingUser.length > 0) {
      return NextResponse.json({ message: 'Cet email est déjà utilisé.' }, { status: 400 });
    }

    // Hashage du mot de passe
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Insérer l'utilisateur dans la base de données
    await pool.execute(
      'INSERT INTO personne (matricule, nom, prenom, categorie, ville, pays, email, password, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [matricule, nom, prenom, categorie, ville, pays, email, hashedPassword, role]
    );

    return NextResponse.json({ message: 'Inscription réussie.' }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de l’inscription :', error);
    return NextResponse.json({ message: 'Erreur lors de l’inscription.' }, { status: 500 });
  }
}
