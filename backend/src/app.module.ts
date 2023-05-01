import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
})
export class AppModule {}

//controlleur princiapl de l'application qui gère les route HTTP
/*
Le fichier app.module.ts est un fichier central dans l'architecture d'une application NestJS. Il définit le module racine de l'application et les fonctionnalités qu'elle inclut.

Plus précisément, il permet de :

Définir les importations des autres modules, services, contrôleurs, etc. de l'application
Configurer les fournisseurs (providers) qui permettent l'injection de dépendances dans l'application
Configurer les contrôleurs (controllers), qui sont responsables de la gestion des requêtes entrantes et des réponses sortantes
Configurer les services (services), qui encapsulent la logique métier de l'application
Configurer les intergiciels (middlewares), qui interagissent avec les requêtes entrantes et sortantes pour ajouter des fonctionnalités comme la gestion des erreurs, la validation des données, etc.
En somme, le fichier app.module.ts est un point central pour la configuration et la définition des fonctionnalités de l'application NestJS.
*/