const express = require("express");
const fs = require("fs");
const { createObjectCsvWriter } = require("csv-writer");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware : servir les fichiers statiques depuis "frontend"
app.use(express.static(path.join(__dirname, "../frontend")));

// Route principale : redirection vers index.html
app.get("/", (req, res) => {
  res.redirect("/index.html");
});

// Configuration CSV Writer pour sauvegarder les réponses
const csvWriter = createObjectCsvWriter({
  path: path.join(__dirname, "decisions.csv"),
  header: [
    { id: "question", title: "Question" },
    { id: "choice", title: "Choix" },
    { id: "timestamp", title: "Horodatage" },
  ],
});

app.use(express.json());

// API pour enregistrer les réponses
app.post("/api/choice", async (req, res) => {
  const { question, choice } = req.body;
  const timestamp = new Date().toISOString();

  try {
    await csvWriter.writeRecords([{ question, choice, timestamp }]);
    res.json({ message: "Choix sauvegardé avec succès !" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la sauvegarde." });
  }
});

// Route pour télécharger le fichier CSV
app.get("/download-csv", (req, res) => {
  const csvFilePath = path.join(__dirname, "decisions.csv");

  // Vérifier si le fichier existe
  if (fs.existsSync(csvFilePath)) {
    res.download(csvFilePath, "responses.csv", (err) => {
      if (err) {
        console.error("Erreur lors du téléchargement :", err);
        res.status(500).send("Erreur lors du téléchargement.");
      }
    });
  } else {
    res.status(404).send("Fichier CSV introuvable.");
  }
});

// API pour fournir les questions
app.get("/api/questions", (req, res) => {
  const questions = require("./questions.json");
  res.json(questions);
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
