
import mongoose from 'mongoose';

const socialPostSchema = new mongoose.Schema({
  catId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cat', required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  channels: { type: [String], default: [] },
  payload: { type: Object, default: {} },
  result: { type: Object, default: {} }
}, { timestamps: true });

export default mongoose.model('SocialPost', socialPostSchema);
