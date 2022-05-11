import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Book from 'App/Models/Book'
import Box from 'App/Models/Box'
import Note from 'App/Models/Note'
import Comment from 'App/Models/Comment'

export default class BooksController {

    // The user pick a book
    async pick ({ view }: HttpContextContract) {
        const boxes = await Box.all()
        const books = await Book.all()
        return view.render('book.pick', { boxes, books })
    }

    async toPick ({ request, session, response }: HttpContextContract) {
        let book : Book | null
        let id = request.input('id')
        try {
            book = await Book.findOrFail(id)
        } catch (error) {
            session.flash({ error: 'Book not found.' })
            return response.redirect('back')
        }
        // Delete every note for this book
        const notes = await Note.query().where('book_id', id)
        for(let i = 0; i < notes.length; i++) {
            await notes[i].delete()
        }
        // Delete every comment for this book
        const comments = await Comment.query().where('book_id', id)
        for(let i = 0; i < comments.length; i++) {
            await comments[i].delete()
        }
        // Delete the book from the database
        await book.delete()
        session.flash({ success: 'Book picked successfully.' })
        return response.redirect().toRoute('index')
    }

    // The user add a new book
    async add ({ view }: HttpContextContract) {
        const boxes = await Box.all()
        return view.render('book.add', { boxes })
    }

    async toAdd ({ request, session, response }: HttpContextContract) {
        try {
            await Book.create(request.only(['title', 'author', 'description', 'box_id']))
        } catch (error) {
            session.flash({ error: 'Book could not be created.' })
            return response.redirect('back')
        }
        session.flash({ success: 'Book added successfully.' })
        return response.redirect().toRoute('index')
    }

    // The user search for a book
    async search ({ view }: HttpContextContract) {
        const boxes = await Box.all()
        const books = await Book.all()
        let retboxes = boxes.map(box => {
            return {
                id: box.id,
                location: box.location,
                books: books.filter(book => book.box_id === box.id)
            }
        })

        return view.render('book.search', { books: books, boxes: retboxes })
    }

    // The user clicked on a book
    async show ({ response, view, params, session }: HttpContextContract) {
        let book : Book | null
        try {
            book = await Book.findOrFail(params.id)
        } catch (error) {
            session.flash({ error: 'Book not found.' })
            return response.redirect('back')
        }
        // Fetch all the notes for this book
        const notes = await Database.from(Note.table).where('book_id', book.id)
        // Get the average rating for this book
        let sum = 0
        for(let i = 0; i < notes.length; i++) {
            sum += notes[i].value
        }

        const comments = await Database.from(Comment.table).where('book_id', book.id)
        return view.render('book.show', { 
            book: book, 
            note: notes.length ? sum / notes.length : null,
            comments: comments.length ? comments : null
         })
    }

    // The user post a new note
    async note ({ request, response, session, params }: HttpContextContract) {
        let book : Book | null
        try {
            book = await Book.findOrFail(params.book_id)
        } catch (error) {
            session.flash({ error: 'Book not found.' })
            return response.redirect('back')
        }
        const value = request.input('value')
        const book_id = params.book_id
        await Note.create({ value, book_id })
        session.flash({ success: 'Note added successfully.' })
        return response.redirect().toRoute('Books.show', { id: book.id })
    }
    

    async comment ({ request, response, session, params }: HttpContextContract) {
        let book : Book | null
        try {
            book = await Book.findOrFail(params.book_id)
        } catch (error) {
            session.flash({ error: 'Book not found.' })
            return response.redirect('back')
        }
        const value = request.input('value')
        const book_id = params.book_id
        await Comment.create({ value, book_id })
        session.flash({ success: 'Comment added successfully.' })
        return response.redirect().toRoute('Books.show', { id: book.id })
    }
}
