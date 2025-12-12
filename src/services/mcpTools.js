
// Auto-tags: ML mínimo viable por palabras clave
export function autoTag(text = '') {
  const t = text.toLowerCase();
  const tags = new Set();
  if (/\b(cachorro|kitten|pequeñ[oa])\b/.test(t)) tags.add('cachorro');
  if (/\b(esterilizado|esterilizad[ao])\b/.test(t)) tags.add('esterilizado');
  if (/\b(sociable|amig[oa]|tranquil[oa])\b/.test(t)) tags.add('sociable');
  if (/\b(indoor|interior)\b/.test(t)) tags.add('indoor');
  if (/\b(vacunad[ao])\b/.test(t)) tags.add('vacunado');
  return [...tags];
}

// Recomendador simple
export function recommendCats(cats = [], pref = { indoor: true, childrenOk: false, energy: 'medium' }) {
  return cats
    .map(cat => {
      let score = 0;
      if (pref.indoor && cat.tags?.includes('indoor')) score += 2;
      if (pref.childrenOk && cat.tags?.includes('sociable')) score += 2;
      const d = (cat.description || '').toLowerCase();
      if (pref.energy === 'low' && /tranquil/.test(d)) score += 2;
      if (pref.energy === 'high' && /(juguet|activo)/.test(d)) score += 2;
      score += cat.adoptionScore || 0;
      return { cat, score, reasons: buildReasons(cat, pref) };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

function buildReasons(cat, pref) {
  const reasons = [];
  if (pref.indoor && cat.tags?.includes('indoor')) reasons.push('Ambiente interior (indoor) compatible');
  if (pref.childrenOk && cat.tags?.includes('sociable')) reasons.push('Sociable, apto para niños');
  const d = (cat.description || '').toLowerCase();
  if (pref.energy === 'low' && /tranquil/.test(d)) reasons.push('Energía baja, tranquilo');
  if (pref.energy === 'high' && /(juguet|activo)/.test(d)) reasons.push('Energía alta, juguetón/activo');
  return reasons.length ? reasons : ['Coincidencia básica por características'];
}
