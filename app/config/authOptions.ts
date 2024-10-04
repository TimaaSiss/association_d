import NextAuth, { AuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import pool from '@/app/lib/database'; // Utilisation de ton pool existant
import bcrypt from 'bcryptjs';

// Interface Personne pour typer les utilisateurs récupérés depuis la base de données
interface Personne {
    matricule: number;
    nom: string;
    prenom: string;
    categorie: string;
    ville: string;
    pays: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
}

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text', placeholder: 'email@example.com' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    throw new Error('Email et mot de passe sont requis.');
                }

                // Recherche de l'utilisateur dans la base de données
                const [rows] = await pool.execute('SELECT * FROM personne WHERE email = ?', [credentials.email]);
                const user = (rows as Personne[])[0]; // Typage explicite

                if (user && bcrypt.compareSync(credentials.password, user.password)) {
                    // Retourne un utilisateur conforme aux attentes de NextAuth
                    return { id: user.matricule.toString(), email: user.email, role: user.role };
                } else {
                    throw new Error('Email ou mot de passe incorrect.');
                }
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/signin',
    },
    callbacks: {
        async session({ session, token }) {
            if (token?.user) {
                // Ajout de l'utilisateur au type de session
                session.user = token.user as User;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                // Ajout de l'utilisateur au token JWT
                token.user = user as User;
            }
            return token;
        },
    },
};