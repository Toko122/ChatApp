import connectDb from "@/lib/connectDb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import { NextResponse } from "next/server";

interface LoginForm{
    email: string,
    password: string
}

export async function POST(req: Request) {
     try{
       await connectDb()
       const body: LoginForm = await req.json()
       const {email, password} = body

        if(!email || !password){
           return NextResponse.json({message: "All fields required"}, {status: 400})
        }

        const user = await User.findOne({email})
        if(!user){
          return NextResponse.json({message: "Invalid credentials"}, {status: 401})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return NextResponse.json({message: "password is worng"}, {status: 401})
        }

        const token = jwt.sign({id: user._id}, process.env.JWT as string, {expiresIn: '2d'})

        return NextResponse.json(
          {
            message: "Login successful",
            token,
            user
          },
        { status: 200 }
      );

     }catch(err: any){
        return NextResponse.json({message: "error login user", error: err.message}, {status: 500})
     }
}