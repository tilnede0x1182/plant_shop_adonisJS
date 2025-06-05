# 🌿 PlantShop - E-commerce Botanique (AdonisJS 5)

Application complète de vente de plantes développée avec AdonisJS 5.
Elle propose une interface publique pour les utilisateurs et un espace d'administration sécurisé pour la gestion des plantes et des comptes.

---

## 🛠 Stack Technique

### Backend

- **Langage** : TypeScript (Node.js)
- **Framework** : AdonisJS 5.9.x
- **Base de données** : SQLite3 (par défaut) / PostgreSQL
- **ORM** : Lucid ORM (intégré à AdonisJS)
- **Authentification** : AdonisJS Auth
- **Hashing mot de passe** : Scrypt (configuré par défaut)
- **Seed / Fake data** : Faker

### Frontend

- **Templates** : Edge (AdonisJS)
- **UI/UX** : Bootstrap 5.3.2 (via CDN)
- **JS dynamique** : JavaScript Vanilla
- **Cart** : localStorage client-side

---

## ✨ Fonctionnalités

### Client

- Catalogue des plantes
- Fiche produit
- Panier local (localStorage)
- Validation et historique des commandes
- Profil utilisateur (édition)

### Administrateur

- Gestion des plantes (CRUD)
- Gestion des utilisateurs (CRUD, rôle admin)
- Espace admin dédié
- Protection des routes admin

### Sécurité

- Authentification avec sessions
- Rôles utilisateur (USER / ADMIN)
- Protection CSRF et vérifications des accès

---

## 🚀 Installation et lancement

### Prérequis

- Node.js ≥ 16

### Étapes

```bash
git clone <url_du_repo>
cd plant_shop_adonisJS
npm install

# Copier le fichier d'environnement
# Linux/macOS :
cp .env.example .env
# Windows :
copy .env.example .env

# Générer la clé d'application
node ace generate:key

# Lancer les migrations et le seeding
node ace migration:run
node ace db:seed

# Démarrer l'application
npm run dev
