// database/seeders/Seed.ts

/**
	Seed principale du projet PlantShop
	- NB_ADMINS administrateurs (email : adminX@planteshop.com, password : 'password')
	- NB_USERS utilisateurs (email/password aléatoires, longueur ≥12)
	- 30 plantes créées
	- Génération de commandes (2 plantes par utilisateur)
	- users.txt mis à jour avec tous les identifiants générés
*/

import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import Plant from 'App/Models/Plant'
import Order from 'App/Models/Order'
import OrderItem from 'App/Models/OrderItem'
import * as fs from 'fs'
import * as path from 'path'
import { faker } from '@faker-js/faker'

/**
	Réinitialise toutes les données
*/
async function resetData() {
	await OrderItem.query().delete()
	await Order.query().delete()
	await Plant.query().delete()
	await User.query().delete()
}

/**
	Crée les administrateurs
	@return tableau d'admins (utilisé pour users.txt)
*/
async function createAdmins(nombreAdmins: number) {
	const admins = []
	for (let index = 0; index < nombreAdmins; index++) {
		const password = 'password'
		const admin = await User.create({
			email: `admin${index + 1}@planteshop.com`,
			password: password,
			admin: true,
			name: faker.person.fullName()
		})
		admins.push({ email: admin.email, password })
	}
	return admins
}

/**
	Crée les utilisateurs
	@return tableau d'utilisateurs (utilisé pour users.txt)
*/
async function createUsers(nombreUsers: number) {
	const users = []
	for (let index = 0; index < nombreUsers; index++) {
		const password = faker.internet.password({ length: 12 })
		const user = await User.create({
			email: faker.internet.email(),
			password: password,
			admin: false,
			name: faker.person.fullName()
		})
		users.push({ email: user.email, password })
	}
	return users
}

/**
	Crée les plantes (NB_PLANTES)
	@return tableau de plantes
*/
async function createPlants(nombrePlantes: number) {
	const nomsPlantes = [
		"Rose", "Tulipe", "Lavande", "Orchidée", "Basilic", "Menthe", "Pivoine", "Tournesol",
		"Cactus (Echinopsis)", "Bambou", "Camomille (Matricaria recutita)", "Sauge (Salvia officinalis)",
		"Romarin (Rosmarinus officinalis)", "Thym (Thymus vulgaris)", "Laurier-rose (Nerium oleander)",
		"Aloe vera", "Jasmin (Jasminum officinale)", "Hortensia (Hydrangea macrophylla)",
		"Marguerite (Leucanthemum vulgare)", "Géranium (Pelargonium graveolens)", "Fuchsia (Fuchsia magellanica)",
		"Anémone (Anemone coronaria)", "Azalée (Rhododendron simsii)", "Chrysanthème (Chrysanthemum morifolium)",
		"Digitale pourpre (Digitalis purpurea)", "Glaïeul (Gladiolus hortulanus)", "Lys (Lilium candidum)",
		"Violette (Viola odorata)", "Muguet (Convallaria majalis)", "Iris (Iris germanica)",
		"Lavandin (Lavandula intermedia)", "Érable du Japon (Acer palmatum)", "Citronnelle (Cymbopogon citratus)",
		"Pin parasol (Pinus pinea)", "Cyprès (Cupressus sempervirens)", "Olivier (Olea europaea)",
		"Papyrus (Cyperus papyrus)", "Figuier (Ficus carica)", "Eucalyptus (Eucalyptus globulus)",
		"Acacia (Acacia dealbata)", "Bégonia (Begonia semperflorens)", "Calathea (Calathea ornata)",
		"Dieffenbachia (Dieffenbachia seguine)", "Ficus elastica", "Sansevieria (Sansevieria trifasciata)",
		"Philodendron (Philodendron scandens)", "Yucca (Yucca elephantipes)", "Zamioculcas zamiifolia",
		"Monstera deliciosa", "Pothos (Epipremnum aureum)", "Agave (Agave americana)", "Cactus raquette (Opuntia ficus-indica)",
		"Palmier-dattier (Phoenix dactylifera)", "Amaryllis (Hippeastrum hybridum)", "Bleuet (Centaurea cyanus)",
		"Cœur-de-Marie (Lamprocapnos spectabilis)", "Croton (Codiaeum variegatum)", "Dracaena (Dracaena marginata)",
		"Hosta (Hosta plantaginea)", "Lierre (Hedera helix)", "Mimosa (Acacia dealbata)"
	]
	const plants = []
	const nomsTaille = nomsPlantes.length
	for (let index = 0; index < nombrePlantes; index++) {
		const nomBase = nomsPlantes[index % nomsTaille]
		const nom = nombrePlantes > nomsTaille ? `${nomBase} ${Math.floor(index / nomsTaille) + 1}` : nomBase
		const plant = await Plant.create({
			name: nom,
			price: faker.number.int({ min: 5, max: 50 }),
			description: faker.lorem.sentence({ min: 10, max: 14 }),
			stock: faker.number.int({ min: 5, max: 30 })
		})
		plants.push(plant)
	}
	return plants
}

/**
	Crée les commandes (2 plantes par user)
*/
async function createOrders(users, plants) {
	for (const user of await User.all()) {
		let total = 0
		const order = await Order.create({
			userId: user.id,
			totalPrice: 0,
			status: faker.helpers.arrayElement(['confirmed', 'pending', 'shipped', 'delivered'])
		})
		for (let i = 0; i < 2; i++) {
			const plant = plants[Math.floor(Math.random() * plants.length)]
			const quantity = Math.min(faker.number.int({ min: 1, max: 5 }), plant.stock)
			if (quantity === 0) continue
			await OrderItem.create({
				orderId: order.id,
				plantId: plant.id,
				quantity: quantity
			})
			total += plant.price * quantity
			plant.stock = plant.stock - quantity
			await plant.save()
		}
		order.totalPrice = total
		await order.save()
	}
}

/**
	Écrit les utilisateurs/admins dans users.txt
*/
function writeUsersFile(admins, users) {
	const filePath = path.join(process.cwd(), 'users.txt')
	let content = 'Administrateurs :\n\n'
	admins.forEach(admin => { content += `${admin.email} ${admin.password}\n` })
	content += '\nUtilisateurs :\n\n'
	users.forEach(user => { content += `${user.email} ${user.password}\n` })
	fs.writeFileSync(filePath, content, 'utf8')
}

export default class Seed extends BaseSeeder {
	public async run() {
		const NB_ADMINS = 3
		const NB_USERS = 20
		const NB_PLANTES = 30

		await resetData()
		const admins = await createAdmins(NB_ADMINS)
		const users = await createUsers(NB_USERS)
		const plants = await createPlants(NB_PLANTES)
		writeUsersFile(admins, users)
		await createOrders([...admins, ...users], plants)

		console.log('✅ Seed terminée. Données en base et fichier `users.txt` mis à jour.')
	}
}
