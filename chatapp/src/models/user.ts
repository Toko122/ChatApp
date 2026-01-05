import mongoose, {Schema, Document} from "mongoose";

interface IUser extends Document {
     username: string,
     email: string,
     password: string,
     online: boolean,
     lastSeen: Date
}

const UserSchema: Schema<IUser> = new Schema({
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    online: {
      type: Boolean,
      default: false,
    },
    lastSeen: {
      type: Date,
    },
}, {timestamps: true})

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

export default User