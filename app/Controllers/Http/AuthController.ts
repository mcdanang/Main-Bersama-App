import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'
import UserValidator from 'App/Validators/UserValidator'
import { schema } from '@ioc:Adonis/Core/Validator'
import Mail from '@ioc:Adonis/Addons/Mail'
import Database from '@ioc:Adonis/Lucid/Database'

export default class AuthController {
    /**
     * 
     * @swagger 
     * /register:
     *  post:
     *      tags:
     *          - Authentication
     *      summary: Melakukan pendaftaran user baru dengan memasukan data name, email, dan password. Aplikasi mengirimkan kode OTP ke email user pendaftar.
     *      requestBody:
     *          required: true
     *          content:
     *              application/x-www-form-urlencoded:
     *                  schema:
     *                      $ref: '#definitions/User'
     *              application/json:
     *                  schema:
     *                      $ref: '#definitions/User'
     *      responses:
     *          201:
     *              description: user created, verify otp in email
     *          422:
     *              description: request invalid
     */
    public async register({request, response}: HttpContextContract) {
        try {
            const data = await request.validate(UserValidator)

            const newUser = await User.create(data)

            const otp_code = Math.floor(100000 + Math.random() * 900000)

           await Database.table('otp_codes').insert({otp_code: otp_code, user_id: newUser.id})

            await Mail.send((message) => {
                message
                  .from('admin@todoapi.com')
                  .to(data.email)
                  .subject('Kode OTP')
                  .htmlView('emails/otp_verification', { otp_code })
              })

            return response.created({ message: 'register success, please verify your otp code' })
        } catch (error) {
            console.log(error.message)
            return response.unprocessableEntity({ messages: error.messages })
        }
    }

    /**
     * 
     * @swagger 
     * /login:
     *  post:
     *      tags:
     *          - Authentication
     *      summary: Melakukan login dengan memasukkan email dan password. Response token API (Bearer Token)
     *      requestBody:
     *          required: true
     *          content:
     *              application/x-www-form-urlencoded:
     *                  schema:
     *                      $ref: '#definitions/User'
     *              application/json:
     *                  schema:
     *                      $ref: '#definitions/User'
     *      responses:
     *          200:
     *              description: login success
     *          400:
     *              description: bad request
     *          422:
     *              description: request invalid
     */
    public async login({request, response, auth}: HttpContextContract) {

        
        try {
            const userSchema = schema.create({
                email: schema.string(),
                password: schema.string()
            })

            await request.validate({ schema: userSchema})

            const email = request.input('email')
            const password = request.input('password')

            const token = await auth.use('api').attempt(email, password)

            return response.ok({message: 'login success', token})

        } catch (error) {
            if (error.guard) {
                return response.badRequest({message: error.message})     
            } else {
                return response.badRequest({message: error.messages})     
            }            
        }
    }

    /**
     * 
     * @swagger 
     * /verifikasi-otp:
     *  post:
     *      tags:
     *          - Authentication
     *      summary: Memverifikasi user baru
     *      requestBody:
     *          required: true
     *          content:
     *              application/x-www-form-urlencoded:
     *                  schema:
     *                      type: object
     *                      properties:
     *                          otp_code:
     *                              type: integer
     *                          email:
     *                              type: string
     *                      required:
     *                          - otp_code
     *                          - email
     *      responses:
     *          200:
     *              description: berhasil verifikasi OTP
     *          500:
     *              description: Internal Server Error
     */
    public async otpVerification({request, response}: HttpContextContract) {
        let otp_code = request.input('otp_code')
        let email = request.input('email')

        let user = await User.findBy('email', email)
        let otpCheck = await Database.query().from('otp_codes').where('otp_code', otp_code).first()

        
        if (user && user?.id == otpCheck.user_id) {
            user.isVerified = true
            await user?.save()
            return response.status(200).json({message: 'berhasil verifikasi OTP'})
        } else {
            return response.status(400).json({message: 'gagal verifikasi OTP'})
        }
    }
}

