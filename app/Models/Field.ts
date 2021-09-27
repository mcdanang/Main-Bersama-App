import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Venue from 'App/Models/Venue'
import Booking from 'App/Models/Booking'

enum FieldType {
  Futsal = 'futsal',
  MiniSoccer = 'mini soccer',
  Basketball = 'basketball '
}

export default class Field extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string
 
  @column()
  public type: FieldType

  @column()
  public venueId: number

  @belongsTo(() => Venue)
  public venue: BelongsTo<typeof Venue>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Booking)
  public bookings: HasMany<typeof Booking>

  
  
}
