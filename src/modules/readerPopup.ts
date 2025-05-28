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

  static buildSearchButtons(event: any) {
    const { reader, doc, append } = event;
    const selectedText = addon.data.selectedText;

    // Get enabled search engines from preferences
    const enabledEngines = this.getEnabledSearchEngines();

    if (enabledEngines.length === 0) {
      // Fallback to Google Scholar if no engines are configured
      enabledEngines.push(SEARCH_ENGINES[0]);
    }

    // Create unique ID for this reader instance
    const makeId = (type: string) =>
      `${addon.data.config.addonRef}-${reader._instanceID}-${type}`;

    // Add button for each enabled search engine
    enabledEngines.forEach((engine, index) => {
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
                this.searchInEngine(engine, selectedText || "");
                ev.preventDefault();
              },
            },
          ],
        }),
      );
    });

    // Motor personalizado SOLO si hay DOI
    const customPrefix = getPref("customEngine.prefix");
    const doiMatch = (selectedText || "").match(/10\.[0-9]{4,9}\/[\w.()\-;\/:%]+/i);
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
              let url = customPrefix.endsWith("/") ? customPrefix : customPrefix + "/";
              url += encodeURIComponent(doi);
              // @ts-ignore
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

      // Clean and encode the search text
      const cleanText = selectedText.replace(/\s+/g, " ").trim();
      const encodedText = encodeURIComponent(cleanText);

      // Create search URL by replacing the query placeholder
      const searchUrl = engine.url.replace("{{query}}", encodedText);

      // Open in default browser
      // @ts-ignore - Zotero global may not be typed
      ztoolkit.getGlobal("Zotero").launchURL(searchUrl);

      ztoolkit.log(`Searching ${engine.name} for: "${cleanText}"`);

      // Show success message
      new ztoolkit.ProgressWindow(addon.data.config.addonName)
        .createLine({
          text: `Searching ${engine.name} for: "${cleanText.slice(0, 50)}${cleanText.length > 50 ? "..." : ""}"`,
          type: "success",
          progress: 100,
        })
        .show();
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
