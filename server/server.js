const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());  // Pour traiter les requêtes JSON

// Connexion à MongoDB
//analyzerDB
mongoose.connect('mongodb://localhost:27017/FeedProtector', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connecté à MongoDB');
}).catch(err => {
    console.error('Erreur de connexion à MongoDB', err);
});

// Définir un schéma pour les signalements
const signalSchema = new mongoose.Schema({
    text: String,  // Le texte collé par l'utilisateur
    analysisResult: Array,  // Les résultats de l'analyse
    date: { type: Date, default: Date.now }  // Date du signalement
});

// Créer un modèle pour les signalements
const Signal = mongoose.model('Signal', signalSchema);

// Route pour analyser le texte et enregistrer le signalement
app.post('/analyze', async (req, res) => {
    const { text } = req.body;

    // Valider le texte
    if (!text || text.trim() === '') {
        return res.status(400).json({ error: 'Texte manquant ou vide' });
    }

    try {
        // Analyser le texte avec Hugging Face
        const response = await axios.post('https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english', {
            inputs: text,
        }, {
            headers: {
                'Authorization': 'Bearer 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',  // Remplace par ton token
            }
        });

        // Récupérer le résultat de l'analyse
        const analysisResult = response.data;

        // Sauvegarder le signalement dans la base de données
        const newSignal = new Signal({
            text: text,
            analysisResult: analysisResult
        });

        await newSignal.save();

        // Envoyer la réponse avec les résultats d'analyse
        res.json({ message: 'Signalement sauvegardé avec succès', analysisResult });
    } catch (error) {
        console.error('Erreur lors de l\'analyse ou de l\'enregistrement', error);
        res.status(500).json({ error: 'Erreur lors de l\'analyse ou de l\'enregistrement' });
    }
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
