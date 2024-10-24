<p align="center"><img src="/src/assets/images/android-chrome-96x96.png" alt="ReadTheVoice logo"></p>
<h2 align="center">ReadTheVoice</h2>
<p align="center">Make your presentations more accessible with real-time speech transcription</p>
<p align="center">
    <a href="#about">About</a> •
    <a href="#features">Features</a> •
    <a href="#deploy">Deploy</a> •
    <a href="#support">Support</a>
</p>

## About

I needed a simple tool to make presentations, streams, and speeches more accessible to the hearing impaired.  
Existing solutions were often complicated, expensive, or didn't offer the flexibility I needed.  
That's why I created ReadTheVoice: an easy-to-use, browser-based tool that displays real-time transcriptions in a floating window.

ReadTheVoice leverages two key browser APIs to provide its functionality:
1. The Web Speech API for real-time speech recognition and transcription.
2. The Picture-in-Picture API to create the floating window that displays the transcription.

Due to its reliance on these APIs, ReadTheVoice is compatible with all browsers that support them. This includes Google Chrome and Chromium-based browsers such as Microsoft Edge, Brave, and Vivaldi. Unfortunately, Mozilla Firefox does not currently support these features, so ReadTheVoice is not compatible with Firefox.

If your browser doesn't support these APIs, you'll see a message indicating that certain features required for ReadTheVoice to work properly are not available.

## Features

- ✅ **Easy to Use**: Choose your language, click a button, and start speaking - it's that simple
- ✅ **Versatile**: Perfect for presentations, streams, political meetings, lectures, and more
- ✅ **Floating Window**: Displays transcriptions in a movable window that stays on top of other applications
- ✅ **Economic**: Completely free to use, leveraging your browser's built-in capabilities
- ✅ **Ad-Free & Tracker-Free**: A clean, respectful internet experience

## Deploy

### Install dependencies

First check that you have **Node.js** and **npm** installed on your machine.  
Install **Node.js dependencies**:  
```bash
npm install
```

### Build assets
Don't forget to **generate the assets**:
```bash
npm run build
```
**NOTE**: You **do not need to transfer** the **`node_modules`** folder **to your server** once the assets have been compiled.

## License

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program. If not, see http://www.gnu.org/licenses/.
