#  DataDash - Dashboard Météo Interactif

**DataDash** est une application web interactive permettant de consulter la météo en temps réel ainsi que les prévisions sur 5 jours pour n'importe quelle ville dans le monde. Ce projet a été réalisé dans le cadre de la formation chez **Akieni Academy**.

---

##  Fonctionnalités

### 🔹 Niveau 1 : Les Fondamentaux
* **Données en temps réel** : Appel à l'API OpenWeatherMap pour récupérer les métriques actuelles (température, humidité, description, icône).
* **Affichage par défaut** : Chargement automatique des données pour la ville par défaut (`Brazzaville`).
* **Layout Responsive** : Interface structurée en grille CSS (`CSS Grid`) et conteneurs flexibles (`Flexbox`).

### 🔹 Niveau 2 : L'Interactivité & Algorithmique
* **Moteur de recherche** : Mise à jour dynamique de tout le dashboard lors de la recherche d'une nouvelle ville.
* **Formatage des données** : 
  * Arrondi des températures au degré près.
  * Conversion des timestamps UNIX en heure locale au format lisible (`HH:MM`).

### 🔹 Niveau 3 : Prévisions & Persistance
* **Prévisions sur 5 jours** : Extraction et affichage des températures et conditions météo pour les jours à venir.
* **Historique de recherche (localStorage)** :
  * Sauvegarde automatique des 5 dernières villes recherchées.
  * Affichage sous forme de tags cliquables pour relancer une recherche rapidement.

---

##  Technologies Utilisées

* **HTML5** : Structure sémantique du document.
* **CSS3** : Design moderne, variables CSS, animations légères, CSS Grid & Flexbox.
* **JavaScript (ES6+)** : Manipulation du DOM, gestion de l'asynchronisme (`Fetch API`, `async/await`), stockage local (`localStorage`).
* **API externe** : [OpenWeatherMap API](https://openweathermap.org/api).

---

##  Structure du Projet

```text
datadash/
│
├── index.html     # Structure HTML du dashboard
├── style.css      # Styles CSS et mise en page réactive
├── script.js     # Logique JS (API, DOM, localStorage)
└── README.md      # Documentation du projet