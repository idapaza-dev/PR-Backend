
// backend/scripts/seed.js
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Modelos
import User from '../src/models/User.js';
import Cat from '../src/models/Cat.js';
import AdoptionRequest from '../src/models/AdoptionRequest.js';


import { autoTag } from '../src/services/mcpTools.js';

dotenv.config();

/** Utilidad: crear/actualizar usuario por email */
async function upsertUser({ name, email, password, roles = ['adoptante'], verifiedRescuer = false, preferences = {} }) {
  const passwordHash = await bcrypt.hash(password, 10);
  const existing = await User.findOne({ email });

  if (existing) {
    existing.name = name;
    existing.roles = roles;
    existing.verifiedRescuer = verifiedRescuer;
    existing.preferences = preferences;
    if (password) existing.passwordHash = passwordHash; // actualiza contraseña si cambió
    await existing.save();
    return existing;
  }

  return User.create({ name, email, passwordHash, roles, verifiedRescuer, preferences });
}

/** Crear gato con autogeneración de tags */
async function createCatForRescuer(rescuerId, { name, sex, ageMonths, description, photos, status = 'new' }) {
  const tags = autoTag(description || '');
  return Cat.create({ name, sex, ageMonths, description, tags, photos, rescuerId, status });
}

async function seed() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('Falta MONGO_URI en .env');

  await mongoose.connect(uri);
  console.log('[DB] Conectado a MongoDB Atlas');

 
  // await Promise.all([User.deleteMany({}), Cat.deleteMany({}), AdoptionRequest.deleteMany({})]);

  console.log('[SEED] Creando usuarios...');
  const admin = await upsertUser({
    name: 'Admin KATZE',
    email: 'admin@katze.com',
    password: 'Admin123!',
    roles: ['admin'],
    preferences: { indoor: true, childrenOk: true, energy: 'medium' }
  });

  const rescuer = await upsertUser({
    name: 'María Rescatista',
    email: 'maria@katze.com',
    password: 'Maria123!',
    roles: ['rescatista'],
    verifiedRescuer: true,
    preferences: { indoor: true, childrenOk: false, energy: 'low' }
  });

  const adopter = await upsertUser({
    name: 'Juan Adoptante',
    email: 'juan@katze.com',
    password: 'Juan123!',
    roles: ['adoptante'],
    preferences: { indoor: true, childrenOk: true, energy: 'low' }
  });

  console.log('[SEED] Admin:', admin._id.toString());
  console.log('[SEED] Rescatista:', rescuer._id.toString());
  console.log('[SEED] Adoptante:', adopter._id.toString());

  console.log('[SEED] Creando casos...');
  const luna = await createCatForRescuer(rescuer._id, {
    name: 'Luna',
    sex: 'F',
    ageMonths: 8,
    description: 'Gatita tranquila, esterilizada, ideal para interior (indoor) y sociable.',
    photos: [{ url: 'https://placekitten.com/400/250', blurScore: 0.1 }],
    status: 'adoption' // lista para adopción para probar el flujo
  });

  const milo = await createCatForRescuer(rescuer._id, {
    name: 'Milo',
    sex: 'M',
    ageMonths: 6,
    description: 'Juguetón y activo, vacunado.',
    photos: [{ url: 'https://placekitten.com/401/250', blurScore: 0.2 }],
    status: 'new'
  });

  console.log('[SEED] Luna:', luna._id.toString(), 'status=', luna.status, 'tags=', luna.tags);
  console.log('[SEED] Milo:', milo._id.toString(), 'status=', milo.status, 'tags=', milo.tags);

  console.log('[SEED] Creando solicitud de adopción (Juan -> Luna)...');
  const adoption = await AdoptionRequest.create({
    adopterId: adopter._id,
    catId: luna._id,
    status: 'submitted',
    answers: { motivo: 'Hogar seguro, experiencia previa con gatos' }
  });
  console.log('[SEED] AdoptionRequest:', adoption._id.toString(), 'status=', adoption.status);

  await mongoose.disconnect();
  console.log('[SEED] Listo. ');
}

seed().catch(err => {
  console.error('[SEED] Error:', err);
  process.exit(1);
});
