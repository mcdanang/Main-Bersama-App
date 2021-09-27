import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import{ CreateVenueValidator, BookValidator } from 'App/Validators/VenueValidator'
//import Database from '@ioc:Adonis/Lucid/Database'

//models
import Venue from 'App/Models/Venue'
import User from 'App/Models/User'

export default class VenuesController {
    /**
     * 
     * @swagger 
     * /venues:
     *  get:
     *      security:
     *          - bearerAuth: []
     *      tags:
     *          - Venues
     *      summary: List semua venue olahraga
     *      responses:
     *          200:
     *              description: Sukses mengambil data venues
     *          401:
     *              description: Unauthorized
     */
    public async index({ response, request }: HttpContextContract) {
        //cara query builder
        // let venues = await Database.from('venues').select('*')
        
        //Cara ORM Lucid
        //console.log(request.qs().name)
        if (request.qs().name) {
            let name = request.qs().name
            let venuesFiltered = await Venue.findBy("name", name)
            return response.status(200).json({message: 'Sukses mengambil data venues', data: venuesFiltered})
        }

        let venues = await Venue.all();
        // let venues = await Venue.query().preload('author')
        
        return response.status(200).json({message: 'Sukses mengambil data venues', data: venues})
    }
    
    /**
     * 
     * @swagger 
     * /venues:
     *  post:
     *      security:
     *          - bearerAuth: []
     *      tags:
     *          - Venues
     *      summary: Mendaftarkan venue baru
     *      requestBody:
     *          required: true
     *          content:
     *              application/x-www-form-urlencoded:
     *                  schema:
     *                      type: object
     *                      properties:
     *                          name:
     *                              type: string
     *                          address:
     *                              type: string
     *                          phone:
     *                              type: string
     *                      required:
     *                          - name
     *                          - address
     *                          - phone
     *      responses:
     *          201:
     *              description: created!
     *          401:
     *              description: Unauthorized
     *          400:
     *              description: Bad Request
     */
    public async store({request, response, auth}: HttpContextContract) {
        try {
            
            await request.validate(CreateVenueValidator)

            //Query Builder

            // let newVenueId = await Database.table('venues')
            // .returning('id')
            // .insert({
            //     name: request.input('name'),
            //     address: request.input('address'),
            //     phone: request.input('phone')
            // })

            //Model ORM Lucid
            const newVenue = new Venue();
            newVenue.name = request.input('name')
            newVenue.address = request.input('address')
            newVenue.phone = request.input('phone')

            const authUser = auth.user
            await authUser?.related('venues').save(newVenue)
            
            return response.created({message: 'created!'})

        } catch (error) {
            return response.badRequest({errors: error.message})
        }
    }

    /**
     * 
     * @swagger 
     * /venues/{id}:
     *  get:
     *      security:
     *          - bearerAuth: []
     *      tags:
     *          - Venues
     *      summary: Menampilkan detail venue dengan id tertentu beseta detail fieldnya.
     *      parameters:
     *          - name: id
     *            in: path
     *            required: true
     *            description: Venue ID
     *            schema:
     *              type: integer
     *      responses:
     *          200:
     *              description: Sukses mengambil data Venue dengan id
     *          401:
     *              description: Unauthorized
     */
    public async show({ response, params }: HttpContextContract) {
        
        //cara query builder
        // let venue = await Database
        //         .from('venues')
        //         .select('id', 'name', 'address', 'phone')
        //         .where('id', params.id)
        //         .firstOrFail()

        //cara Model ORM Lucid
        let venue = await Venue
            .query()
            .preload('fields')
            .select('id', 'name', 'address', 'phone')
            .where('id', params.id)
            .firstOrFail()
            
        response.status(200).json({message: 'Sukses mengambil data venue dengan id', data: venue})
    }
    
    /**
     * 
     * @swagger 
     * /venues/{id}:
     *  put:
     *      security:
     *          - bearerAuth: []
     *      tags:
     *          - Venues
     *      summary: Mengubah data venue
     *      parameters:
     *          - name: id
     *            in: path
     *            required: true
     *            description: Venue ID
     *            schema:
     *              type: integer
     *      requestBody:
     *          required: true
     *          content:
     *              application/x-www-form-urlencoded:
     *                  schema:
     *                      type: object
     *                      properties:
     *                          name:
     *                              type: string
     *                          address:
     *                              type: string
     *                          phone:
     *                              type: string
     *                      required:
     *                          - name
     *                          - address
     *                          - phone
     *      responses:
     *          200:
     *              description: updated!
     *          401:
     *              description: Unauthorized
     *          400:
     *              description: Bad Request
     *          422:
     *              description: Unprocessable Entity
     */
    public async update({request, response, params}: HttpContextContract) {
        
        try {

            let id = params.id
            await request.validate(CreateVenueValidator);
    
            // cara DB Builder
            // await Database
            //     .from('venues')
            //     .where('id', id)
            //     .update({
            //         name: request.input('name'),
            //         address: request.input('address'),
            //         phone: request.input('phone')
            //     })
    
            //cara model ORM
            let venue = await Venue.findOrFail(id)
            venue.name = request.input('name')
            venue.address = request.input('address')
            venue.phone = request.input('phone')
    
            venue.save()
    
            return response.ok({ message: 'updated!'})
        }

        catch (error) {
            response.badRequest()
        }

    }
    
    /**
     * 
     * @swagger 
     * /venues/{id}:
     *  delete:
     *      security:
     *          - bearerAuth: []
     *      tags:
     *          - Venues
     *      summary: Menghapus data venue
     *      parameters:
     *          - name: id
     *            in: path
     *            required: true
     *            description: Venue ID
     *            schema:
     *              type: integer
     *      responses:
     *          200:
     *              description: deleted!
     *          401:
     *              description: Unauthorized
     *          404:
     *              description: Not Found
     */
    public async destroy({params, response}: HttpContextContract) {
        //cara db builder
        // await Database
        //     .from('venues')
        //     .where('id', params.id)
        //     .delete()

        //cara ORM
        let venue = await Venue.findOrFail(params.id)
        await venue.delete()

        return response.ok({ message: 'deleted!'})
    }
    
    // public async book({request, response}: HttpContextContract) {
    //     try {

    //         await request.validate(BookValidator);
    //         response.status(200).json({message: 'Venue berhasil dibooking'})
            
    //     } catch (error) {
    //         response.badRequest({errors: error.messages})
    //     }
    // }

}
