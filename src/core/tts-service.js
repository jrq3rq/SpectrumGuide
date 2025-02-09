// const ttsService = (() => {
//   let ttsEnabled = false;
//   let currentRate = 1;
//   let selectedVoiceIndex = null;
//   let currentUtterance = null;
//   let isPaused = false;

//   function initializeTTS() {
//     const voices = getVoices();
//     const googleVoiceIndex = voices.findIndex(
//       (voice) =>
//         voice.name.includes("Google US English") && voice.lang === "en-US"
//     );

//     if (googleVoiceIndex !== -1) {
//       setVoiceIndex(googleVoiceIndex);
//     }
//   }

//   function setTtsEnabled(value) {
//     ttsEnabled = value;
//     if (!value) cancelSpeech();
//   }

//   function getTtsEnabled() {
//     return ttsEnabled;
//   }

//   function setSpeechRate(rate) {
//     currentRate = rate;
//   }

//   function getSpeechRate() {
//     return currentRate;
//   }

//   function setVoiceIndex(index) {
//     selectedVoiceIndex = index;
//   }

//   function getVoiceIndex() {
//     return selectedVoiceIndex;
//   }

//   function getVoices() {
//     return window.speechSynthesis.getVoices();
//   }

//   function speakText(text) {
//     if (!ttsEnabled) {
//       console.log("TTS is disabled.");
//       return;
//     }
//     if (!text) {
//       console.warn("No text provided to speak.");
//       return;
//     }
//     cancelSpeech();

//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.rate = currentRate;

//     const voices = getVoices();
//     if (selectedVoiceIndex !== null && voices[selectedVoiceIndex]) {
//       utterance.voice = voices[selectedVoiceIndex];
//     }

//     currentUtterance = utterance;
//     window.speechSynthesis.speak(utterance);
//   }

//   function pauseSpeech() {
//     if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
//       window.speechSynthesis.pause();
//       isPaused = true;
//     }
//   }

//   function resumeSpeech() {
//     if (isPaused) {
//       window.speechSynthesis.resume();
//       isPaused = false;
//     }
//   }

//   function cancelSpeech() {
//     window.speechSynthesis.cancel();
//     currentUtterance = null;
//     isPaused = false;
//   }

//   return {
//     initializeTTS,
//     setTtsEnabled,
//     getTtsEnabled,
//     setSpeechRate,
//     getSpeechRate,
//     setVoiceIndex,
//     getVoiceIndex,
//     getVoices,
//     speakText,
//     pauseSpeech,
//     resumeSpeech,
//     cancelSpeech,
//   };
// })();

// // Initialize TTS on load
// ttsService.initializeTTS();

// export default ttsService;
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

    // Split text into sentences (or fallback to the full text if no match)
    const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [text];
    let currentIndex = 0;

    const speakNext = () => {
      if (currentIndex < sentences.length) {
        const utterance = new SpeechSynthesisUtterance(
          sentences[currentIndex].trim()
        );
        utterance.rate = currentRate;
        // Set the selected voice if available
        const voices = getVoices();
        if (selectedVoiceIndex !== null && voices[selectedVoiceIndex]) {
          utterance.voice = voices[selectedVoiceIndex];
        }
        utterance.onend = () => {
          currentIndex++;
          speakNext();
        };
        window.speechSynthesis.speak(utterance);
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
