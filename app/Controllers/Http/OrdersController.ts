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
