import React, { useState, useEffect, useCallback } from "react";
import ttsService from "../core/tts-service";
import "../styles/TTSRadialControlsNew.css";
import {
  MdPlayArrow,
  MdPause,
  MdReplay,
  MdStop,
  MdPlayCircleOutline,
  MdExpandMore,
  MdExpandLess,
} from "react-icons/md";

const TTSRadialControls = ({ text, chatId, storyColor }) => {
  const [voices, setVoices] = useState([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(null); // Initialize as null, set default later
  const [speed, setSpeed] = useState(1);
  const [isAutoTTSOn, setIsAutoTTSOn] = useState(() => {
    return localStorage.getItem(`autoTTS_${chatId}`) === "true" || false;
  });
  const [hoveredButton, setHoveredButton] = useState(null);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  // Clean text for TTS
  const cleanTextForTTS = useCallback((inputText) => {
    let cleanedText = inputText.replace(/[-–—]{3,}/g, "");
    cleanedText = cleanedText.replace(
      /(\d+)\.\s/g,
      (match, number) => `${number}. `
    );
    return cleanedText;
  }, []);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = ttsService.getVoices();
      setVoices(availableVoices);

      // Find Google US English voice
      const googleUSEnglishIndex = availableVoices.findIndex(
        (voice) =>
          voice.name.includes("Google US English") && voice.lang === "en-US"
      );
      const defaultVoiceIndex =
        googleUSEnglishIndex !== -1 ? googleUSEnglishIndex : -1; // -1 for browser default if not found
      setSelectedVoiceIndex(defaultVoiceIndex.toString());
      ttsService.setVoiceIndex(defaultVoiceIndex); // Set the default voice
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(`autoTTS_${chatId}`, isAutoTTSOn);
  }, [isAutoTTSOn, chatId]);

  const handleAction = useCallback(
    (action) => {
      const cleanedText = cleanTextForTTS(text);

      switch (action) {
        case "play":
          ttsService.setTtsEnabled(true);
          ttsService.setSpeechRate(speed);
          // Use the default voice index set in useEffect
          ttsService.setVoiceIndex(
            selectedVoiceIndex !== null ? parseInt(selectedVoiceIndex, 10) : -1
          );
          ttsService.speakText(cleanedText);
          break;
        case "pause":
          ttsService.pauseSpeech();
          break;
        case "resume":
          ttsService.resumeSpeech();
          break;
        case "stop":
          ttsService.cancelSpeech();
          break;
        case "replay":
          ttsService.cancelSpeech();
          ttsService.setVoiceIndex(
            selectedVoiceIndex !== null ? parseInt(selectedVoiceIndex, 10) : -1
          );
          ttsService.speakText(cleanedText);
          break;
        default:
          console.error("Unknown TTS action:", action);
      }
    },
    [text, speed, selectedVoiceIndex, cleanTextForTTS]
  );

  const handleVoiceChange = useCallback((e) => {
    // Disable user changes, this function won't be triggered due to 'disabled' on select
    console.warn("Voice change attempted but disabled");
  }, []);

  const handleSpeedChange = useCallback((e) => {
    const newSpeed = parseFloat(e.target.value);
    setSpeed(newSpeed);
    ttsService.setSpeechRate(newSpeed);
  }, []);

  const toggleAutoTTS = useCallback(() => {
    setIsAutoTTSOn(!isAutoTTSOn);
  }, [isAutoTTSOn]);

  const toggleAccordion = useCallback(() => {
    setIsAccordionOpen(!isAccordionOpen);
  }, [isAccordionOpen]);

  useEffect(() => {
    if (isAutoTTSOn) {
      handleAction("play");
    }
  }, [text, isAutoTTSOn, handleAction]);

  return (
    <div
      className="tts-controls-container"
      style={{ backgroundColor: storyColor || "#FFFFFF" }}
    >
      <div className="tts-radial">
        {[
          { action: "play", icon: <MdPlayArrow /> },
          { action: "pause", icon: <MdPause /> },
          { action: "resume", icon: <MdPlayCircleOutline /> },
          { action: "stop", icon: <MdStop /> },
          { action: "replay", icon: <MdReplay /> },
        ].map(({ action, icon }) => (
          <div key={action} className="tts-btn-wrapper">
            <button
              className={`tts-btn tts-${action}`}
              onClick={() => handleAction(action)}
              onMouseEnter={() => setHoveredButton(action)}
              onMouseLeave={() => setHoveredButton(null)}
              style={{
                backgroundColor: storyColor || "#F0F0F0",
                borderColor: hoveredButton === action ? "#9c9c9c" : "#CCC",
                color: hoveredButton === action ? "#9c9c9c" : "#C3C3C3",
                transform:
                  hoveredButton === action ? "scale(1.05)" : "scale(1)",
                transition: "all 0.3s ease",
                boxShadow:
                  hoveredButton === action
                    ? "none"
                    : "2px 2px 3px rgba(0, 0, 0, 0.3)",
                ...(hoveredButton === action && {
                  backgroundBlendMode: "overlay",
                }),
              }}
            >
              {icon}
            </button>
          </div>
        ))}
        {/* Accordion Header */}
        <div
          className="tts-accordion-header"
          onClick={toggleAccordion}
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.07)",
            borderColor: "#C3C3C3",
            borderWidth: "1px",
            borderStyle: "solid",
          }}
        >
          <span
            style={{
              color: "#5c5c5c",
              fontSize: "1rem",
              letterSpacing: "1.2px",
            }}
          >
            Settings
          </span>
          {isAccordionOpen ? (
            <MdExpandLess style={{ color: "#5c5c5c" }} />
          ) : (
            <MdExpandMore style={{ color: "#5c5c5c" }} />
          )}
        </div>
        {/* Settings Panel */}
        {isAccordionOpen && (
          <div className="tts-controls-settings">
            <div className="tts-settings-row">
              <label>
                Auto TTS:
                <input
                  type="checkbox"
                  checked={isAutoTTSOn}
                  onChange={toggleAutoTTS}
                />
              </label>
              <label>
                Voice:
                <select
                  value={selectedVoiceIndex !== null ? selectedVoiceIndex : ""}
                  onChange={handleVoiceChange}
                  className="tts-voice"
                  disabled // Prevent user changes
                >
                  <option value="">Default</option>
                  {voices.map((voice, index) => (
                    <option key={index} value={index.toString()}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="tts-speed-control">
              <label>
                Speed:
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={speed}
                  onChange={handleSpeedChange}
                />
                <span>{speed}x</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TTSRadialControls;
