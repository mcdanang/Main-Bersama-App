import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.table(this.tableName, (table) => {
      table.enu('role', ['user', 'venue_owner', 'admin']).defaultTo('user') 
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('role')
    })
  }
}
