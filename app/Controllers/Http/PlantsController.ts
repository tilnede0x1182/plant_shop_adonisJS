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
