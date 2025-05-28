# Multiple Search Engines Feature

This document describes the multiple search engines feature implemented in the Paper Search extension for Zotero.

## Overview

The extension now supports 8 different academic search engines that users can enable/disable through the preferences panel. When text is selected in the PDF reader, buttons for all enabled search engines will appear in the context menu.

## Supported Search Engines

| Engine               | ID                | Default     | Description                                         |
| -------------------- | ----------------- | ----------- | --------------------------------------------------- |
| **Google Scholar**   | `googleScholar`   | ✅ Enabled  | Academic papers and citations                       |
| **PubMed**           | `pubmed`          | ✅ Enabled  | Biomedical and life science literature              |
| **arXiv**            | `arxiv`           | ✅ Enabled  | Preprints in physics, mathematics, computer science |
| **Semantic Scholar** | `semanticScholar` | ✅ Enabled  | AI-powered scientific literature search             |
| **ResearchGate**     | `researchGate`    | ❌ Disabled | Scientific network and publications                 |
| **JSTOR**            | `jstor`           | ❌ Disabled | Academic journals and books                         |
| **IEEE Xplore**      | `ieee`            | ❌ Disabled | Engineering and technology literature               |
| **SpringerLink**     | `springer`        | ❌ Disabled | Scientific, technical and medical content           |

## User Configuration

Users can configure which search engines to show by:

1. Going to `Zotero → Settings → Paper Search`
2. In the "Search Engines" section, checking/unchecking the desired search engines
3. Changes take effect immediately

## Technical Implementation

### File Structure

- **`src/modules/readerPopup.ts`**: Main logic for search engines and popup generation
- **`addon/content/preferences.xhtml`**: UI for search engine checkboxes
- **`addon/prefs.js`**: Default preference values
- **`typings/prefs.d.ts`**: TypeScript type definitions for preferences
- **Localization files**: Labels and descriptions for all search engines

### Key Components

#### SearchEngine Interface

```typescript
interface SearchEngine {
  id: string; // Unique identifier
  name: string; // Display name
  url: string; // Search URL template with {{query}} placeholder
  icon: string; // Emoji icon
  description: string; // Human-readable description
}
```

#### Configuration

Search engines are defined in `SEARCH_ENGINES` array with URL templates that use `{{query}}` as a placeholder for the search text.

#### Preference Keys

Each search engine has a corresponding preference key:

- `extensions.zotero.papersearch.searchEngines.googleScholar`
- `extensions.zotero.papersearch.searchEngines.pubmed`
- etc.

### Workflow

1. User selects text in PDF reader
2. `buildSearchButtons()` is called
3. `getEnabledSearchEngines()` filters engines based on user preferences
4. Buttons are created for each enabled engine
5. Clicking a button calls `searchInEngine()` which opens the search URL

## Localization

The extension supports multiple languages:

### English (`en-US`)

- Full labels and tooltips for all search engines
- Preference panel descriptions

### Chinese (`zh-CN`)

- Translated labels and tooltips
- Localized preference descriptions

## Adding New Search Engines

To add a new search engine:

1. Add entry to `SEARCH_ENGINES` array in `readerPopup.ts`
2. Add preference definition to `typings/prefs.d.ts`
3. Add default value to `addon/prefs.js`
4. Add checkbox to `addon/content/preferences.xhtml`
5. Add localization strings to all `.ftl` files

## Testing

The extension has been tested with:

- ✅ Compilation without errors
- ✅ Code formatting and linting
- ✅ TypeScript type checking
- ✅ Default preference values
- ✅ Localization files

## Future Enhancements

Potential improvements:

- Custom search engine URLs
- Reordering of search engines
- Search engine grouping/categories
- Per-document search engine preferences
- Search history
