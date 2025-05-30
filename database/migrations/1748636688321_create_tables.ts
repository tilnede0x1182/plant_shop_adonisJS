import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
	async up () {
		this.schema.createTable('users', (table) => {
			table.increments('id')
			table.string('email').notNullable().unique()
			table.string('password').notNullable()
			table.boolean('admin').defaultTo(false)
			table.string('name')
			table.timestamps(true)
		})

		this.schema.createTable('plants', (table) => {
			table.increments('id')
			table.string('name')
			table.integer('price')
			table.text('description')
			table.integer('stock')
			table.timestamps(true)
		})

		this.schema.createTable('orders', (table) => {
			table.increments('id')
			table.integer('user_id').unsigned().references('id').inTable('users')
			table.integer('total_price')
			table.string('status')
			table.timestamps(true)
		})

		this.schema.createTable('order_items', (table) => {
			table.increments('id')
			table.integer('order_id').unsigned().references('id').inTable('orders')
			table.integer('plant_id').unsigned().references('id').inTable('plants')
			table.integer('quantity')
			table.timestamps(true)
		})
	}

	async down () {
		this.schema.dropTable('order_items')
		this.schema.dropTable('orders')
		this.schema.dropTable('plants')
		this.schema.dropTable('users')
	}
}
