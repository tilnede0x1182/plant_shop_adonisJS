import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Order from './Order'

export default class User extends BaseModel {
	@column({ isPrimary: true })
	public id: number

	@column()
	public email: string

	@column()
	public password: string

	@column()
	public admin: boolean

	@column()
	public name: string

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime

	@hasMany(() => Order)
	public orders: HasMany<typeof Order>
}
