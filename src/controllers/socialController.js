
export async function publishToNetworks(req, res) {
  const { id } = req.params; // catId
  // Simula envío a n8n: devolver éxito
  res.json({ status: 'ok', simulated: true, catId: id, channels: ['facebook','instagram'] });
}
