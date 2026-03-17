import mongoose, { Document, Schema, Types } from "mongoose"

export interface ITask extends Document {
  user: Types.ObjectId
  title: string
  description?: string
  status: "pending" | "completed"
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
}

const taskSchema = new Schema<ITask>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    dueDate: Date,
  },
  { timestamps: true }
)

export default mongoose.model<ITask>("Task", taskSchema)