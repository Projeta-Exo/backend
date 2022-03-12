import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    select: true,
    required: true
  },
  created: {
    type: Date,
    default: Date.now,
  },
});
