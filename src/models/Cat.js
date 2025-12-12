
import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema({
  url: { type: String, required: true },
  blurScore: { type: Number, default: 0 }
}, { _id: false });

const catSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sex: { type: String, enum: ['M','F'], required: true },
  ageMonths: { type: Number, default: 6 },
  status: { type: String, enum: ['new','treatment','adoption','adopted','archived'], default: 'new' },
  description: { type: String, default: '' },
  tags: { type: [String], default: [] },
  photos: { type: [photoSchema], default: [] },
  rescuerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  successStory: { text: String, photo: String },
  adoptionScore: { type: Number, default: 0 }
}, { timestamps: true });

catSchema.index({ status: 1 });
catSchema.index({ tags: 1 });

export default mongoose.model('Cat', catSchema);
