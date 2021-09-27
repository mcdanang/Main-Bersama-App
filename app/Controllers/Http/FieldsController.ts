import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import{ FieldValidator } from 'App/Validators/VenueValidator'

//models
import Field from 'App/Models/Field'

export default class FieldsController {
    /**
     * 
     * @swagger 
     * /venues/{id}/fields:
     *  get:
     *      security:
     *          - bearerAuth: []
     *      tags:
     *          - Fields
     *      summary: List semua field pada venue id tertentu
     *      parameters:
     *          - name: id
     *            in: path
     *            required: true
     *            description: Venues ID
     *            schema:
     *              type: integer
     *      responses:
     *          200:
     *              description: Sukses mengambil data fields
     *          401:
     *              description: Unauthorized
     */
    public async index({ response, params }: HttpContextContract) {
        
        //cara query builder
        // let fields = await Database
        //     .from('fields')
        //     .where('venue_id', params.venue_id)
        //     .select('*')

        //cara ORM with Query Builder
        let fields = await Field
            .query()
            .where('venue_id', params.venue_id)
            .select('*')
        return response.status(200).json({message: 'Sukses mengambil data fields', data: fields})
        
    }

    /**
     * 
     * @swagger 
     * /venues/{id}/fields:
     *  post:
     *      security:
     *          - bearerAuth: []
     *      tags:
     *          - Fields
     *      summary: Mendaftarkan field baru
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
     *                          type:
     *                              type: string
     *                      required:
     *                          - name
     *                          - type
     *      responses:
     *          201:
     *              description: created!
     *          401:
     *              description: Unauthorized
     *          400:
     *              description: Bad Request
     */
    public async store({request, response, params}: HttpContextContract) {
        try {
            
            await request.validate(FieldValidator);

            //Query Builder
            // let newFieldId = await Database.table('fields')
            // .returning('id')
            // .insert({
            //     name: request.input('name'),
            //     type: request.input('type'),
            //     venue_id: request.input('venue_id')
            // })

            //Cara ORM
            let newField = new Field();
            newField.name = request.input('name')
            newField.type = request.input('type')
            newField.venueId = params.venue_id
            await newField.save()
        
            response.created({message: 'created!', newId: newField.id })
        } catch (error) {
            if (error.messages) {
                return response.badRequest({message: error.messages})     
            } else {
                return response.badRequest({message: 'venue_id tidak ada'})     
            }     
        }
    }
    
    // public async show({ response, params }: HttpContextContract) {
        
        //     let field = await Field
        //             .query()
        //             .select('id', 'name', 'type', 'venue_id')
        //             .where('venue_id', params.venue_id)
        //             .where('id', params.id)
        //             .firstOrFail()
        //     response.status(200).json({message: 'Sukses mengambil data field dengan id', data: field})
        // }
        
    /**
     * 
     * @swagger 
     * /fields/{id}:
     *  get:
     *      security:
     *          - bearerAuth: []
     *      tags:
     *          - Fields
     *      summary: Menampilkan detail field dengan id tertentu beserta jadwal yang sudah dibooking.
     *      parameters:
     *          - name: id
     *            in: path
     *            required: true
     *            description: Field ID
     *            schema:
     *              type: integer
     *      responses:
     *          200:
     *              description: Sukses mengambil data field dengan id
     *          401:
     *              description: Unauthorized
     */
    public async show({ response, params }: HttpContextContract) {
        //cara Model ORM Lucid       
        let field = await Field
            .query()
            .preload('venue')
            .preload('bookings')
            .select('*')
            .where('id', params.id)
            .firstOrFail()
        
        
        return response.status(200).json({message: 'Sukses mengambil data field', data: field})
    }
    
    /**
     * 
     * @swagger 
     * /venues/{venue_id}/fields/{id}:
     *  put:
     *      security:
     *          - bearerAuth: []
     *      tags:
     *          - Fields
     *      summary: Mengubah data field
     *      parameters:
     *          - name: venue_id
     *            in: path
     *            required: true
     *            description: Venue ID
     *            schema:
     *              type: integer
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
     *                          name:
     *                              type: string
     *                          type:
     *                              type: string
     *                      required:
     *                          - name
     *                          - type
     *      responses:
     *          200:
     *              description: updated!
     *          401:
     *              description: Unauthorized
     *          422:
     *              description: Unprocessable Entity
     */
    public async update({request, response, params}: HttpContextContract) {
            await request.validate(FieldValidator);
            
            // cara DB Builder
            // await Database
            //     .from('fields')
            //     .where('venue_id', params.venue_id)
        //     .where('id', params.id)
        //     .update({
        //         name: request.input('name'),
        //         type: request.input('type'),
        //         venue_id: request.input('venue_id')
        //     })

        //cara model ORM
        try {
            let field = await Field
                .query()
                .where('venue_id', params.venue_id)
                .where('id', params.id)
                .count('*')
            
            if (field[0].$extras['count(*)'] == 0) {
                throw new Error
                
            }
            await Field
                .query()
                .where('venue_id', params.venue_id)
                .where('id', params.id)
                .update({
                    name: request.input('name'),
                    type: request.input('type'),
                    venue_id: params.venue_id
                })
            
            return response.ok({ message: 'updated!'})
            
        } catch (error) {
            if (error.messages) {
                return response.badRequest({message: error.messages})     
            } else {
                return response.badRequest({message: 'venue_id atau field_id tidak ada'})     
            }    
            
        }
        
    }
    
    /**
     * 
     * @swagger 
     * /venues/{venue_id}/fields/{id}:
     *  delete:
     *      security:
     *          - bearerAuth: []
     *      tags:
     *          - Fields
     *      summary: Menghapus data field
     *      parameters:
     *          - name: venue_id
     *            in: path
     *            required: true
     *            description: Venue ID
     *            schema:
     *              type: integer
     *          - name: id
     *            in: path
     *            required: true
     *            description: Field ID
     *            schema:
     *              type: integer
     *      responses:
     *          200:
     *              description: deleted!
     *          401:
     *              description: Unauthorized
     *          400:
     *              description: Bad Request
     */
    public async destroy({params, response}: HttpContextContract) {
        // cara DB Builder
        // await Database
        //     .from('fields')
        //     .where('venue_id', params.venue_id)
        //     .where('id', params.id)
        //     .delete()

        //cara ORM
        
        try {
            let field = await Field
                .query()
                .where('venue_id', params.venue_id)
                .where('id', params.id)
                .count('*')
            
            if (field[0].$extras['count(*)'] == 0) {
                throw new Error
            }
    
            await Field
                .query()
                .where('venue_id', params.venue_id)
                .where('id', params.id)
                .delete()
    
            return response.ok({ message: 'deleted!'})
            
        } catch (error) {
            if (error.messages) {
                return response.badRequest({message: error.messages})     
            } else {
                return response.badRequest({message: 'venue_id atau field_id tidak ada'})     
            }    
        }

    }

}
