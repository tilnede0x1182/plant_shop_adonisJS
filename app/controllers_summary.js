# ./app/Controllers/Http/RegistrationsController.ts

// app/Controllers/Http/RegistrationsController.ts

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'

/**
 * Contrôleur d'inscription (register)
 */
export default class RegistrationsController {
	/**
	 * Affiche le formulaire d'inscription
	 */
	public async showRegisterForm({ view }: HttpContextContract) {
		return view.render('registrations/register')
	}

	/**
	 * Création du compte utilisateur
	 */
	public async register({ request, response, session, auth }: HttpContextContract) {
		const data = request.only(['name', 'email', 'password'])
		const utilisateur = new User()
		utilisateur.name = data.name
		utilisateur.email = data.email
		utilisateur.password = await Hash.make(data.password)
		await utilisateur.save()
		await auth.login(utilisateur)
		session.flash({ notification: 'Compte créé.' })
		return response.redirect().toRoute('plants.index')
	}
}

# ./app/Controllers/Http/OrdersController.ts

// app/Controllers/Http/OrdersController.ts

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Order from 'App/Models/Order'
import Plant from 'App/Models/Plant'
import OrderItem from 'App/Models/OrderItem'

/**
 * Contrôleur des commandes
 */
export default class OrdersController {
	/**
	 * Liste des commandes utilisateur
	 */
	public async index({ auth, view }: HttpContextContract) {
		const commandes = await Order.query()
			.where('user_id', auth.user!.id)
			.preload('orderItems', (query) => query.preload('plant'))
			.orderBy('created_at', 'desc')
		return view.render('orders/index', { commandes })
	}

	/**
	 * Page de confirmation commande (panier, logique JS côté client)
	 */
	public async new({ view }: HttpContextContract) {
		return view.render('orders/new')
	}

	/**
	 * Création de la commande (vérif stock, MAJ, gestion transaction)
	 */
	public async create({ request, auth, response, session }: HttpContextContract) {
		const items = JSON.parse(request.input('order.items', '[]'))
		let total = 0

		const trx = await Order.db.transaction()
		try {
			const commande = await Order.create({
				userId: auth.user!.id,
				status: 'confirmed',
				totalPrice: 0
			}, { client: trx })

			for (const item of items) {
				const plante = await Plant.findOrFail(item.plant_id, { client: trx })
				const quantite = parseInt(item.quantity)
				if (plante.stock < quantite) {
					throw new Error(`Stock insuffisant pour ${plante.name}`)
				}
				total += plante.price * quantite
				plante.stock -= quantite
				await plante.save({ client: trx })
				await OrderItem.create({
					orderId: commande.id,
					plantId: plante.id,
					quantity: quantite
				}, { client: trx })
			}
			commande.totalPrice = total
			await commande.save()
			await trx.commit()

			session.flash({ notification: 'Commande confirmée.' })
			return response.redirect().toRoute('orders.index')
		} catch (erreur) {
			await trx.rollback()
			session.flash({ error: erreur.message || "Erreur lors de la commande." })
			return response.redirect().toRoute('orders.new')
		}
	}
}

# ./app/Controllers/Http/Admin/UsersController.ts

// app/Controllers/Http/Admin/UsersController.ts

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

/**
 * Contrôleur d’administration des utilisateurs
 */
export default class UsersController {
	/**
	 * Liste tous les utilisateurs
	 */
	public async index({ view }: HttpContextContract) {
		const utilisateurs = await User.all()
		return view.render('admin/users/index', { utilisateurs })
	}

	/**
	 * Affiche le détail d’un utilisateur
	 */
	public async show({ params, view }: HttpContextContract) {
		const utilisateur = await User.findOrFail(params.id)
		return view.render('admin/users/show', { utilisateur })
	}

	/**
	 * Formulaire édition utilisateur
	 */
	public async edit({ params, view }: HttpContextContract) {
		const utilisateur = await User.findOrFail(params.id)
		return view.render('admin/users/edit', { utilisateur })
	}

	/**
	 * MAJ utilisateur
	 */
	public async update({ params, request, response, session }: HttpContextContract) {
		const utilisateur = await User.findOrFail(params.id)
		utilisateur.merge(request.only(['name', 'email', 'admin']))
		await utilisateur.save()
		session.flash({ notification: 'Utilisateur mis à jour.' })
		return response.redirect().toRoute('admin.users.index')
	}

	/**
	 * Suppression utilisateur
	 */
	public async destroy({ params, response, session }: HttpContextContract) {
		const utilisateur = await User.findOrFail(params.id)
		await utilisateur.delete()
		session.flash({ notification: 'Utilisateur supprimé.' })
		return response.redirect().toRoute('admin.users.index')
	}
}

# ./app/Controllers/Http/Admin/PlantsController.ts

// app/Controllers/Http/Admin/PlantsController.ts

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Plant from 'App/Models/Plant'

/**
 * Contrôleur d’administration des plantes
 */
export default class PlantsController {
	/**
	 * Liste toutes les plantes (admin)
	 */
	public async index({ view }: HttpContextContract) {
		const plantes = await Plant.all()
		return view.render('admin/plants/index', { plantes })
	}

	/**
	 * Formulaire création plante
	 */
	public async create({ view }: HttpContextContract) {
		return view.render('admin/plants/create')
	}

	/**
	 * Création plante
	 */
	public async store({ request, response, session }: HttpContextContract) {
		const data = request.only(['name', 'price', 'description', 'stock'])
		await Plant.create(data)
		session.flash({ notification: 'Plante créée.' })
		return response.redirect().toRoute('admin.plants.index')
	}

	/**
	 * Formulaire édition plante
	 */
	public async edit({ params, view }: HttpContextContract) {
		const plante = await Plant.findOrFail(params.id)
		return view.render('admin/plants/edit', { plante })
	}

	/**
	 * MAJ plante
	 */
	public async update({ params, request, response, session }: HttpContextContract) {
		const plante = await Plant.findOrFail(params.id)
		plante.merge(request.only(['name', 'price', 'description', 'stock']))
		await plante.save()
		session.flash({ notification: 'Plante modifiée.' })
		return response.redirect().toRoute('admin.plants.index')
	}

	/**
	 * Suppression plante
	 */
	public async destroy({ params, response, session }: HttpContextContract) {
		const plante = await Plant.findOrFail(params.id)
		await plante.delete()
		session.flash({ notification: 'Plante supprimée.' })
		return response.redirect().toRoute('admin.plants.index')
	}
}

# ./app/Controllers/Http/SessionsController.ts

// app/Controllers/Http/SessionsController.ts

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'

/**
 * Contrôleur de session (login/logout)
 */
export default class SessionsController {
	/**
	 * Affiche le formulaire de connexion
	 */
	public async showLoginForm({ view }: HttpContextContract) {
		return view.render('sessions/login')
	}

	/**
	 * Connexion utilisateur
	 */
	public async login({ request, response, auth, session }: HttpContextContract) {
		const { email, password } = request.only(['email', 'password'])
		const user = await User.query().where('email', email).first()
		if (!user || !(await Hash.verify(user.password, password))) {
			session.flash({ error: 'Identifiants invalides.' })
			return response.redirect().toRoute('login')
		}
		await auth.login(user)
		return response.redirect().toRoute('plants.index')
	}

	/**
	 * Déconnexion
	 */
	public async logout({ auth, response }: HttpContextContract) {
		await auth.logout()
		return response.redirect().toRoute('login')
	}
}

# ./app/Controllers/Http/CartsController.ts

// app/Controllers/Http/CartsController.ts

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/**
 * Contrôleur du panier (affichage seulement, logique JS côté client)
 */
export default class CartsController {
	/**
	 * Affiche la page panier
	 */
	public async index({ view }: HttpContextContract) {
		return view.render('carts/index')
	}
}

# ./app/Controllers/Http/UsersController.ts

// app/Controllers/Http/UsersController.ts

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

/**
 * Contrôleur des utilisateurs (profil personnel)
 */
export default class UsersController {
	/**
	 * Affiche le profil utilisateur
	 */
	public async show({ params, auth, response, view }: HttpContextContract) {
		const utilisateur = await User.findOrFail(params.id)
		// Autorisation : à adapter selon votre logique
		if (auth.user?.id !== utilisateur.id) {
			return response.unauthorized('Accès interdit.')
		}
		return view.render('users/show', { utilisateur })
	}

	/**
	 * Formulaire édition profil utilisateur
	 */
	public async edit({ params, auth, response, view }: HttpContextContract) {
		const utilisateur = await User.findOrFail(params.id)
		if (auth.user?.id !== utilisateur.id) {
			return response.unauthorized('Accès interdit.')
		}
		return view.render('users/edit', { utilisateur })
	}

	/**
	 * Met à jour le profil utilisateur
	 */
	public async update({ params, request, auth, response, session }: HttpContextContract) {
		const utilisateur = await User.findOrFail(params.id)
		if (auth.user?.id !== utilisateur.id) {
			return response.unauthorized('Accès interdit.')
		}
		utilisateur.merge(request.only(['name', 'email']))
		await utilisateur.save()
		session.flash({ notification: 'Profil mis à jour.' })
		return response.redirect().toRoute('users.show', { id: utilisateur.id })
	}
}

# ./app/Controllers/Http/PlantsController.ts

// app/Controllers/Http/PlantsController.ts

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Plant from 'App/Models/Plant'

/**
 * Contrôleur public des plantes
 */
export default class PlantsController {
	/**
	 * Liste des plantes en stock (stock >= 1)
	 */
	public async index({ view }: HttpContextContract) {
		const plantes = await Plant.query().where('stock', '>=', 1).orderBy('name', 'asc')
		return view.render('plants/index', { plantes })
	}

	/**
	 * Affiche une plante
	 */
	public async show({ params, view }: HttpContextContract) {
		const plante = await Plant.findOrFail(params.id)
		return view.render('plants/show', { plante })
	}
}

