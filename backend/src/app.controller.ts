/*
Le fichier app.controller.ts est un fichier de contrôleur dans une application Nest.js. Les contrôleurs sont des classes qui gèrent les requêtes HTTP entrantes et déterminent comment y répondre.

Plus précisément, le fichier app.controller.ts contient une classe AppController qui est décorée avec un décorateur @Controller(). Cela permet à Nest.js de savoir que cette classe est un contrôleur et qu'elle doit être prise en compte pour la gestion des requêtes HTTP.

Dans la classe AppController, on définit des méthodes qui correspondent aux différentes routes HTTP que l'application doit gérer. Par exemple, on peut avoir une méthode getHello() qui répond à une requête HTTP GET sur la route /hello. Cette méthode retournera une réponse HTTP contenant le message "Hello World".

Le fichier app.controller.ts est généralement un point d'entrée important pour l'application, car c'est là que sont définies les routes principales.
*/


import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Hello World!';
  }
}