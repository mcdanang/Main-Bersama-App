import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Profile from 'App/Models/Profile'

export default class ProfilesController {
    /**
     * 
     * @swagger 
     * /profiles:
     *  post:
     *      security:
     *          - bearerAuth: []
     *      tags:
     *          - Profile
     *      summary: Membuat profile user baru
     *      requestBody:
     *          required: true
     *          content:
     *              application/x-www-form-urlencoded:
     *                  schema:
     *                      type: object
     *                      properties:
     *                          full_name:
     *                              type: string
     *                          phone:
     *                              type: string
     *                      required:
     *                          - full_name
     *                          - phone1
     *      responses:
     *          201:
     *              description: Profile is created
     *          401:
     *              description: Unauthorized
     */
    public async store({request, response, auth}: HttpContextContract) {
        const full_name = request.input('full_name')
        const phone = request.input('phone')

        // const newProfile = Profile.create({
        //     fullName: full_name,
        //     phone: phone,
        //     userId: auth.user?.id
        // })

        const authUser = auth.user

        const checkId = await Database.from('profiles').where('user_id', auth.user.id).select('user_id')
        console.log(checkId)

        if(checkId.length > 0) {
            return response.badRequest({message: 'profile sudah ada'})
        }
        
        authUser?.related('profile').create({
            fullName: full_name,
            phone: phone
        })

        return response.created({message: 'Profile is created!'})
    }
}
