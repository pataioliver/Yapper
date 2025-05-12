import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  avatar: {
    type: String, // URL or path to group avatar image
    default: '',
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }
  ],
  admins: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Group = mongoose.model('Group', groupSchema);
export default Group;