app.post("/api/choice", async (req, res) => {
  const { question, choice } = req.body;
  const timestamp = new Date().toISOString();

  console.log(`Question: ${question}`);
  console.log(`Choix: ${choice}`);

  try {
    await csvWriter.writeRecords([{ question, choice, timestamp }]);
    res.json({ message: "Choix sauvegardé avec succès !" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la sauvegarde." });
  }
});
