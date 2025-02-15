const ttsService = (() => {
  let ttsEnabled = false;
  let currentRate = 1;
  let selectedVoiceIndex = null;
  let currentUtterance = null;
  let isPaused = false;

  function initializeTTS() {
    const voices = getVoices();
    const googleVoiceIndex = voices.findIndex(
      (voice) =>
        voice.name.includes("Google US English") && voice.lang === "en-US"
    );

    if (googleVoiceIndex !== -1) {
      setVoiceIndex(googleVoiceIndex);
    }
  }

  function setTtsEnabled(value) {
    ttsEnabled = value;
    if (!value) cancelSpeech();
  }

  function getTtsEnabled() {
    return ttsEnabled;
  }

  function setSpeechRate(rate) {
    currentRate = rate;
  }

  function getSpeechRate() {
    return currentRate;
  }

  function setVoiceIndex(index) {
    selectedVoiceIndex = index;
  }

  function getVoiceIndex() {
    return selectedVoiceIndex;
  }

  function getVoices() {
    return window.speechSynthesis.getVoices();
  }

  function speakText(text) {
    if (!ttsEnabled) {
      console.log("TTS is disabled.");
      return;
    }
    if (!text) {
      console.warn("No text provided to speak.");
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Pre-process text to handle formatting:
    let processedText = text.replace(/\s*\n\s*\n\s*/g, "\n").trim(); // Remove extra newlines
    processedText = processedText.replace(/---+/g, "..."); // Replace "---" with ellipses or omit if you want silence

    // Split text into sentences or paragraphs, assuming paragraphs might be separated by single newlines after cleaning
    const paragraphs = processedText.split("\n");
    let currentIndex = 0;

    const speakNext = () => {
      if (currentIndex < paragraphs.length) {
        const paragraph = paragraphs[currentIndex].trim();
        if (paragraph) {
          // Only speak if the paragraph is not empty
          const sentences = paragraph.match(/[^\.!\?]+[\.!\?]+/g) || [
            paragraph,
          ];
          let sentenceIndex = 0;

          const speakSentence = () => {
            if (sentenceIndex < sentences.length) {
              const utterance = new SpeechSynthesisUtterance(
                sentences[sentenceIndex].trim()
              );
              utterance.rate = currentRate;
              // Set the selected voice if available
              const voices = getVoices();
              if (selectedVoiceIndex !== null && voices[selectedVoiceIndex]) {
                utterance.voice = voices[selectedVoiceIndex];
              }
              utterance.onend = () => {
                sentenceIndex++;
                if (sentenceIndex < sentences.length) {
                  speakSentence();
                } else {
                  currentIndex++;
                  speakNext();
                }
              };
              window.speechSynthesis.speak(utterance);
            } else {
              currentIndex++;
              speakNext();
            }
          };

          speakSentence();
        } else {
          currentIndex++;
          speakNext();
        }
      }
    };

    speakNext();
  }

  function pauseSpeech() {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      isPaused = true;
    }
  }

  function resumeSpeech() {
    if (isPaused) {
      window.speechSynthesis.resume();
      isPaused = false;
    }
  }

  function cancelSpeech() {
    window.speechSynthesis.cancel();
    currentUtterance = null;
    isPaused = false;
  }

  return {
    initializeTTS,
    setTtsEnabled,
    getTtsEnabled,
    setSpeechRate,
    getSpeechRate,
    setVoiceIndex,
    getVoiceIndex,
    getVoices,
    speakText,
    pauseSpeech,
    resumeSpeech,
    cancelSpeech,
  };
})();

// Initialize TTS on load
ttsService.initializeTTS();

export default ttsService;
