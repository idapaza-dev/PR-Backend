
import Cat from '../models/Cat.js';
import User from '../models/User.js';
import { autoTag, recommendCats } from '../services/mcpTools.js';

export async function suggestTags(req, res) {
  const { text } = req.body;
  res.json({ tags: autoTag(text || '') });
}

export async function recommendations(req, res) {
  const user = await User.findById(req.user.id);
  const cats = await Cat.find({ status: 'adoption' });
  const recs = recommendCats(cats, user.preferences || {});
  res.json(recs.map(r => ({ catId: r.cat._id, name: r.cat.name, score: r.score, reasons: r.reasons })));
}
