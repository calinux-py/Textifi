# Textifi

Textifi is a Chrome Web Extension that converts audio files into formatted text using OpenAI's Whisper and GPT models. Simply drag and drop an audio file into the extension popup, and Textifi will transcribe the audio into text, with an option to format the transcription into proper sentences and paragraphs.

---

## Features

- **Audio Transcription:** Uses OpenAI Whisper to convert audio files (MP3, WAV, AAC) into text.
- **AI Text Formatting:** Optionally utilizes GPT-3.5-turbo to reformat the transcribed text into well-structured sentences and paragraphs.
- **User-Friendly Interface:** Simple drag-and-drop functionality with an intuitive design.
- **Customization:** 
  - Toggle between light and dark mode.
  - Enable or disable AI text formatting.
- **Persistent Storage:** Remembers your last used audio file and transcription as well as your API key and settings.

---

## Installation

1. **Download the Extension Files:** Clone or download the repository containing the following files:
   - `manifest.json`
   - `popup.html`
   - `popup.js`
   - `background.js`
   - Icon files (located in the `icons` folder)

2. **Load the Extension in Chrome:**
   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable **Developer mode** using the toggle in the top-right corner.
   - Click **Load unpacked** and select the folder containing the extension files.

---

## Usage

1. **Open the Extension Popup:** Click on the Textifi icon in your browser toolbar to open the popup.
2. **Enter Your OpenAI API Key:** 
   - In the settings panel, enter your OpenAI API key (starting with `sk-...`).
3. **Transcribe Audio:**
   - Drag and drop an audio file into the drop zone or click on the drop zone to select a file.
   - The supported audio formats include MP3, WAV, and AAC.
4. **View and Copy the Transcription:**
   - Once processed, the transcription appears in the result panel.
   - Click the **Copy** button to copy the transcribed text to your clipboard.
5. **Optional Formatting:**
   - Enable the AI Formatting toggle to have GPT-3.5-turbo reformat the transcription into proper sentences and paragraphs.

---

## Configuration & Settings

- **Dark Mode:** Toggle dark mode to switch the extension's color scheme between light and dark themes.
- **API Key Storage:** Your API key is stored using Chrome's `storage.sync` so you only need to enter it once.
- **Last Session Recovery:** Textifi will remember your last transcribed audio file and text for easy reference.

---

## Background

On installation, Textifi sets default settings such as disabling dark mode and clearing any previous audio or text data. These settings are managed using Chrome's `storage.sync` API.

