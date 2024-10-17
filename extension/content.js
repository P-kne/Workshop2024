// Ajouter le lien Bootstrap via CDN dans l'en-tête de la page
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css';
document.head.appendChild(link);

// Créer un conteneur pour le formulaire
const formContainer = document.createElement('div');
formContainer.className = 'position-fixed bottom-0 end-0 p-3 bg-light border rounded shadow-lg';
formContainer.style.width = '350px';
formContainer.style.zIndex = 10000;
formContainer.style.display = 'none';  // Formulaire caché au début
document.body.appendChild(formContainer);

// Ajouter le contenu HTML du formulaire
formContainer.innerHTML = `
    <h5 class="text-center">Signaler un contenu</h5>
    <form id="reportForm" class="mb-3">
        <div class="mb-3">
            <label for="userText" class="form-label">Texte à signaler</label>
            <textarea id="userText" class="form-control" placeholder="Collez votre texte ici..." required></textarea>
        </div>
        <div class="d-flex justify-content-between">
            <button type="submit" class="btn btn-danger">Envoyer</button>
            <button type="button" id="cancelButton" class="btn btn-secondary">Fermer</button>
        </div>
    </form>
`;

// Créer un conteneur de notification pour afficher les résultats
const notificationContainer = document.createElement('div');
notificationContainer.style.position = 'fixed';
notificationContainer.style.top = '10px';
notificationContainer.style.right = '10px';
notificationContainer.style.backgroundColor = '#28a745';
notificationContainer.style.color = '#fff';
notificationContainer.style.padding = '10px';
notificationContainer.style.borderRadius = '5px';
notificationContainer.style.display = 'none';  // Caché par défaut
notificationContainer.style.zIndex = 10001;  // Assurer la visibilité
document.body.appendChild(notificationContainer);

// Fonction pour afficher une notification
function showNotification(message) {
    notificationContainer.innerHTML = message;
    notificationContainer.style.display = 'block';

    // Cacher la notification après 5 secondes
    setTimeout(() => {
        notificationContainer.style.display = 'none';
    }, 5000);
}

// Créer le bouton de signalement
const signalButton = document.createElement('button');
signalButton.innerText = "Signaler un contenu";
signalButton.style.position = 'fixed';
signalButton.style.bottom = '10px';
signalButton.style.right = '10px';
signalButton.style.padding = '15px';
signalButton.style.fontSize = '16px';
signalButton.style.backgroundColor = '#f00';
signalButton.style.color = '#fff';
signalButton.style.border = 'none';
signalButton.style.borderRadius = '5px';
signalButton.style.cursor = 'pointer';
signalButton.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
signalButton.style.zIndex = 10000;  // Assurer la visibilité
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

    const userText = document.getElementById('userText').value.trim();
    if (userText) {
        // Afficher une notification de chargement
        showNotification('Analyse en cours...');

        // Envoyer le texte collé par l'utilisateur au serveur pour analyse
        fetch('http://localhost:3000/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: userText })  // Envoyer le texte pour analyse
        })
        .then(response => response.json())
        .then(data => {
            // Récupérer correctement le tableau de résultats imbriqué
            const analysisResult = data.analysisResult[0];  // Accès au premier tableau
            const resultText = analysisResult.map(result => 
                `Label: ${result.label}, Score: ${(result.score * 100).toFixed(2)}%`).join('<br>');

            // Afficher les résultats de l'analyse
            showNotification(`Résultats de l'analyse :<br>${resultText}`);
        })
        .catch(error => {
            console.error("Erreur lors de l'analyse :", error);
            showNotification('Erreur lors de l\'analyse du texte.');
        });

        // Réinitialiser le formulaire après soumission
        formContainer.style.display = 'none';
        signalButton.style.display = 'block';
    } else {
        showNotification('Veuillez coller un texte valide.');
    }
});
