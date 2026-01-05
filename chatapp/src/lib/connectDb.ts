import mongoose from "mongoose";
import { NextResponse } from "next/server";

const MONGO_URL = process.env.MONGODB as string

const connectDb = async () => {
     try{
       if(mongoose.connection.readyState >= 1){
        return ;
       }

       await mongoose.connect(MONGO_URL)
       .then(() => console.log('MongoDb Connected')
       ).catch((err: any) => console.log(err)
       )

     }catch(err: any){
        return NextResponse.json({message: "error connecting mongoDb", error: err.message}, {status: 500})
     }
}

export default connectDb