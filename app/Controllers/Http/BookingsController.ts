import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import{ BookValidator } from 'App/Validators/VenueValidator'
// import Database from '@ioc:Adonis/Lucid/Database'

//models
// import Venue from 'App/Models/Venue'
import User from 'App/Models/User'
import Booking from 'App/Models/Booking'
import Database from '@ioc:Adonis/Lucid/Database';

interface UserInterface {
    name: string
}

export default class BookingsController {
    /**
     * 
     * @swagger 
     * /fields/{id}/bookings:
     *  post:
     *      security:
     *          - bearerAuth: []
     *      tags:
     *          - Booking
     *      summary: Membuat jadwal booking di field untuk tanggal tertentu 
     *      parameters:
     *          - name: id
     *            in: path
     *            required: true
     *            description: Field ID
     *            schema:
     *              type: integer
     *      requestBody:
     *          required: true
     *          content:
     *              application/x-www-form-urlencoded:
     *                  schema:
     *                      type: object
     *                      properties:
     *                          play_date_start:
     *                              type: dateTime
     *                          play_date_end:
     *                              type: dateTime
     *                          users:
     *                              type: string
     *                      required:
     *                          - play_date_start
     *                          - play_date_end
     *                          - users
     *      responses:
     *          201:
     *              description: berhasil booking!
     *          401:
     *              description: Unauthorized
     *          400:
     *              description: Bad request
     */
    public async store({request, response, params, auth}: HttpContextContract) {
        try {

            await request.validate(BookValidator);

            let newBooking = new Booking();
            newBooking.play_date_start = request.input('play_date_start')
            newBooking.play_date_end = request.input('play_date_end')
            newBooking.fieldId = params.id
            // await newBooking.save()

            if (newBooking.play_date_end <= newBooking.play_date_start) {
                return response.badRequest({errors: "play_date_end harus lebih besar dari play_date_start"})
            }

            let booking = await Booking.query().where('field_id', params.id).select('*')

            let start = Date.parse(newBooking.play_date_start.toString());
            let end = Date.parse(newBooking.play_date_end.toString());
            console.log(start)
            console.log(end)

            booking.forEach((item) => {
                // console.log(item.id)
                // console.log(Date.parse(item.play_date_start.toString()))
                
                let itemStart = Date.parse(item.play_date_start.toString()) + 7 * 60 * 60 * 1000
                let itemEnd = Date.parse(item.play_date_end.toString()) + 7 * 60 * 60 * 1000
                // console.log(item.id)
                // console.log(itemStart)
                // console.log(itemEnd)

                // console.log(start <= itemEnd)
                // console.log(end >= itemStart)
                if(
                    start < itemEnd &&
                    end > itemStart
                )
                {
                    // console.log('test')
                    throw new Error ("booking gagal. jadwal sudah terisi")
                    // return response.badRequest({errors: "booking gagal. jadwal sudah terisi"})
                }
            })
            

            let arrUser: string[] = request.input('users').split(',')
            let users: UserInterface[] = arrUser.map(el => { return {name: el } })

            let newUsers = await User.fetchOrCreateMany('name', users)
            let userIds: number[] = newUsers.map(user => user.id)
            const authUser = auth.user
            await authUser?.related('bookings').save(newBooking)
            await newBooking.related('users').sync(userIds)

            response.created({message: 'berhasil booking!', newId: newBooking.id })
            
        } catch (error) {
            if (error.messages) {
                response.badRequest({errors: error.messages})
                
            } 
            
            else if (error.message) {
                response.badRequest({errors: error.message})
            }

            else {
                response.badRequest({errors: "field tidak ada. Booking gagal dilakukan"})
            }
        }
    }

    /**
     * 
     * @swagger 
     * /bookings/{id}:
     *  get:
     *      security:
     *          - bearerAuth: []
     *      tags:
     *          - Booking
     *      summary: Menampilkan detail booking dengan id tertentu beseta list pemain yang sudah mendaftar.
     *      parameters:
     *          - name: id
     *            in: path
     *            required: true
     *            description: Booking ID
     *            schema:
     *              type: integer
     *      responses:
     *          200:
     *              description: berhasil get data booking by id
     *          401:
     *              description: Unauthorized
     */
    public async show({ params, response}: HttpContextContract) {
        const booking = await Booking.query().preload('users').where('id', params.id).first()

        return response.ok({ message: 'berhasil get data booking by id', data: booking })
    }

    /**
 * 
 * @swagger 
 * /bookings:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Booking
 *      summary: Menampilkan list booking semuanya
 *      responses:
 *          200:
 *              description: berhasil get data bookings
 *          401:
 *              description: Unauthorized
 */
        public async index({ response}: HttpContextContract) {
        const booking = await Booking.query()

        return response.ok({ message: 'berhasil get data booking', data: booking })
    }

    /**
     * 
     * @swagger 
     * /bookings/{id}/join:
     *  put:
     *      security:
     *          - bearerAuth: []
     *      tags:
     *          - Booking
     *      summary: Mendaftarkan diri untuk jadwal booking tertentu
     *      parameters:
     *          - name: id
     *            in: path
     *            required: true
     *            description: Booking ID
     *            schema:
     *              type: integer
     *      responses:
     *          200:
     *              description: berhasil join booking
     *          401:
     *              description: Unauthorized
     */
    public async update({ params, response, auth}: HttpContextContract) {
        // let booking = await Booking.findOrFail(params.id)
        
        // // const booking = await Booking.query().preload('users').where('id', params.id).first()

        // let arrUser: string[] = request.input('users').split(',')
        // let users: UserInterface[] = arrUser.map(el => { return {name: el } })

        // let newUsers = await User.fetchOrCreateMany('name', users)
        // let userIds: number[] = newUsers.map(user => user.id)

        // await booking?.related('users').sync(userIds)
        // await booking?.save()

        // return response.ok({ message: 'berhasil join booking' })
        console.log(auth.user?.id)
        const user = await User.find(auth.user?.id)
        const booking = await Booking.find(params.id)

        if (user?.id == undefined) {
            return response.unauthorized({errors: "User invalid"})
        }

        await booking?.related('users').attach([user.id])
        return response.ok({ message: 'berhasil join booking' })
    }

    /**
     * 
     * @swagger 
     * /bookings/{id}/unjoin:
     *  put:
     *      security:
     *          - bearerAuth: []
     *      tags:
     *          - Booking
     *      summary: Tidak jadi mengikuti jadwal booking tertentu
     *      parameters:
     *          - name: id
     *            in: path
     *            required: true
     *            description: Booking ID
     *            schema:
     *              type: integer
     *      responses:
     *          200:
     *              description: berhasil unjoin booking
     *          401:
     *              description: Unauthorized
     */
     public async unjoin({ params, response, auth}: HttpContextContract) {
        
        const user = await User.find(auth.user?.id)
        const booking = await Booking.find(params.id)

        if (user?.id == undefined) {
            return response.unauthorized({errors: "User invalid"})
        }

        await booking?.related('users').detach([user.id])
        return response.ok({ message: 'berhasil unjoin booking' })
    }

       /**
     * 
     * @swagger 
     * /schedules:
     *  get:
     *      security:
     *          - bearerAuth: []
     *      tags:
     *          - Booking
     *      summary: Menampilkan list booking yang diikuti oleh user yang sedang melakukan login
     *      responses:
     *          200:
     *              description: berhasil get data booking by user yang sedang melakukan login
     *          401:
     *              description: Unauthorized
     *          404:
     *              description: Not Found
     */
    public async schedules({auth, response}: HttpContextContract) {
        if(auth && auth.user) {
            const booking = await Database
            .from('bookings')
            .join('booking_user', 'bookings.id', '=', 'booking_user.booking_id')
            .select('bookings.*')
            .where('booking_user.user_id', auth.user.id)
            // from('booking_user').where('user_id', auth.user.id)
    
            return response.ok({ message: 'berhasil get data booking by user yang sedang melakukan login', data: booking })

        }

        return response.unauthorized
    }
}
