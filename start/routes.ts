/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/
import Route from '@ioc:Adonis/Core/Route'

// Authentification (à implémenter via package, ex : @adonisjs/auth)
Route.get('/login', 'SessionsController.showLoginForm')
Route.post('/login', 'SessionsController.login')
Route.post('/logout', 'SessionsController.logout')
Route.get('/register', 'RegistrationsController.showRegisterForm')
Route.post('/register', 'RegistrationsController.register')

// Utilisateurs (profil personnel)
Route.resource('users', 'UsersController').only(['show', 'edit', 'update'])

// Plantes (public)
Route.resource('plants', 'PlantsController').only(['index', 'show'])

// Panier (juste index, création, suppression, à ignorer si géré 100% JS)
Route.resource('carts', 'CartsController').only(['index', 'create', 'destroy'])

// Commandes
Route.resource('orders', 'OrdersController').only(['index', 'new', 'create'])

// Admin
Route.group(() => {
	Route.resource('plants', 'Admin/PlantsController').except(['show'])
	Route.resource('users', 'Admin/UsersController').only(['index', 'edit', 'show', 'update', 'destroy'])
}).prefix('/admin')

// Page d'accueil
Route.get('/', 'PlantsController.index')
