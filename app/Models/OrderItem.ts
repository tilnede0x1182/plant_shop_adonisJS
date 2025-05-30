import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Order from './Order'
import Plant from './Plant'

export default class OrderItem extends BaseModel {
	@column({ isPrimary: true })
	public id: number

	@column()
	public orderId: number

	@column()
	public plantId: number

	@column()
	public quantity: number

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime

	@belongsTo(() => Order)
	public order: BelongsTo<typeof Order>

	@belongsTo(() => Plant)
	public plant: BelongsTo<typeof Plant>
}
