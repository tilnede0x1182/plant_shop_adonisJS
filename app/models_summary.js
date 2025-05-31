# ./app/Models/User.ts

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

# ./app/Models/Order.ts

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

# ./app/Models/OrderItem.ts

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

# ./app/Models/Plant.ts

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

