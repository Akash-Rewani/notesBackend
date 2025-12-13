import express from 'express'
import { login, register, logout } from "../controllers/userController.js"
import { verification } from '../middlewares/tokenVerification.js'
import { userValidateSchema, userValidate } from '../validators/userValidate.js'
import { hasToken } from '../middlewares/hasToken.js'
import { upload } from '../multer/multer.js'

const userRoute = express.Router()

userRoute.post('/register', upload.single("profilePic"), userValidate(userValidateSchema), register)
userRoute.get('/verify', verification)
userRoute.post('/login', login)
userRoute.delete('/logout', hasToken, logout)

export default userRoute