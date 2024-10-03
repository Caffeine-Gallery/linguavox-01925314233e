import { backend } from 'declarations/backend';

const inputText = document.getElementById('inputText');
const targetLang = document.getElementById('targetLang');
const outputText = document.getElementById('outputText');
const speakButton = document.getElementById('speakButton');

let translationTimeout;

async function translateText() {
    const text = inputText.value;
    const target = targetLang.value;

    if (text.trim() === '') {
        outputText.textContent = '';
        speakButton.disabled = true;
        return;
    }

    try {
        // Check if translation exists in the backend
        const cachedTranslation = await backend.getTranslation(`${text}:${target}`);
        
        if (cachedTranslation[0] !== undefined) {
            outputText.textContent = cachedTranslation[0];
            speakButton.disabled = false;
            return;
        }

        // If not in cache, use LibreTranslate API
        const response = await fetch('https://libretranslate.de/translate', {
            method: 'POST',
            body: JSON.stringify({
                q: text,
                source: 'en',
                target: target
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        outputText.textContent = data.translatedText;
        speakButton.disabled = false;

        // Store the translation in the backend
        await backend.addTranslation(`${text}:${target}`, data.translatedText);
    } catch (error) {
        console.error('Translation error:', error);
        outputText.textContent = 'Translation error. Please try again.';
        speakButton.disabled = true;
    }
}

function debounceTranslation() {
    clearTimeout(translationTimeout);
    translationTimeout = setTimeout(translateText, 300);
}

inputText.addEventListener('input', debounceTranslation);
targetLang.addEventListener('change', translateText);

speakButton.addEventListener('click', () => {
    const utterance = new SpeechSynthesisUtterance(outputText.textContent);
    utterance.lang = targetLang.value;
    speechSynthesis.speak(utterance);
});
