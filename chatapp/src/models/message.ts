import mongoose, {Schema, Document, Types} from "mongoose";

interface IMessage extends Document{
     text: string,
     chatId: Types.ObjectId,
     senderId: Types.ObjectId,
     receiverId: Types.ObjectId
}

const MessageSchema = new Schema<IMessage>({
       text: {type: String},
       chatId: {
          type: Schema.Types.ObjectId,
          ref: 'Chat',
        required: true
       },
       senderId: {
         type: Schema.Types.ObjectId,
         ref: 'User',
         required: true
       },
       receiverId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true
        } 
})

const Message = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema)

export default Message