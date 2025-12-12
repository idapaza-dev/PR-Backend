
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true },
  email: { type: String, trim: true, unique: true, required: true },
  passwordHash: { type: String, required: true },
  roles: { type: [String], default: ['adoptante'] }, // puede tener varios
  verifiedRescuer: { type: Boolean, default: false },
  preferences: {
    indoor: { type: Boolean, default: true },
    childrenOk: { type: Boolean, default: false },
    energy: { type: String, enum: ['low','medium','high'], default: 'medium' }
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
