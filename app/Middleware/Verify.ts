import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Verify {
  public async handle (
    {response, auth}: HttpContextContract,
    next: () => Promise<void>,
    allowedRoles: string[]
  ) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    

    let role = auth.user?.role
    // console.log(auth.user?.name)
    // console.log(auth.user?.role)
    

    if(role && allowedRoles.indexOf(role) > -1) {
      await next()
    } else {
      return response.unauthorized({message: 'role anda tidak diizinkan untuk mengakses halaman ini'})
    }
  }
}
