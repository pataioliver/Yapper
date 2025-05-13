import mongoose from "mongoose";

const reactionSchema = new mongoose.Schema(
  {
    emoji: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { _id: false }
);

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // Only required if not a group message
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      // Required if it's a group message
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
    replyToId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    reactions: [reactionSchema],
  },
  { timestamps: true }
);

// Validation: either receiverId or groupId must be present
messageSchema.pre('validate', function(next) {
  if (!this.receiverId && !this.groupId) {
    this.invalidate('receiverId', 'Either receiverId or groupId must be provided');
  }
  next();
});

const Message = mongoose.model("Message", messageSchema);

export default Message;