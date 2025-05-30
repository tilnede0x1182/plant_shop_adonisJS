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
