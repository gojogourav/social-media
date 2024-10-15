import mongoose, { mongo } from "mongoose";
const postSchema = new mongoose.Schema({
    community:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Community"
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    mentions:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    text:{
        type:String,
        required:true
    },
    img:{
        type:String,
        required:true
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        }
    ],
    comments:[
        {
            text:{
                type:String
            },
            img:{
                type:String
            },
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            }
        }
    ]
},{timestamps:true})

const Post = mongoose.model("Post",postSchema)
export default Post