import express from 'express'
import cors from 'cors'
import { dbConnect } from './src/config/dbConnect.js'
import dotenv from 'dotenv/config'
import notesRoute from './src/routes/notesRoute.js'

const app = express()

const port = process.env.PORT || 5007

app.use(cors())
app.use(express.json())

app.use('/notes', notesRoute)



dbConnect()

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

export default app; 