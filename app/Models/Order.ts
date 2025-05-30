import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import OrderItem from './OrderItem'

export default class Order extends BaseModel {
	@column({ isPrimary: true })
	public id: number

	@column()
	public userId: number

	@column()
	public totalPrice: number

	@column()
	public status: string

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime

	@belongsTo(() => User)
	public user: BelongsTo<typeof User>

	@hasMany(() => OrderItem)
	public orderItems: HasMany<typeof OrderItem>
}
