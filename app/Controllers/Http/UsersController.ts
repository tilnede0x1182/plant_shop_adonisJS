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
