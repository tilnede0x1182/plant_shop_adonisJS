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
			return response.redirect().toRoute('login.perform')
		}
		await auth.login(user)
		return response.redirect().toRoute('plants.index')
	}

	/**
	 * Déconnexion
	 */
	public async logout({ auth, response }: HttpContextContract) {
		await auth.logout()
		return response.redirect().toRoute('logout')
	}
}
