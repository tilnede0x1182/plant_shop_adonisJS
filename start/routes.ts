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

// Plantes (public)
Route.resource('plants', 'PlantsController').only(['index', 'show'])

// Page d'accueil
Route.get('/', 'PlantsController.index').as('home')

// Routes nécessitant une authentification
Route.group(() => {
  // Profil personnel
  Route.resource('users', 'UsersController').only(['show', 'edit'])

	// Route Post pour update
	Route.post('/users/:id/update', 'UsersController.update').as('users.update')

  // Panier
  Route.resource('carts', 'CartsController').only(['index'])

  // Commandes - Routes explicites pour éviter les conflits
  Route.get('/orders', 'OrdersController.index').as('orders.index')
  Route.get('/orders/new', 'OrdersController.new').as('orders.new')
  Route.post('/orders', 'OrdersController.create').as('orders.create')
}).middleware('auth')

// Administration
Route.group(() => {
  // Plantes
  Route.resource('plants', 'Admin/PlantsController').except(['show', 'destroy', 'update'])

	// Route POST pour modification utilisateurs (update)
  Route.post('/users/:id/update', 'Admin/PlantsController.update').as('plants.update')

  // Route POST pour suppression plantes
  Route.post('/plants/:id/delete', 'Admin/PlantsController.destroy')
    .as('plants.destroy')

  // Utilisateurs
  Route.resource('users', 'Admin/UsersController').only(['index', 'show', 'edit'])

	// Route POST pour modification utilisateurs (update)
  Route.post('/users/:id/admin_update', 'Admin/UsersController.update').as('users.update')

  // Route POST pour suppression utilisateurs
  Route.post('/users/:id/delete', 'Admin/UsersController.destroy')
    .as('users.destroy')
})
  .prefix('admin')
  .as('admin')
  .middleware('auth')
