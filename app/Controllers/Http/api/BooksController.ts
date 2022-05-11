import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Book from 'App/Models/Book'
import Box from 'App/Models/Box'

export default class BooksController {

    //Create a new book in a given box
    async store ({ request, response }: HttpContextContract) {
        try {
            await Box.findOrFail(request.input('box_id'))
        } catch (error) {
            return response.status(404).json({ error: 'Box not found', message: error.message })
        }
        await Book.create(request.only(['title', 'author', 'description', 'box_id']))
        return response.created({ message: 'Book created successfully' })
    }


    //Get all books
    async index () {
        const books = await Book.all()
        return books
    }

    //Get all books for a given box and page
    async boxSearch ({ response, params }: HttpContextContract) {
        let box : Box | null
        try {
            box = await Box.findOrFail(params.box_id)
        } catch (error) {
            return response.status(404).json({ error: 'Box not found' })
        }
        const page = params.page || 1
        const books = await Database.from(Book.table).where('box_id', box.id).paginate(page, 10)
        return books
    }

}
