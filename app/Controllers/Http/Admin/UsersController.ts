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
		const utilisateurs = await User.query().orderBy('admin', 'desc').orderBy('name', 'asc')
		return view.render('admin/users/index', { utilisateurs: utilisateurs })
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
