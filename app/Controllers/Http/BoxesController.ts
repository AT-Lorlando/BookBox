import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Box from 'App/Models/Box'

export default class BoxesController {

    // Create a new box
    async store ({ view, request, response, session }: HttpContextContract) {
        try {
            await Box.create(request.only(['location']))
        }
        catch (error) {
            session.flash({ error: 'Box could not be created' })
            return response.redirect('back')
        }
        session.flash({ success: 'Box created successfully.' })
        return view.render('index')
    }
}