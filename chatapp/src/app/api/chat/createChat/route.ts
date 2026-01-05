import connectDb from "@/lib/connectDb";
import Chat from "@/models/chat";
import { NextResponse } from "next/server";

interface ChatForm{
    senderId: string,
    receiverId: string
}

export async function POST(req: Request) {
     try{
       await connectDb()
       const body: ChatForm = await req.json()
       const {senderId, receiverId} = body

      if (!senderId || !receiverId) {
         return NextResponse.json(
           { message: "senderId and receiverId are required" },
           { status: 400 }
         );
      }

       let chat = await Chat.findOne({
         members: {$all: [senderId, receiverId]}
       })

       if (!chat) {
        chat = await Chat.create({
           members: [senderId, receiverId]
         });
      }

      return NextResponse.json(chat, { status: 201 });

     }catch(err: any){
        return NextResponse.json({message: 'error creating chat', error: err.message}, {status: 500})
     }
}