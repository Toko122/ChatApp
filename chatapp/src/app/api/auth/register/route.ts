import connectDb from "@/lib/connectDb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

interface RegisterForm{
    username: string,
    email: string,
    password: string
}

export async function POST(req: Request) {
      try{
         await connectDb()
         const body: RegisterForm = await req.json()
         const {username, email, password} = body

         if(!username || !email || !password){
           return NextResponse.json({message: "All fields required"}, {status: 400})
         }

         if(username.length < 3){
           return NextResponse.json({message: 'Username must be 3 characters length'}, {status: 401})
         }

        if(password.length < 6){
          return NextResponse.json({message: 'Password must be 6 characters length'}, {status: 401})
        }

        const existedUser = await User.findOne({
          $or: [{email}, {username}]
        })
        if(existedUser){
          return NextResponse.json({message: "user already exist"}, {status: 401})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
          username, email, password: hashedPassword
        })

        return NextResponse.json(
         { message: "User registered successfully", user},
         { status: 201 }
       );

      }catch(err: any){
        return NextResponse.json({message: 'error register user', error: err.message}, {status: 500})
      }
}