import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  hasOne,
  HasOne,
  hasMany,
  HasMany
} from '@ioc:Adonis/Lucid/Orm'

import Profile from 'App/Models/Profile'
import Venue from 'App/Models/Venue'
import Booking from 'App/Models/Booking'
/**
 * 
 * @swagger 
 * definitions:
 *  User:
 *    type: object
 *    properties:
 *      id:
 *        type: integer
 *      name:
 *        type: string
 *      email:
 *        type: string
 *      password:
 *        type: string
 *      rememberMeToken:
 *        type: string
 *      role:
 *        type: string
 *      createdAt:
 *        type: dateTime
 *      updatedAt:
 *        type: dateTime
 *    required:
 *      - email
 *      - password
 */
export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken?: string

  @column()
  public role: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @hasOne(() => Profile)
  public profile: HasOne<typeof Profile>

  @hasMany(() => Venue)
  public venues: HasMany<typeof Venue>

  @hasMany(() => Booking)
  public bookings: HasMany<typeof Booking>
  
}
