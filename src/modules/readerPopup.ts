import { getString } from "../utils/locale";

export class ReaderPopupFactory {
  static registerReaderPopup() {
    // @ts-ignore - Zotero types may not be fully available in build environment
    Zotero.Reader.registerEventListener(
      "renderTextSelectionPopup",
      (event: any) => {
        const { reader, doc, params, append } = event;
        const selectedText = params.annotation.text.trim();
        addon.data.selectedText = selectedText;
        
        this.buildGoogleScholarButton(event);
      },
      addon.data.config.addonID,
    );
  }

  static buildGoogleScholarButton(event: any) {
    const { reader, doc, append } = event;
    const selectedText = addon.data.selectedText;

    // Create unique ID for this reader instance
    const makeId = (type: string) =>
      `${addon.data.config.addonRef}-${reader._instanceID}-${type}`;

    // Add Google Scholar search button to the popup
    append(
      ztoolkit.UI.createElement(doc, "button", {
        namespace: "html",
        id: makeId("google-scholar"),
        classList: ["toolbar-button", "wide-button"],
        properties: {
          innerHTML: `📚 ${getString("popup-google-scholar-label")}`,
          title: getString("popup-google-scholar-tooltip"),
        },
        styles: {
          marginTop: "4px",
        },
        listeners: [
          {
            type: "click",
            listener: (ev: Event) => {
              this.searchGoogleScholar(selectedText || "");
              ev.preventDefault();
            },
          },
        ],
      }),
    );
  }

  static searchGoogleScholar(selectedText: string) {
    try {
      if (!selectedText || !selectedText.trim()) {
        ztoolkit.log("No text selected for Google Scholar search");
        return;
      }

      // Clean and encode the search text
      const cleanText = selectedText.replace(/\s+/g, ' ').trim();
      const encodedText = encodeURIComponent(cleanText);
      
      // Create Google Scholar URL
      const scholarUrl = `https://scholar.google.com/scholar?q=${encodedText}`;
      
      // Open in default browser
      // @ts-ignore - Zotero global may not be typed
      ztoolkit.getGlobal("Zotero").launchURL(scholarUrl);
      
      ztoolkit.log(`Searching Google Scholar for: "${cleanText}"`);
      
      // Show success message
      new ztoolkit.ProgressWindow(addon.data.config.addonName)
        .createLine({
          text: `Searching Google Scholar for: "${cleanText.slice(0, 50)}${cleanText.length > 50 ? '...' : ''}"`,
          type: "success",
          progress: 100,
        })
        .show();
        
    } catch (error) {
      ztoolkit.log("Error in Google Scholar search:", error);
      new ztoolkit.ProgressWindow(addon.data.config.addonName)
        .createLine({
          text: "Error searching Google Scholar",
          type: "fail",
          progress: 100,
        })
        .show();
    }
  }
}
