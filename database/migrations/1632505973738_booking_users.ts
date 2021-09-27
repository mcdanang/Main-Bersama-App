import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class BookingUser extends BaseSchema {
  protected tableName = 'booking_user'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('users.id')
      table.integer('booking_id').unsigned().references('bookings.id')
      table.unique(['user_id', 'booking_id'])
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
