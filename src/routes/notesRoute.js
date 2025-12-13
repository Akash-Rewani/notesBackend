import express from 'express'
import { createNote, updateNote, deleteNote, getAllNotes } from '../controllers/notesController.js'
import { hasToken } from '../middlewares/hasToken.js'

const notesRoute = express.Router()

notesRoute.post('/create', hasToken, createNote)

notesRoute.put('/update/:id', hasToken, updateNote)

notesRoute.delete('/delete/:id', hasToken, deleteNote)

notesRoute.get('/fetch', hasToken, getAllNotes)

export default notesRoute