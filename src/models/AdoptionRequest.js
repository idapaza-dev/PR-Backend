
import mongoose from 'mongoose';

const adoptionSchema = new mongoose.Schema({
  adopterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  catId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Cat', required: true },
  status: { type: String, enum: ['submitted','review','visit','approved','rejected','contract','followup'], default: 'submitted' },
  answers: { type: Object, default: {} },
  notes: { type: [String], default: [] },
  scheduledAt: { type: Date }
}, { timestamps: true });

adoptionSchema.index({ adopterId: 1, catId: 1 });

export default mongoose.model('AdoptionRequest', adoptionSchema);
