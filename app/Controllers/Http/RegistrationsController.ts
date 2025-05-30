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
