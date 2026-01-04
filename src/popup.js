/**
 * Popup script - načte lokalizované texty a verzi rozšíření
 */
document.addEventListener('DOMContentLoaded', () => {
  // Získáme informace z manifestu
  const manifest = chrome.runtime.getManifest();

  // Nastavíme verzi
  document.getElementById('extVersion').textContent = 'v' + manifest.version;

  // Nastavíme název (z lokalizace)
  document.getElementById('extName').textContent = chrome.i18n.getMessage('extensionName') || manifest.name;

  // Nastavíme popis
  document.getElementById('extDesc').textContent = chrome.i18n.getMessage('extensionDescription') || manifest.description;

  // Lokalizované texty pro popup
  const sitesTitle = chrome.i18n.getMessage('popupSitesTitle');
  if (sitesTitle) {
    document.getElementById('sitesTitle').textContent = sitesTitle;
  }

  const howToUse = chrome.i18n.getMessage('popupHowToUse');
  if (howToUse) {
    document.getElementById('howToUse').textContent = howToUse;
  }

  const instructions = chrome.i18n.getMessage('popupInstructions');
  if (instructions) {
    document.getElementById('instructions').innerHTML =
      '<strong>' + (howToUse || 'Jak používat:') + '</strong><br>' + instructions;
  }
});
