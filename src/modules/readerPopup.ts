import { getString } from "../utils/locale";
import { getPref } from "../utils/prefs";

// Search engines configuration
export interface SearchEngine {
  id: string;
  name: string;
  url: string;
  icon: string;
  description: string;
}

export const SEARCH_ENGINES: SearchEngine[] = [
  {
    id: "google",
    name: "Google",
    url: "https://www.google.com/search?q={{query}}",
    icon: "🌍",
    description: "General web search (Google)",
  },
  {
    id: "googleScholar",
    name: "Google Scholar",
    url: "https://scholar.google.com/scholar?q={{query}}",
    icon: "📚",
    description: "Academic papers and citations",
  },
  {
    id: "pubmed",
    name: "PubMed",
    url: "https://pubmed.ncbi.nlm.nih.gov/?term={{query}}",
    icon: "🩺",
    description: "Biomedical and life science literature",
  },
  {
    id: "arxiv",
    name: "arXiv",
    url: "https://arxiv.org/search/?query={{query}}&searchtype=all",
    icon: "🔬",
    description: "Preprints in physics, mathematics, computer science",
  },
  {
    id: "semanticScholar",
    name: "Semantic Scholar",
    url: "https://www.semanticscholar.org/search?q={{query}}",
    icon: "🧠",
    description: "AI-powered scientific literature search",
  },
  {
    id: "researchGate",
    name: "ResearchGate",
    url: "https://www.researchgate.net/search?q={{query}}",
    icon: "🔬",
    description: "Scientific network and publications",
  },
  {
    id: "jstor",
    name: "JSTOR",
    url: "https://www.jstor.org/action/doBasicSearch?Query={{query}}",
    icon: "📖",
    description: "Academic journals and books",
  },
  {
    id: "ieee",
    name: "IEEE Xplore",
    url: "https://ieeexplore.ieee.org/search/searchresult.jsp?queryText={{query}}",
    icon: "⚡",
    description: "Engineering and technology literature",
  },
  {
    id: "springer",
    name: "SpringerLink",
    url: "https://link.springer.com/search?query={{query}}",
    icon: "📚",
    description: "Scientific, technical and medical content",
  },
  {
    id: "whereIsMyFossil",
    name: "Where is my fossil?",
    url: "https://migueldlm.github.io/Where-is-my-fossil/?taxon={{query}}",
    icon: "🦕",
    description: "Fossil and paleontological species search",
  },
];

export class ReaderPopupFactory {
  static registerReaderPopup() {
    // @ts-ignore - Zotero types may not be fully available in build environment
    Zotero.Reader.registerEventListener(
      "renderTextSelectionPopup",
      (event: any) => {
        const { reader, doc, params, append } = event;
        const selectedText = params.annotation.text.trim();
        addon.data.selectedText = selectedText;

        this.buildSearchButtons(event);
      },
      addon.data.config.addonID,
    );
  }

  /**
   * Clean and validate text for "Where is my fossil?" search
   * @param text - The selected text to clean
   * @returns Object with cleaned text and whether it's valid for WIMF
   */
  static cleanAndValidateForWIMF(text: string): {
    cleanedText: string;
    isValid: boolean;
  } {
    if (!text || !text.trim()) {
      return { cleanedText: "", isValid: false };
    }

    let cleaned = text.trim();

    // Remove special characters from the beginning (e.g., "(Equus asinus" → "Equus asinus")
    cleaned = cleaned.replace(/^[^\w\s]+/, "");

    // Remove special characters from the end
    cleaned = cleaned.replace(/[^\w\s]+$/, "");

    // Handle hyphenated words (e.g., "Equus as-inus" → "Equus asinus")
    cleaned = cleaned.replace(/(\w)-\s*(\w)/g, "$1$2");

    // Clean up multiple spaces
    cleaned = cleaned.replace(/\s+/g, " ").trim();

    // Count words (split by whitespace)
    const words = cleaned.split(/\s+/).filter((word) => word.length > 0);

    // Only valid if 1-2 words and each word is at least 2 characters
    const isValid =
      words.length >= 1 &&
      words.length <= 2 &&
      words.every((word) => word.length >= 2 && /^[a-zA-Z]+$/.test(word));

    return { cleanedText: cleaned, isValid };
  }

  static buildSearchButtons(event: any) {
    const { reader, doc, append } = event;
    const selectedText = addon.data.selectedText;

    // Get enabled search engines from preferences
    const enabledEngines = this.getEnabledSearchEngines();

    if (enabledEngines.length === 0) {
      // Fallback to Google Scholar if no engines are configured
      enabledEngines.push(SEARCH_ENGINES[0]);
    }

    // Check if "Where is my fossil?" should be shown and get cleaned text
    const wimfValidation = this.cleanAndValidateForWIMF(selectedText || "");

    // Filter engines based on validation
    const filteredEngines = enabledEngines.filter((engine) => {
      if (engine.id === "whereIsMyFossil") {
        return wimfValidation.isValid;
      }
      return true;
    });

    // Create unique ID for this reader instance
    const makeId = (type: string) =>
      `${addon.data.config.addonRef}-${reader._instanceID}-${type}`;

    // Add button for each filtered search engine
    filteredEngines.forEach((engine, index) => {
      // Use cleaned text for WIMF, original text for others
      const searchText =
        engine.id === "whereIsMyFossil"
          ? wimfValidation.cleanedText
          : selectedText;

      append(
        ztoolkit.UI.createElement(doc, "button", {
          namespace: "html",
          id: makeId(`search-${engine.id}`),
          classList: ["toolbar-button", "wide-button"],
          properties: {
            innerHTML: `${engine.icon} ${engine.name}`,
            title: `Search in ${engine.name}: ${engine.description}`,
          },
          styles: {
            marginTop: index === 0 ? "4px" : "2px",
          },
          listeners: [
            {
              type: "click",
              listener: (ev: Event) => {
                this.searchInEngine(engine, searchText || "");
                ev.preventDefault();
              },
            },
          ],
        }),
      );
    });

    // Motor personalizado SOLO si hay DOI
    const customPrefix = getPref("customEngine.prefix");
    const doiMatch = (selectedText || "").match(
      /10\.[0-9]{4,9}\/[\w.()\-;/:%]+/i,
    );
    if (customPrefix && customPrefix.trim() && doiMatch) {
      const customButton = ztoolkit.UI.createElement(doc, "button", {
        namespace: "html",
        id: makeId(`search-custom`),
        classList: ["toolbar-button", "wide-button"], // igual que los otros
        properties: {
          innerHTML: `🌐 Motor personalizado`,
          title: `Buscar usando el motor personalizado: ${customPrefix}`,
        },
        styles: {
          marginTop: "2px", // igual que los otros
        },
        listeners: [
          {
            type: "click",
            listener: (ev: Event) => {
              const rawText = selectedText || "";
              if (!rawText) return;
              // Extraer DOI si está presente
              const doi = doiMatch[0];
              let url = customPrefix.endsWith("/")
                ? customPrefix
                : customPrefix + "/";
              url += encodeURIComponent(doi);
              // @ts-ignore Zotero API is not typed but is available globally
              ztoolkit.getGlobal("Zotero").launchURL(url);
              ev.preventDefault();
            },
          },
        ],
      });
      append(customButton);
    }
  }

  static getEnabledSearchEngines(): SearchEngine[] {
    const enabledEngines: SearchEngine[] = [];

    SEARCH_ENGINES.forEach((engine) => {
      const isEnabled = getPref(`searchEngines.${engine.id}` as any) as boolean;
      if (isEnabled) {
        enabledEngines.push(engine);
      }
    });

    return enabledEngines;
  }

  static searchInEngine(engine: SearchEngine, selectedText: string) {
    try {
      if (!selectedText || !selectedText.trim()) {
        ztoolkit.log(`No text selected for ${engine.name} search`);
        return;
      }

      // For WIMF, the text should already be cleaned, but for others, clean normally
      let cleanText: string;
      if (engine.id === "whereIsMyFossil") {
        // Text should already be cleaned and validated
        cleanText = selectedText.trim();
        ztoolkit.log(`WIMF search with cleaned text: "${cleanText}"`);
      } else {
        // Normal cleaning for other engines
        cleanText = selectedText.replace(/\s+/g, " ").trim();
      }

      const encodedText = encodeURIComponent(cleanText);

      // Create search URL by replacing the query placeholder
      const searchUrl = engine.url.replace("{{query}}", encodedText);

      // Open in default browser
      // @ts-ignore - Zotero global may not be typed
      ztoolkit.getGlobal("Zotero").launchURL(searchUrl);

      ztoolkit.log(`Searching ${engine.name} for: "${cleanText}"`);
    } catch (error) {
      ztoolkit.log(`Error in ${engine.name} search:`, error);
      new ztoolkit.ProgressWindow(addon.data.config.addonName)
        .createLine({
          text: `Error searching ${engine.name}`,
          type: "fail",
          progress: 100,
        })
        .show();
    }
  }
}
