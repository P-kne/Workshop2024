document.getElementById('signalContent').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    chrome.scripting.executeScript({
      target: { tabId: activeTab.id },
      function: signalContent
    });
  });
});

function signalContent() {
  const pageContent = document.body.innerText;  // Récupère le texte de la page
  alert("Contenu à signaler récupéré !");
  console.log(pageContent);  // Log dans la console pour tester
}
