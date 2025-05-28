import { setPref, getPref } from "../utils/prefs";
import { SEARCH_ENGINES } from "./readerPopup";

export async function registerPrefsScripts(_window: Window) {
  // This function is called when the prefs window is opened
  // See addon/content/preferences.xhtml onpaneload
  if (!addon.data.prefs) {
    addon.data.prefs = {
      window: _window,
      columns: [],
      rows: [],
    };
  } else {
    addon.data.prefs.window = _window;
  }
  
  await updatePrefsUI();
  bindPrefEvents();
}

async function updatePrefsUI() {
  // Initialize search engine preferences if they don't exist
  const renderLock = ztoolkit.getGlobal("Zotero").Promise.defer();
  if (addon.data.prefs?.window == undefined) return;
  
  // Ensure all search engine preferences have default values
  SEARCH_ENGINES.forEach((engine) => {
    const prefKey = `searchEngines.${engine.id}` as any;
    const currentValue = getPref(prefKey);
    
    // If preference doesn't exist, set default based on prefs.js
    if (currentValue === undefined) {
      // Default enabled engines
      const defaultEnabled = ["googleScholar", "pubmed", "arxiv", "semanticScholar"];
      setPref(prefKey, defaultEnabled.includes(engine.id));
    }
  });
  
  renderLock.resolve();
}

function bindPrefEvents() {
  // Preference binding is handled automatically by Zotero's preference system
  // The preference elements in the XHTML file are automatically bound to the preferences
  ztoolkit.log("Paper Search preferences initialized");
}
