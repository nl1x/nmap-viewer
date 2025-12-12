# Nmap Viewer - Test technique

## Énoncé

Réaliser une application web qui permet de :
- Téléverser un ou plusieurs fichiers .nmap
- Afficher un rendu tel que présenté [ci-dessous](#rendu-attendu)
- Sauvegarder le résultat du fichier .nmap en base de données
- Réafficher les résultats stockés en base de données après actualisation de la page

Le candidat a toute liberté sur les choix des technologies.

### Rendu attendu

|                                                                                                 |
|:-----------------------------------------------------------------------------------------------:|
|              **Vue liste** <br> <img src="assets/rendu-vue-liste.png" width="450">              |
| **Vue liste avec un élément étendu** <br> <img src="assets/rendu-liste-etendu.png" width="450"> |

## Choix des technologies

| Domaine        | Technologie |
|----------------|-------------|
| Back-end       | ExpressTS   |
| Front-end      | ViteTS      |
| Base de donnée | Postgresql  |
| ORM            | Sequelize   |

### Schéma de la base de donnée
<img src="assets/db-schema.png" width="450" alt="">

## Rendu

### Prérequis

- docker

### Installation

Avant de lancer l'application, commencez par copier le contenu des fichiers .env.example dans un fichier .env,
dans les dossiers correspondant.

```bash
cp .env.example .env
cp front-end/.env.example front-end/.env
cp back-end/.env.example back-end/.env
```

Une fois cela fait, éditez les fichiers comme bon vous semble. 

> [!NOTE]
> Pensez bien à modifier les identifiants de la base de donnée à la fois dans le fichier `.env` et dans le fichier `back-end/.env`.

### Démarrage

Pour lancer l'application, exécutez le docker-compose à la racine du dépôt :
```bash
docker compose up --build
```

> [!NOTE]
> Les erreurs liées à la base de donnée au démarrage du back-end sont normales. Elles disparaîtront une fois
> que la base de donnée sera démarrée et prête à l'utilisation.

----

Réalisé par Nathan JEANNOT • Étudiant en 3ème année à Epitech Rennes • Décembre 2025.
