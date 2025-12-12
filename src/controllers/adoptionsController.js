
import AdoptionRequest from '../models/AdoptionRequest.js';
import Cat from '../models/Cat.js';

export async function createAdoption(req, res) {
  const { catId, answers } = req.body;
  if (!catId) return res.status(400).json({ error: 'catId requerido' });
  const cat = await Cat.findById(catId);
  if (!cat || cat.status !== 'adoption') return res.status(400).json({ error: 'Caso no disponible para adopción' });
  const ar = await AdoptionRequest.create({ adopterId: req.user.id, catId, answers: answers || {}, status: 'submitted' });
  res.status(201).json(ar);
}

export async function listMyAdoptions(req, res) {
  const list = await AdoptionRequest.find({ adopterId: req.user.id }).sort({ createdAt: -1 });
  res.json(list);
}

export async function manageAdoption(req, res) {
  const { id } = req.params;
  const { status, note, scheduledAt } = req.body;
  const ar = await AdoptionRequest.findById(id).populate('catId');
  if (!ar) return res.status(404).json({ error: 'No encontrado' });

  const isOwner = ar.catId.rescuerId.toString() === req.user.id;
  const isAdmin = req.user.roles.includes('admin');
  if (!isOwner && !isAdmin) return res.status(403).json({ error: 'No autorizado' });

  if (status) ar.status = status;
  if (note) ar.notes.push(note);
  if (scheduledAt) ar.scheduledAt = new Date(scheduledAt);
  await ar.save();

  if (status === 'approved') {
    ar.catId.status = 'adopted';
    await ar.catId.save();
  }
  res.json(ar);
}
