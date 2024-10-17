// Écouter les messages envoyés par le content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message reçu dans background.js :", message);

    if (message.action === "getPageContent") {
        // Récupérer l'onglet actif
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            console.log("Onglet actif récupéré dans background.js :", activeTab);

            // Injecter un script dans l'onglet actif pour récupérer le texte de la page
            chrome.scripting.executeScript({
                target: { tabId: activeTab.id },
                function: () => {
                    console.log("Script injecté dans la page. Tentative de récupération du texte.");
                    // Retourner le texte du corps de la page
                    return document.body.innerText;  
                }
            }, (results) => {
                console.log("Résultats de l'injection du script :", results);
                if (results && results[0] && results[0].result) {
                    const pageContent = results[0].result;
                    console.log("Contenu de la page récupéré :", pageContent);
                    sendResponse({ content: pageContent });
                } else {
                    console.error("Erreur lors de la récupération du contenu de la page ou contenu vide.");
                    sendResponse({ content: null });
                }
            });
        });

        // Indiquer à Chrome que la réponse sera envoyée de manière asynchrone
        return true;
    }
});
