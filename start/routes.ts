/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async ({ view }) => {
  return view.render('index')
}).as('index')

/* Book Routes */
Route.group(() => {
  Route.get('/', `BooksController.index`).as(`Books.index`)

  Route.post('/store', `BooksController.store`)
  Route.get('boxsearch/:box_id', `BooksController.boxSearch`).as(`Books.boxSearch`)

}).prefix('api/book').namespace('App/Controllers/Http/api')

Route.group(() => {
  Route.get('/pick', `BooksController.pick`).as(`Books.pick`)
  Route.post('/pick', `BooksController.toPick`)

  Route.get('/add', `BooksController.add`).as(`Books.add`)
  Route.post('/add', `BooksController.toAdd`)

  Route.get('/search', `BooksController.search`).as(`Books.search`)
  
  Route.get('/:id', `BooksController.show`).as(`Books.show`)

  Route.post('/comment/:book_id', `BooksController.comment`).as(`Books.comment`)
  Route.post('/note/:book_id', `BooksController.note`).as(`Books.note`)

}).prefix('book').namespace('App/Controllers/Http')


/* Box Routes */
Route.group(() => {
  Route.get('/', `BoxesController.index`).as(`Boxes.index`)
  Route.get('/:id', `BoxesController.show`).as(`Boxes.show`)

}).prefix('api/box').namespace('App/Controllers/Http/api')

Route.group(() => {
  Route.post('/store', `BoxesController.store`).as(`Boxes.store`)
}).prefix('box').namespace('App/Controllers/Http')