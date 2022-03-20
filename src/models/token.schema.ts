import * as mongoose from 'mongoose';


export const TokenSchema = new mongoose.Schema({
  hash: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
});
