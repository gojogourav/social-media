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

    },
    img:{
        type:String,
        
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        }
    ],
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comments"
        }
    ],
    coverImg:{
        type:String
    }
},{timestamps:true})

const Post = mongoose.model("Post",postSchema)
export default Post