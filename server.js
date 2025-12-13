import express from 'express'
import { dbConnect } from './src/config/dbConnect.js'
import dotenv from 'dotenv/config'
import userRoute from './src/routes/userRoute.js'
import notesRoute from './src/routes/notesRoute.js'


const app = express()

const port = process.env.PORT

app.use(express.json())
app.use("/upload", express.static("upload"));
app.use('/user', userRoute)
app.use('/notes', notesRoute)


dbConnect()

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);

})