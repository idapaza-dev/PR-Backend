
import User from '../models/User.js';

export async function listUsers(_req, res) {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users);
}

export async function approveRescuer(req, res) {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId requerido' });
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  if (!user.roles.includes('rescatista')) user.roles.push('rescatista');
  user.verifiedRescuer = true;
  await user.save();
  res.json({ ok: true, userId: user._id, roles: user.roles, verifiedRescuer: user.verifiedRescuer });
}
