// /app/api/complete-info/route.ts
import { NextResponse } from 'next/server';
import pool from '@/app/lib/database';

export async function GET() {
    try {
        // Récupérer les personnes
        const [personnesRows] = await pool.query(`
           SELECT 
    p.nom,
    p.prenom,
    p.categorie,
    NULL AS nom_groupe,
    (SELECT SUM(d.montant) FROM donation d WHERE d.personne_matricule = p.matricule) AS donation_montant,
    (SELECT SUM(c.montant) FROM cotisation c WHERE c.personne_matricule = p.matricule) AS cotisation_montant
FROM personne p
WHERE p.role != 'admin';

        `);

        // Récupérer les groupes
        const [groupesRows] = await pool.query(`
            SELECT 
    NULL AS nom,
    NULL AS prenom,
    g.categorie,
    g.nom AS nom_groupe,
    (SELECT SUM(d.montant) FROM donation d WHERE d.groupe_matricule = g.matricule) AS donation_montant,
    (SELECT SUM(c.montant) FROM cotisation c WHERE c.groupe_matricule = g.matricule) AS cotisation_montant
FROM groupe g;

        `);


        const personnesArray = Array.isArray(personnesRows) ? personnesRows : [];
        const groupesArray = Array.isArray(groupesRows) ? groupesRows : [];


        const allRows = [...personnesArray, ...groupesArray];

        return NextResponse.json(allRows);
    } catch (error) {
        console.error('Error fetching complete information:', error);
        return NextResponse.json({ error: 'Erreur lors de la récupération des informations complètes' }, { status: 500 });
    }
}
