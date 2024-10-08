# Étape 1 : Construire l'application Next.js
FROM node:18-alpine AS builder

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code de l'application
COPY . .

# Builder l'application Next.js pour la production
RUN npm run build

# Étape 2 : Configurer l'image de production
FROM node:18-alpine AS runner

# Définir le répertoire de travail pour l'image finale
WORKDIR /app

# Copier uniquement les fichiers nécessaires depuis l'étape de construction
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# Installer uniquement les dépendances de production
RUN npm install --only=production

# Exposer le port 3000
EXPOSE 3000

# Démarrer l'application Next.js
CMD ["npm", "run", "start"]
