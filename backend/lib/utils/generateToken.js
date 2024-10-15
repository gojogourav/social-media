import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET;

const generatetoken =async (userId,res)=>{
    const token = await jwt.sign({userId},JWT_SECRET,{expiresIn:'15d'})

    res.cookie("jwt",token,{
        maxAge:15*24*60*1000,
        httpOnly:true,
        sameSite:"strict",
        secure:process.env.NODE_ENV !=="development"
    })
}

export default generatetoken