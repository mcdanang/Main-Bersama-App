import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'

import User from 'App/Models/User'
import Venue from 'App/Models/Venue'
import Field from 'App/Models/Field'

export default class Booking extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public fieldId: number

  @column()
  public play_date_start: DateTime

  @column()
  public play_date_end: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public userId: number

  @manyToMany(() => User)
  public users: ManyToMany<typeof User>

 
}
