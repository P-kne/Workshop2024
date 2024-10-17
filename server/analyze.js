const puppeteer = require('puppeteer');
const fetch = require('node-fetch');  // Pour envoyer le contenu à Hugging Face

const analyzePage = async (url) => {
    // Démarrer Puppeteer et ouvrir un nouvel onglet
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Accéder à l'URL
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Récupérer le texte de la page
    const pageContent = await page.evaluate(() => {
        return document.body.innerText;
    });

    console.log("Contenu de la page :", pageContent);

    // Envoyer le contenu à Hugging Face pour analyse
    const response = await fetch('https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer YOUR_HUGGING_FACE_API_TOKEN',  // Remplace par ton token API Hugging Face
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputs: pageContent })
    });

    const result = await response.json();
    if (result && result.length > 0 && result[0].score !== undefined) {
        const reliability = result[0].score * 100;
        console.log(`Pourcentage de fiabilité : ${reliability}%`);
    } else {
        console.log("Aucune analyse disponible pour cette publication.");
    }

    // Fermer le navigateur
    await browser.close();
};

// Exemple d'utilisation
const url = 'https://www.codeur.com/tuto/creation-de-site-internet/comment-creer-extension-google-chrome/';
analyzePage(url);
