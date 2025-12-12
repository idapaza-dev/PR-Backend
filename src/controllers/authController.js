
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Campos obligatorios' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'Email ya registrado' });
    const passwordHash = await bcrypt.hash(password, 10);
    const roles = role && ['adoptante','rescatista'].includes(role) ? [role] : ['adoptante'];
    const user = await User.create({ name, email, passwordHash, roles });
    return res.status(201).json({ id: user._id, roles: user.roles });
  } catch {
    return res.status(500).json({ error: 'Error registro' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });
    const token = jwt.sign({ uid: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refresh = jwt.sign({ uid: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, refresh, name: user.name, roles: user.roles, verifiedRescuer: user.verifiedRescuer });
  } catch {
    return res.status(500).json({ error: 'Error login' });
  }
}

// Solicitar activar rol rescatista (Admin debe aprobar)
export async function requestRescuerRole(_req, res) {
  res.json({ status: 'pending', msg: 'Solicitud enviada al admin' });
}
