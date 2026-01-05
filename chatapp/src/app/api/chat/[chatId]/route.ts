import connectDb from "@/lib/connectDb";
import Chat from "@/models/chat";
import { NextResponse } from "next/server";


export async function GET(req: Request, context: {params: {chatId: string}}) {
     try{
        await connectDb()

        const { chatId } = await context.params

        const chat = await Chat.findById(chatId).populate('members', 'username')

         if (!chat) {
           return NextResponse.json({ message: 'Chat not found' }, { status: 404 })
        }

       return NextResponse.json(chat, {status: 200})

     }catch(err: any){
        return NextResponse.json({message: 'error getting chat by id', error: err.message}, {status: 500})
     }
}