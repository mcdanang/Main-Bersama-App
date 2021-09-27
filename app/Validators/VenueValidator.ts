import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class CreateVenueValidator {
  constructor (protected ctx: HttpContextContract) {
  }

	/*
	 * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
	 *
	 * For example:
	 * 1. The username must be of data type string. But then also, it should
	 *    not contain special characters or numbers.
	 *    ```
	 *     schema.string({}, [ rules.alpha() ])
	 *    ```
	 *
	 * 2. The email must be of data type string, formatted as a valid
	 *    email. But also, not used by any other user.
	 *    ```
	 *     schema.string({}, [
	 *       rules.email(),
	 *       rules.unique({ table: 'users', column: 'email' }),
	 *     ])
	 *    ```
	 */
  public schema = schema.create({
	name: schema.string({}, [
		rules.alpha({
			allow: ['space']
		}),
		rules.minLength(5)
	]),
	address: schema.string({}, [
		rules.minLength(5)
	]),
	phone: schema.string({}, [
		rules.mobile()
	])
})

	/**
	 * Custom messages for validation failures. You can make use of dot notation `(.)`
	 * for targeting nested fields and array expressions `(*)` for targeting all
	 * children of an array. For example:
	 *
	 * {
	 *   'profile.username.required': 'Username is required',
	 *   'scores.*.number': 'Define scores as valid numbers'
	 * }
	 *
	 */
  public messages = {
	  'required': 'the {{field}} is required to create new venue',
	  'name.alpha': 'the {{field}} must be characters without number and symbols',
	  'phone.mobile': 'number is invalid'
  }
}


export class BookValidator {
	constructor (protected ctx: HttpContextContract) {
	}
  
	
	public schema = schema.create({
	  play_date_start: schema.date({}, [
		  rules.after('today')
	  ])
  })
  

	public messages = {
		'required': 'the {{field}} is required to create new venue',
		'name.alpha': 'the {{field}} must be characters without number and symbols',
		'bookedTime.after': 'tidak dapat diproses. minimal booking 1 hari sebelum'
	}
}

export class FieldValidator {
	constructor (protected ctx: HttpContextContract) {
	}
  
	
	public schema = schema.create({
	  name: schema.string({}, [
		  rules.alpha({
			  allow: ['space']
		  }),
		  rules.minLength(5)
	  ]),
	  type: schema.enum(['futsal', 'mini soccer', 'basketball']),
	//   venue_id: schema.number()
  })
  

	public messages = {
		'required': 'the {{field}} is required to create new venue',
		'name.alpha': 'the {{field}} must be characters without number and symbols',
		'bookedTime.after': 'tidak dapat diproses. minimal booking 1 hari sebelum'
	}
}
