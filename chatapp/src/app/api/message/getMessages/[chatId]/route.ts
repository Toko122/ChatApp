import connectDb from "@/lib/connectDb";
import Message from "@/models/message";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest, context: {params: Promise<{chatId: string}>}) {
     try{
       await connectDb()
       const {chatId} = await context.params
       const messages = await Message.find({chatId: chatId}).sort({createdAt: -1})
       return NextResponse.json(messages, {status: 200})
     }catch(err: any){
        return NextResponse.json({message: 'error getting messages', error: err.message}, {status: 500})
     }
}