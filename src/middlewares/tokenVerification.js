import userSchema from "../models/userSchema.js";
import dotenv from 'dotenv/config'
import jwt from 'jsonwebtoken'


export const verification = async (req, res) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer')) {
            return res.status(400).json({
                success: false,
                message: 'Unauthorized person or token is missing'
            })
        }
        else {
            const token = authHeader.split(' ')[1];
            jwt.verify(token, process.env.secretKey, async (err, decoded) => {
                if (err) {
                    if (err.name === "TokenExpiredError") {
                        return res.status(400).json({
                            success: false,
                            message: 'Token has expired'
                        })
                    }
                    return res.status(400).json({
                        success: false,
                        message: 'Unauthorized person or token is missing'
                    })
                } else {
                    const { id } = decoded
                    const user = await userSchema.findById(id)
                    if (!user) {
                        return res.status(400).json({
                            success: false,
                            message: 'User not found'
                        })
                    }
                    else {
                        user.token = null
                        user.isVerified = true
                        await user.save()
                        return res.status(200).json({
                            success: false,
                            message: 'User email verification successful'
                        })
                    }

                }
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}