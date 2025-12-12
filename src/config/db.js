// src/config/db.js
import mongoose from 'mongoose';

export async function connectDB(uri) {
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  console.log('[DB] Conectado a MongoDB Atlas');
}
