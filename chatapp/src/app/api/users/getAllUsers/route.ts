import connectDb from "@/lib/connectDb";
import User from "@/models/user";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
      try{
         await connectDb()
         const users = await User.find().sort({createdAt: -1})
         return NextResponse.json({users}, {status: 200})
      }catch(err: any){
        return NextResponse.json({message: 'error getting all users', error: err.message}, {status: 500})
      }
}