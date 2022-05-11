import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Book from 'App/Models/Book'
import Box from 'App/Models/Box'

export default class BoxesController {

    // List all boxes
    async index () {
        const boxes = await Box.all()
        return boxes
    }

    // Show a specific box
    async show ({ params, response }: HttpContextContract) {
        let box : Box | null
        try {
            box = await Box.findOrFail(params.id)
        } catch (error) {
            return response.status(404).json({ error: 'Box not found', message: error.message })
        }
        const page = params.page || 1
        const books = await Database.from(Book.table).where('box_id', box.id).paginate(page, 10)
        return {
            box,
            books
        }
    }
}
