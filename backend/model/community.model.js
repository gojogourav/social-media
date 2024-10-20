import mongoose from "mongoose";
const CommunitySchema = new mongoose.Schema(
  {
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    users:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    Announcement:[
        {
            Avatarimg:{
                type:String,
                required:true
            },
            text:{
                type:String,
                required:true
            },
            CoverImg:{
                type:String,
                required:false
            }
        }
    ],
    MonthlyEvents:[
        {
            Avatarimg:{
                type:String,
                required:true
            },
            text:{
                type:String,
                required:true
            },
            CoverImg:{
                type:String,
                required:false
            }
        }
    ],
  },
  { timestamps: true }
);

const Community = mongoose.Schema("Community",CommunitySchema)
export default Community