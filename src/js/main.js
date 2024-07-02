import "../scss/styles.scss";
import "masonry-layout";

import {Accordion, Modal} from "bootstrap";

let recognition;
let isRecording = false;
let defaultText = "Press \"Start Transcription\" to start real-time transcription."
let displayText = defaultText;
let interimText = "";
let scrollOffset = 0;
let lastInterimResult = "";
let micAccessModal;

document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("#use-js").style.visibility = "visible";
    const languageSelect = document.getElementById("languageSelect");
    const userLang = navigator.language || navigator.userLanguage;
    const unsupportedWarning = document.getElementById("unsupported-warning");
    const transcriptButton = document.getElementById("startTranscript");

    const languageMap = {
        "af": "af-ZA",
        "am": "am-ET",
        "az": "az-AZ",
        "bn": "bn-BD",
        "id": "id-ID",
        "ms": "ms-MY",
        "ca": "ca-ES",
        "cs": "cs-CZ",
        "da": "da-DK",
        "de": "de-DE",
        "en": "en-US",
        "es": "es-ES",
        "eu": "eu-ES",
        "fil": "fil-PH",
        "fr": "fr-FR",
        "jv": "jv-ID",
        "gl": "gl-ES",
        "gu": "gu-IN",
        "hr": "hr-HR",
        "zu": "zu-ZA",
        "is": "is-IS",
        "it": "it-IT",
        "kn": "kn-IN",
        "km": "km-KH",
        "lv": "lv-LV",
        "lt": "lt-LT",
        "ml": "ml-IN",
        "mr": "mr-IN",
        "hu": "hu-HU",
        "lo": "lo-LA",
        "nl": "nl-NL",
        "ne": "ne-NP",
        "nb": "nb-NO",
        "pl": "pl-PL",
        "pt": "pt-PT",
        "ro": "ro-RO",
        "si": "si-LK",
        "sl": "sl-SI",
        "su": "su-ID",
        "sk": "sk-SK",
        "fi": "fi-FI",
        "sv": "sv-SE",
        "sw": "sw-TZ",
        "ka": "ka-GE",
        "hy": "hy-AM",
        "ta": "ta-IN",
        "te": "te-IN",
        "vi": "vi-VN",
        "tr": "tr-TR",
        "ur": "ur-PK",
        "el": "el-GR",
        "bg": "bg-BG",
        "ru": "ru-RU",
        "sr": "sr-RS",
        "uk": "uk-UA",
        "ko": "ko-KR",
        "cmn": "cmn-Hans-CN",
        "yue": "yue-Hant-HK",
        "ja": "ja-JP",
        "hi": "hi-IN",
        "th": "th-TH"
    };

    const langCode = userLang.split("-")[0];
    languageSelect.value = languageMap[langCode] || "en-US";

    if (!("webkitSpeechRecognition" in window) || !document.pictureInPictureEnabled) {
        unsupportedWarning.style.display = "block";
        transcriptButton.classList.add("disabled");
    } else {
        transcriptButton.addEventListener("click", toggleSpeechRecognition);
    }

    const videoElement = document.getElementById("video");
    videoElement.addEventListener("enterpictureinpicture", async () => {
        if (!isRecording) {
            await startSpeechRecognition();
            transcriptButton.textContent = "Stop Transcription";
            isRecording = true;
        }
    });
    videoElement.addEventListener("leavepictureinpicture", () => {
        if (isRecording) {
            stopSpeechRecognition();
            transcriptButton.textContent = "Start Transcription";
            isRecording = false;
        }
    });

    const modalHtml = `
        <div class="modal fade" id="micAccessModal" tabindex="-1" aria-labelledby="micAccessModalLabel" aria-hidden="true">

    <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content rounded-4 shadow">
      <div class="modal-header border-bottom-0">
        <h1 class="modal-title fs-5" id="micAccessModalLabel">Microphone Access Required</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body py-0">
        <p>ReadTheVoice requires access to your microphone for transcription. Please grant microphone access and try again.</p>
      </div>
      <div class="modal-footer flex-column align-items-stretch w-100 gap-2 pb-3 border-top-0">
        <button type="button" class="btn btn-lg btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>`
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    micAccessModal = new Modal(document.getElementById('micAccessModal'));
});

const videoElement = document.getElementById("video");
const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 120;
const stream = canvas.captureStream(30);
videoElement.srcObject = stream;

function updateCanvas() {
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "white";
    context.font = "25px sans-serif";

    const maxWidth = canvas.width - 10;
    const lineHeight = 35;

    let allText = displayText + (interimText ? " " + interimText : "");
    let wrappedLines = wrapText(context, allText, maxWidth);

    let totalHeight = wrappedLines.length * lineHeight;

    if (totalHeight > canvas.height) {
        scrollOffset = totalHeight - canvas.height + 20;
    } else {
        scrollOffset = 0;
    }

    wrappedLines.forEach((line, index) => {
        let y = (index + 1) * lineHeight - scrollOffset;
        context.fillText(line, 5, y);
    });

    requestAnimationFrame(updateCanvas);
}


function wrapText(context, text, maxWidth) {
    let lines = [];
    let paragraphs = text.split("\n");

    paragraphs.forEach(paragraph => {
        let words = paragraph.split(" ");
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            let word = words[i];
            let width = context.measureText(currentLine + " " + word).width;
            if (width < maxWidth) {
                currentLine += (currentLine ? " " : "") + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
    });

    return lines;
}

updateCanvas();

async function toggleSpeechRecognition() {
    const transcriptButton = document.getElementById("startTranscript");
    const videoElement = document.getElementById("video");

    if (isRecording) {
        stopSpeechRecognition();
        transcriptButton.textContent = "Start Transcription";
        isRecording = false;

        if (document.pictureInPictureElement) {
            try {
                await document.exitPictureInPicture();
            } catch (err) {
                console.error("Error closing PiP mode:", err);
            }
        }
    } else {
        try {
            await navigator.mediaDevices.getUserMedia({audio: true});
            startSpeechRecognition();
            transcriptButton.textContent = "Stop Transcription";
            isRecording = true;

            if (document.pictureInPictureEnabled && !document.pictureInPictureElement) {
                await videoElement.requestPictureInPicture();
            }
        } catch (err) {
            console.error("Error accessing microphone:", err);
            handleMicrophoneAccessError();
        }
    }
}

function startSpeechRecognition() {
    recognition = new webkitSpeechRecognition();
    const languageSelect = document.getElementById("languageSelect");

    recognition.lang = languageSelect.value;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = function () {
        displayText = ""
    };

    recognition.onresult = function (event) {
        let finalTranscript = "";
        let currentInterimResult = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript.trim() + "\n";
            } else {
                currentInterimResult += event.results[i][0].transcript;
            }
        }

        if (finalTranscript !== "") {

            displayText += finalTranscript;
            lastInterimResult = "";
        }

        interimText = currentInterimResult;
        lastInterimResult = currentInterimResult;

        if (displayText.length > 1000) {
            let lastNewlineIndex = displayText.lastIndexOf("\n", displayText.length - 500);
            if (lastNewlineIndex !== -1) {
                displayText = displayText.slice(lastNewlineIndex + 1);
            } else {
                displayText = displayText.slice(-500);
            }
        }
    };


    recognition.onerror = function (event) {
        console.error("Voice recognition error:", event.error);
    };

    recognition.onend = function () {
        if (isRecording) {
            recognition.start();
        }
    };

    navigator.mediaDevices.getUserMedia({audio: true})
        .then(function (stream) {
            recognition.start();
        })
        .catch(function (err) {
            console.error("Error accessing microphone:", err);
            handleMicrophoneAccessError();
        });
}

function handleMicrophoneAccessError() {
    isRecording = false;
    const transcriptButton = document.getElementById("startTranscript");
    transcriptButton.textContent = "Start Transcription";

    if (document.pictureInPictureElement) {
        document.exitPictureInPicture().catch(console.error);
    }

    micAccessModal.show();
}

function stopSpeechRecognition() {
    if (recognition) {
        recognition.stop();
    }
    displayText = defaultText;
    interimText = "";
    scrollOffset = 0;
}
