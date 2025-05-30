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
