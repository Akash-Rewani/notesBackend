import express from 'express'
import { createNote, deleteNote, getAllNotes } from '../controllers/notesController.js'


const notesRoute = express.Router()

notesRoute.post('/create', createNote)

notesRoute.delete('/delete/:id', deleteNote)

notesRoute.get('/fetch', getAllNotes)


export default notesRoute