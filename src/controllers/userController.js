import userSchema from "../models/userSchema.js";
import bcrypt from 'bcrypt'
import dotenv from 'dotenv/config'
import jwt from 'jsonwebtoken'
import { verifyMail } from "../verifyEmail/mailVerify.js";
import sessionSchema from "../models/sessionSchema.js";


export const register = async (req, res) => {
    try {
        const { username, email, password, } = req.body;
        const profilePic = req.file.filename;

        if (!username || !email || !password || !profilePic) {
            return res.status(400).json({
                success: false,
                message: 'User name , email all required'
            })
        }

        const existEmail = await userSchema.findOne({ email })
        if (existEmail) {
            return res.status(400).json({
                success: false,
                message: 'Email alredy exist in our database'
            })
        }
        const hashPass = await bcrypt.hash(password, 10)

        const user = await userSchema.create({
            username,
            email,
            password: hashPass,
            profilePic,
        })

        const token = jwt.sign(
            { id: user._id },
            process.env.secretKey,
            { expiresIn: "7d" }
        );

        verifyMail(token, email)
        user.token = token
        await user.save()


        return res.status(201).json({
            success: true,
            message: 'User register sucessfully',
            user
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })

    }

}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;


        const user = await userSchema.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        if (!user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Please verify your email before logging in"
            });
        }


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect password"
            });
        }

        await sessionSchema.findOneAndDelete({ userId: user._id });

        await sessionSchema.create({ userId: user._id });


        const accessToken = jwt.sign(
            { id: user._id },
            process.env.secretKey,
            { expiresIn: "1d" }
        );

        const refreshToken = jwt.sign(
            { id: user._id },
            process.env.secretKey,
            { expiresIn: "7d" }
        );


        user.isLoggedIn = true;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "User login successfull",
            accessToken,
            refreshToken,
            user
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const logout = async (req, res) => {
    try {
        const existUser = await sessionSchema.findOne({ userId: req.userId })
        const user = await userSchema.findById({ _id: req.userId })
        if (existUser) {
            await sessionSchema.findOneAndDelete({ userId: req.userId })
            user.isLoggedIn = false
            await user.save()
            return res.status(200).json({
                success: true,
                message: 'User log out success'
            })
        } else {
            return res.status(400).json({
                success: false,
                message: 'User had no session'
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}