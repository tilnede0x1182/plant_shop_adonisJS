import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import OrderItem from './OrderItem'

export default class Plant extends BaseModel {
	@column({ isPrimary: true })
	public id: number

	@column()
	public name: string

	@column()
	public price: number

	@column()
	public description: string

	@column()
	public stock: number

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime

	@hasMany(() => OrderItem)
	public orderItems: HasMany<typeof OrderItem>
}
