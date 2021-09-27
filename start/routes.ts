/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

Route.get('/', async () => {
  return { hello: 'world' }
}).as('home')

// Route.get('/testing/:b', async ({params, request, response}: HttpContextContract) => {
//   let a:number = 12
//   console.log(request.qs())
  
//   console.log(request.param('b'))

//   return { test: "testing venue-app", total: a + parseInt(params.b) }
// }).as('testing')

Route.resource('venues', 'VenuesController').apiOnly().middleware({'*': ['auth', 'verify:admin,venue_owner']})

Route.resource('venues.fields', 'FieldsController').apiOnly().middleware({'*': ['auth', 'verify:admin,venue_owner']})

Route.post('/register', 'AuthController.register').as('auth.register')
Route.post('/login', 'AuthController.login').as('auth.login')
Route.post('/verifikasi-otp', 'AuthController.otpVerification').as('auth.otpVerify')

Route.post('/fields/:id/bookings', 'BookingsController.store').as('bookings.store').middleware(['auth', 'verify:admin,user'])
Route.get('/fields/:id', 'FieldsController.show').as('fields.show').middleware(['auth', 'verify:admin,venue_owner,user'])

Route.post('/profiles', 'ProfilesController.store').as('profiles.strore').middleware(['auth', 'verify:admin,venue_owner,user'])

Route.get('/bookings', 'BookingsController.index').as('bookings.index').middleware(['auth', 'verify:admin,venue_owner,user'])
Route.get('/bookings/:id', 'BookingsController.show').as('bookings.show').middleware(['auth', 'verify:admin,venue_owner,user'])
Route.put('/bookings/:id/join', 'BookingsController.update').as('bookings.update').middleware(['auth', 'verify:admin,user'])
Route.put('/bookings/:id/unjoin', 'BookingsController.unjoin').as('bookings.unjoin').middleware(['auth', 'verify:admin,user'])
Route.get('/schedules', 'BookingsController.schedules').as('bookings.schedules').middleware(['auth', 'verify:admin,user'])