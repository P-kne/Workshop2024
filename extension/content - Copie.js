// Ajouter le lien Bootstrap via CDN dans l'en-tête de la page
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css';
document.head.appendChild(link);

// Créer un conteneur pour le bouton et le formulaire
const formContainer = document.createElement('div');
formContainer.className = 'position-fixed bottom-0 end-0 p-3 bg-light border rounded shadow-lg';
formContainer.style.width = '350px';
formContainer.style.zIndex = 10000;
formContainer.style.display = 'none';  // Formulaire caché au début
document.body.appendChild(formContainer);

formContainer.innerHTML = `
    <h5 class="text-center">Signaler une publication</h5>
    <form id="reportForm" class="mb-3">
        <div class="mb-3">
            <label for="postUrl" class="form-label">URL de la publication</label>
            <input type="text" id="postUrl" class="form-control" placeholder="Collez l'URL ici" required>
        </div>
        <div class="d-flex justify-content-between">
            <button type="submit" class="btn btn-danger">Envoyer</button>
            <button type="button" id="cancelButton" class="btn btn-secondary">Fermer</button>
        </div>
    </form>
`;

// Créer le bouton de signalement
const signalButton = document.createElement('button');
signalButton.innerText = "Signaler une publication";
signalButton.style.position = 'fixed';
signalButton.style.bottom = '10px';
signalButton.style.right = '10px';
signalButton.style.padding = '10px';
signalButton.style.backgroundColor = '#f00';
signalButton.style.color = '#fff';
signalButton.style.border = 'none';
signalButton.style.borderRadius = '5px';
signalButton.style.zIndex = 10000;
document.body.appendChild(signalButton);

// Quand on clique sur "Signaler", afficher le formulaire
signalButton.addEventListener('click', () => {
    formContainer.style.display = 'block';
    signalButton.style.display = 'none';
});

// Quand on clique sur "Fermer", cacher le formulaire et réafficher le bouton "Signaler"
document.getElementById('cancelButton').addEventListener('click', () => {
    formContainer.style.display = 'none';
    signalButton.style.display = 'block';
});

// Gérer la soumission du formulaire
document.getElementById('reportForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const postUrl = document.getElementById('postUrl').value.trim();
    if (postUrl) {
        alert("Analyse de la publication en cours...");

        // Utiliser Hugging Face pour analyser le contenu récupéré
        fetch('https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer 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',  // Remplacer par ton API token Hugging Face
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ inputs: postUrl })  // Envoyer l'URL ou le contenu à analyser
        })
        .then(response => response.json())
        .then(data => {
            console.log('Résultat de l’analyse:', data);
            const reliability = data[0].score * 100;  // Exemple pour obtenir un score de confiance
            alert(`Pourcentage de fiabilité : ${reliability}%`);

            document.getElementById('postUrl').value = '';  // Réinitialiser le champ
        })
        .catch(error => {
            console.error("Erreur lors de l'analyse :", error);
        });
    } else {
        alert("Veuillez coller une URL valide !");
    }
});
