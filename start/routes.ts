/**
 * start/routes.ts
 *
 * Here you can register HTTP routes for your application.
 * While building, ensure you include the import below.
 */

import Route from '@ioc:Adonis/Core/Route'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/

// Authentification
Route.get('/login', 'SessionsController.showLoginForm').as('login.show')
Route.post('/login', 'SessionsController.login').as('login.perform')
Route.post('/logout', 'SessionsController.logout').as('logout')

// Inscription
Route.get('/register', 'RegistrationsController.showRegisterForm').as('register.show')
Route.post('/register', 'RegistrationsController.register').as('register.perform')

// Profil personnel
Route.resource('users', 'UsersController')
  .only(['show', 'edit', 'update'])

// Plantes (public)
Route.resource('plants', 'PlantsController')
  .only(['index', 'show'])

// Panier
Route.resource('carts', 'CartsController')
  .only(['index', 'create', 'destroy'])

// Commandes
Route.resource('orders', 'OrdersController')
  .only(['index', 'create'])

// Administration
Route.group(() => {
  Route.resource('plants', 'Admin/PlantsController')
    .except(['show'])
  Route.resource('users', 'Admin/UsersController')
    .only(['index', 'show', 'edit', 'update', 'destroy'])
})
  .prefix('/admin')
  .as('admin')

// Page d’accueil
Route.get('/', 'PlantsController.index').as('home')
