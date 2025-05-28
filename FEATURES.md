# Paper Search Extension - Feature Documentation

## Current Features

### 1. Google Scholar Search from PDF Reader

- **Location**: PDF Reader text selection popup
- **Functionality**: Adds a "Search in Google Scholar" button when text is selected
- **Implementation**: `src/modules/readerPopup.ts`

### 2. Preferences Panel

- **Location**: Zotero Settings → Paper Search Settings
- **Functionality**: Simple preferences panel for future configuration options
- **Implementation**: `src/modules/preferenceScript.ts`

## Core Files

### Source Code (`src/`)

- `index.ts` - Main entry point
- `hooks.ts` - Lifecycle hooks and registration
- `addon.ts` - Base addon class
- `modules/readerPopup.ts` - Google Scholar search functionality
- `modules/preferenceScript.ts` - Preferences panel
- `utils/` - Utility functions (locale, prefs, window, ztoolkit)

### Static Assets (`addon/`)

- `manifest.json` - Plugin manifest
- `bootstrap.js` - Bootstrap script
- `prefs.js` - Preferences configuration
- `content/preferences.xhtml` - Preferences UI
- `content/icons/` - Plugin icons
- `locale/` - Localization files (en-US, zh-CN)

## Removed Template Elements

The following template elements have been removed to clean up the extension:

### Removed Files

- `src/modules/examples.ts` - Example implementations
- `src/modules/examples_backup.ts` - Backup example file
- `addon/content/zoteroPane.css` - Example CSS styles
- `doc/` - Template documentation

### Cleaned Up Files

- Simplified `preferenceScript.ts` (removed complex table examples)
- Updated localization files to remove example strings
- Simplified `preferences.xhtml` (removed example form elements)
- Updated `package.json` with proper plugin information
- Cleaned up `README.md` with plugin-specific information

## Extension Architecture

The extension follows a minimal architecture:

1. **Entry Point**: `index.ts` initializes the addon
2. **Lifecycle**: `hooks.ts` handles startup/shutdown and window events
3. **Core Feature**: `readerPopup.ts` provides the Google Scholar search
4. **Configuration**: `preferenceScript.ts` provides basic preferences panel
5. **Utilities**: Helper functions for common operations

This creates a clean, focused extension that only includes the Google Scholar search functionality and basic preferences management.
