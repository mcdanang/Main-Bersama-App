import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Fields extends BaseSchema {
  protected tableName = 'fields'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.enu('type', ['futsal', 'mini soccer', 'basketball']).notNullable()     

      table.integer('venue_id').unsigned().references('venues.id').onDelete('CASCADE')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
       table.timestamps(true, true)
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropForeign('venue_id')
      table.dropColumn('venue_id')
    })
    this.schema.dropTable(this.tableName)
  }
}
