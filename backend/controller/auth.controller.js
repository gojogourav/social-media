import User from "../model/user.model.js"
import bcrypt from 'bcrypt'
import generateToken from '../lib/utils/generateToken.js'
import generatetoken from "../lib/utils/generateToken.js"

export const signup = async(req,res)=>{
    try{
        const {fullname,username,email,password} = req.body

        if(!username||!email||!password){
            return res.status(400).json({message:"Please fill all the fields"})
        }

        const emailRegx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

        if(!emailRegx.test(email)){
            return res.status(400).json({message:"Please enter a valid email address"})
        }

        const existingEmail = await User.findOne({email})
        if(existingEmail){
            return res.status(400).json({message:"Email already registered"})
        }
        const existingUser = await User.findOne({username})
        if(existingUser){
            return res.status(400).json({message:"User already exists"})
        }

        if(typeof password!=="string"||password.trim().length<6||password.trim().length>15){
            return res.status(400).json({message:"Invalid password, Password must be between length of 6 to 15"})
        }

        
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password,salt)

        const newUser = new User({
            fullname,
            username,
            email,
            password:hashPassword
        })

        await newUser.save()

        generateToken(newUser._id,res)

        res.status(200).json({
            _id:newUser._id,
            username:newUser.username,
            email:newUser.email,
            password:newUser.password,
            fullname:newUser.fullname,
        })


    }catch(error){
        console.log(`error in signup controller ${error}`);
        res.status(500).json({message:"Internal server error"})
    }
}

export const login = async(req,res)=>{
    try{
        const {username,password}= req.body

        if(!username){
            return res.status(400).json({message:"Please enter username"})
        }

        const user = await User.findOne({username})
        if(!user){
            return res.status(404).json({message:"404 User not found!"})
        }

        const passwordCheck = await bcrypt.compare(password,user?.password||"")
        
        if(!passwordCheck){
            return res.status(400).json({message:"Invalid password or username"})
        }

        await generatetoken(user._id,res)

        return res.status(200).json({
            _id:user._id,
            username:user.username,
            fullname:user.fullname,
            email:user.email,
            followers:user.followers,
            following:user.following,
            profileImg:user.profileImg,
            coverImg:user.coverImg,
            likedPost:user.likedPost,
            Community:user.Community
        })

    }catch(error){
        console.log(`Error in login controller ${error}`);
        res.status(400).json({message:`Internal server error`})
    }
}

export const logout = async(req,res)=>{
    try{
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"Logged out successfully!"})
    }catch(error){
        console.log(`error in logout controller ${error}`);
        res.status(400).json({message:"Internal server error"})
    }
}

export const getUser = async(req,res)=>{
    try{
        
        const user = await User.findById(req.user._id).select("-password")
        
        if(!user){
            return res.status(404).json({message:"User not found"})
        }

        res.status(200).json({user})

    }catch(error){
        console.log(`Error in getUser controller ${error}`);
        res.status(400).json({message:"Internal server error"})
    }
}