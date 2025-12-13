import sessionSchema from "../models/sessionSchema.js";
import userSchema from "../models/userSchema.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv/config";


export const hasToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer')) {
            return res.status(400).json({
                success: false,
                message: 'Token is missing or Unauthorized person'
            })
        }
        else {
            const token = authHeader.split(' ')[1];
            jwt.verify(token, process.env.secretKey, async (err, decoded) => {
                if (err) {
                    if (err.name === 'TokenExpiredError') {
                        return res.status(400).json({
                            success: false,
                            message: 'Token has expired or Unauthorized person'
                        })
                    }
                    return res.status(400).json({
                        success: false,
                        message: 'Token is missing or Unauthorized person'
                    })
                } else {
                    const { id } = decoded;
                    const user = await userSchema.findById(id)
                    if (!user) {
                        return res.status(400).json({
                            success: false,
                            message: 'User not found'
                        })

                    }
                    const existUser = await sessionSchema.findOne({ userId: id })
                    if (existUser) {
                        req.userId = id;
                        next()
                    }
                    else {
                        return res.status(400).json({
                            success: false,
                            message: 'User alredy logout'
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