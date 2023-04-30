# Utilisez une image officielle de Node.js comme base
FROM node:latest

# Définissez le répertoire de travail pour le reste du Dockerfile
WORKDIR /app

# Copiez le package.json et le package-lock.json dans le répertoire de travail
COPY package*.json ./

# Installez la dernière version de TypeScript globalement
RUN yarn global add typescript

# Installez les dépendances du projet
RUN yarn install

# Copiez le reste des fichiers du projet dans le répertoire de travail
COPY . .

# Build the application for production
RUN yarn run build

# Exposez le port que le conteneur doit écouter
#EXPOSE 80

# Démarrez l'application
CMD ["yarn", "start"]