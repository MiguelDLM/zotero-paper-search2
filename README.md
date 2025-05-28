# Zotero Paper Search

[![zotero target version](https://img.shields.io/badge/Zotero-7-green?style=flat-square&logo=zotero&logoColor=CC2936)](https://www.zotero.org)

A Zotero plugin that adds Google Scholar search functionality to the PDF reader's text selection popup.

## Features

- **Google Scholar Search**: Select any text in a PDF and search it directly in Google Scholar
- **Simple Configuration**: Minimal preferences panel for easy setup

## Installation

1. Download the latest XPI file from the [Releases](../../releases) page
2. In Zotero, go to Tools → Add-ons
3. Click the gear icon and select "Install Add-on From File"
4. Select the downloaded XPI file

## Usage

1. Open any PDF in Zotero's PDF reader
2. Select any text in the PDF
3. A popup menu will appear with a "Search in Google Scholar" option
4. Click it to search the selected text in Google Scholar

## Configuration

The plugin includes a simple preferences panel accessible through:

- Zotero → Settings → Paper Search Settings

## Development

This plugin was built using the [Zotero Plugin Template](https://github.com/windingwind/zotero-plugin-template).

To set up for development:

1. Clone this repository
2. Copy `.env.example` to `.env` and configure paths
3. Run `npm install`
4. Run `npm start` for development with hot reload

## License

This project is licensed under the AGPL-3.0-or-later license.
