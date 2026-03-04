# RAPPORT D'ANALYSE DES DUPLICATIONS DE CODE (Principe DRY)

## Introduction
Projet : `plant_shop_adonisJS` (AdonisJS 6 + Lucid). DRY impose de centraliser les règles métiers (profil, commandes, seed, etc.).

---

## Violations DRY

### 1. Contrôles d’autorisation copiés 3 fois dans `UsersController` - 🟠 Haute
Les méthodes `show`, `edit` et `update` répètent exactement le même bloc « charger l’utilisateur → vérifier `auth.user?.id !== utilisateur.id` → `unauthorized` » (lignes 13-44 de `app/Controllers/Http/UsersController.ts`). Une politique ou un middleware Owner éviterait ce copier/coller et garantirait que toute évolution (ex. permettre aux admins) se fasse en un seul endroit.

### 2. Mise à jour de profil dupliquée entre contrôleurs public et admin - 🟠 Haute
`UsersController.update` (profil) et `Admin/UsersController.update` réalisent les mêmes opérations : `User.findOrFail`, `merge` des champs `name/email`, sauvegarde + flash message (cf. lignes 36-44 et 37-44). La version admin ajoute seulement le toggle `admin`. **Solution** : créer un `UserService.update(userId, payload, options)` qui applique les champs communs puis, si `options.canEditRole`, gère la promotion admin. On supprime ainsi deux implémentations divergentes.

### 3. Logique de création de commande recopiée entre HTTP et seed - 🟠 Haute
Le contrôleur `OrdersController.create` (lignes 34-71) et la fonction `createOrders` du seeder (`database/seeders/Seed.ts` lignes 116-139) effectuent la même boucle : sélectionner des plantes, contrôler le stock, décrémenter, calculer `total` et créer des `OrderItem`. Toute règle (nouveau statut, arrondi, gestion des ruptures) doit donc être modifiée dans deux fichiers. **Action** : extraire une fonction commune (ex. `OrderService.createOrder(userId, items, client?)`) utilisée par le contrôleur et par le seeder (avec un client de transaction facultatif).

---

## Impact estimé

| Refactoring proposé                                    | Lignes supprimées | Complexité |
|--------------------------------------------------------|-------------------|------------|
| Middleware/policy Owner pour les contrôleurs profils   | ~30               | Faible     |
| Service partagé pour la mise à jour d’un utilisateur   | ~40               | Faible     |
| Service `OrderService` réutilisé par HTTP + seed       | ~60               | Moyenne    |

---

## Conclusion
Les répétitions actuelles concernent surtout les règles métier (autorisations user, mise à jour de profil, création de commandes). Sans factorisation dans des services/policies, toute évolution devra être appliquée plusieurs fois, ce qui viole le principe DRY imposé au projet.***
