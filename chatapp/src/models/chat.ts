import mongoose, {Schema, Document, Types} from "mongoose";

interface IChat extends Document {
  members: Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const ChatSchema = new Schema<IChat>(
  {
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }
    ]
  },
  { timestamps: true }
)

const Chat = mongoose.models.Chat || mongoose.model<IChat>('Chat', ChatSchema)

export default Chat