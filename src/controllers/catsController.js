
import Cat from '../models/Cat.js';
import { autoTag } from '../services/mcpTools.js';

export async function listCats(req, res) {
  const { status, tags } = req.query;
  const q = {};
  if (status) q.status = status;
  if (tags) q.tags = { $in: tags.split(',') };
  const cats = await Cat.find(q).sort({ createdAt: -1 });
  res.json(cats);
}

export async function createCat(req, res) {
  const { name, sex, ageMonths, description, photos = [] } = req.body;
  if (!name || !sex) return res.status(400).json({ error: 'name y sex son obligatorios' });
  const tags = autoTag(description || '');
  const cat = await Cat.create({
    name, sex, ageMonths, description, tags, photos, rescuerId: req.user.id, status: 'new'
  });
  res.status(201).json(cat);
}

export async function updateCat(req, res) {
  const { id } = req.params;
  const cat = await Cat.findById(id);
  if (!cat) return res.status(404).json({ error: 'No encontrado' });

  const isOwner = cat.rescuerId.toString() === req.user.id;
  const isAdmin = req.user.roles.includes('admin');
  if (!isOwner && !isAdmin) return res.status(403).json({ error: 'No autorizado' });

  const { status, description, photos, successStory } = req.body;
  if (description) cat.tags = autoTag(description);
  if (typeof status === 'string') cat.status = status;
  if (Array.isArray(photos)) cat.photos = photos;
  if (successStory) cat.successStory = successStory;
  await cat.save();
  res.json(cat);
}
