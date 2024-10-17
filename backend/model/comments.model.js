import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    text:{
        type:String,
    },
    img:{
        type:String,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],

},{timestamps:true})

const Comment = mongoose.model("Comment",commentSchema)
export default Comment