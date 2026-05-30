const mongoose=require("mongoose");

const interviewSchema=new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        role:{
            type:String,
            required:true,
        },
        questions:{
            type:[String],
            required:true,
        },
        answers:{
            type:Object,
            required:true,
        },
        score:{
            type:Number,
            required:true,
        },

        feedback:{
            type:[String],
            required:true,
        },
    },
    {
        timestamps:true,
    }
);
module.exports=mongoose.model(
    "Interview",
    interviewSchema
);