# Zotero Paper Search

[![zotero target version](https://img.shields.io/badge/Zotero-7-green?style=flat-square&logo=zotero&logoColor=CC2936)](https://www.zotero.org)

A Zotero plugin that provides quick access to multiple academic search engines directly from the PDF reader.

## Features

- **Multiple Search Engines**: Support for 8 popular academic databases:

  - 📚 **Google Scholar** - Academic papers and citations
  - 🩺 **PubMed** - Biomedical and life science literature
  - 🔬 **arXiv** - Preprints in physics, mathematics, computer science
  - 🧠 **Semantic Scholar** - AI-powered scientific literature search
  - 🔬 **ResearchGate** - Scientific network and publications
  - 📖 **JSTOR** - Academic journals and books
  - ⚡ **IEEE Xplore** - Engineering and technology literature
  - 📚 **SpringerLink** - Scientific, technical and medical content

- **User-Configurable**: Enable/disable search engines through preferences
- **Instant Search**: Select text in PDF and search across chosen databases
- **Multi-language Support**: English and Chinese localizations

## Installation

1. Download the latest XPI file from the [Releases](../../releases) page
2. In Zotero, go to Tools → Add-ons
3. Click the gear icon and select "Install Add-on From File"
4. Select the downloaded XPI file

## Usage

1. Open any PDF in Zotero's PDF reader
2. Select any text in the PDF
3. A popup menu will appear with buttons for your enabled search engines
4. Click any button to search the selected text in that database

## Configuration

Configure which search engines to show:

1. Go to **Zotero → Settings → Paper Search**
2. In the "Search Engines" section, check/uncheck desired search engines
3. Changes take effect immediately

**Default enabled engines**: Google Scholar, PubMed, arXiv, Semantic Scholar

## Development

This plugin was built using the [Zotero Plugin Template](https://github.com/windingwind/zotero-plugin-template).

To set up for development:

1. Clone this repository
2. Copy `.env.example` to `.env` and configure paths
3. Run `npm install`
4. Run `npm start` for development with hot reload

### Building

```bash
npm run build        # Build for production
npm run lint:check   # Check code formatting
npm run lint:fix     # Fix code formatting
```

## License

This project is licensed under the AGPL-3.0-or-later license.
