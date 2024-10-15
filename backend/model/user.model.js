import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        minlength:4,
        maxlength:15
    },
    fullname:{
        type:String,
        required:true,
        minlength:4,
        maxlength:15,
        trim:true
    },
    password:{
        required:true,
        type:String,

    },
    email:{
        required:true,
        unique:true,
        type:String,
        trim:true
    },
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:[]
        }
    ],
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:[]
        }
    ],
    profileImg:{
        type:String,
        default:''
    },
    coverImg:{
        type:String,
        default:''
    },
    //liked post logic will be written later on
    likedPost:[
        {

            type:mongoose.Schema.Types.ObjectId,
            ref:"Post"
        }
    ],
    community:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Community"
        }
    ]


},{timestamps:true})

const User = mongoose.model("User",userSchema)
export default User