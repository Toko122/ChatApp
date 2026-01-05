import connectDb from "@/lib/connectDb"
import Message from "@/models/message"
import { NextResponse } from "next/server"


export async function POST(req: Request) {
     try{
        await connectDb()

        const {chatId, senderId, receiverId, text} = await req.json()
        if (!senderId || !receiverId || !chatId || !text) {
         return NextResponse.json({ message: 'Missing fields' }, { status: 400 })
       }

       const message = await Message.create({chatId, senderId, receiverId, text})

       return NextResponse.json(message, { status: 201 })
     }catch(err: any){
        console.log(err)
        return NextResponse.json({ message: 'Error creating message', error: err.message }, { status: 500 })
     }
}