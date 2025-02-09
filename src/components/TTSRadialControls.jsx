// import React, { useState, useEffect, useCallback } from "react";
// import ttsService from "../core/tts-service";
// import "../styles/TTSRadialControls.css";

// const TTSRadialControls = ({ text, chatId }) => {
//   const [voices, setVoices] = useState([]);
//   const [selectedVoiceIndex, setSelectedVoiceIndex] = useState("");
//   const [speed, setSpeed] = useState(1);
//   const [isAutoTTSOn, setIsAutoTTSOn] = useState(() => {
//     return localStorage.getItem(`autoTTS_${chatId}`) === "true" || false;
//   });

//   // Load voices and set default to Google US English
//   useEffect(() => {
//     const loadVoices = () => {
//       const availableVoices = ttsService.getVoices();
//       setVoices(availableVoices);

//       const googleUSEnglishIndex = availableVoices.findIndex(
//         (voice) =>
//           voice.name.includes("Google US English") && voice.lang === "en-US"
//       );

//       if (googleUSEnglishIndex !== -1) {
//         setSelectedVoiceIndex(googleUSEnglishIndex.toString());
//         ttsService.setVoiceIndex(googleUSEnglishIndex);
//       } else if (availableVoices.length > 0) {
//         setSelectedVoiceIndex("0");
//         ttsService.setVoiceIndex(0);
//       }
//     };

//     // Load voices initially and when they change
//     loadVoices();
//     window.speechSynthesis.onvoiceschanged = loadVoices;

//     return () => {
//       window.speechSynthesis.onvoiceschanged = null;
//     };
//   }, []);

//   useEffect(() => {
//     localStorage.setItem(`autoTTS_${chatId}`, isAutoTTSOn);
//   }, [isAutoTTSOn, chatId]);

//   // Handle TTS actions
//   const handleAction = useCallback(
//     (action) => {
//       switch (action) {
//         case "play":
//           ttsService.setTtsEnabled(true);
//           ttsService.setSpeechRate(speed);
//           ttsService.setVoiceIndex(parseInt(selectedVoiceIndex, 10));
//           ttsService.speakText(text);
//           break;
//         case "pause":
//           ttsService.pauseSpeech();
//           break;
//         case "resume":
//           ttsService.resumeSpeech();
//           break;
//         case "stop":
//           ttsService.cancelSpeech();
//           break;
//         case "replay":
//           ttsService.cancelSpeech();
//           ttsService.speakText(text);
//           break;
//         default:
//           console.error("Unknown TTS action:", action);
//       }
//     },
//     [text, speed, selectedVoiceIndex]
//   );

//   const handleVoiceChange = useCallback((e) => {
//     setSelectedVoiceIndex(e.target.value);
//     ttsService.setVoiceIndex(parseInt(e.target.value, 10));
//   }, []);

//   const handleSpeedChange = useCallback((e) => {
//     const newSpeed = parseFloat(e.target.value);
//     setSpeed(newSpeed);
//     ttsService.setSpeechRate(newSpeed);
//   }, []);

//   const toggleAutoTTS = useCallback(() => {
//     setIsAutoTTSOn(!isAutoTTSOn);
//   }, [isAutoTTSOn]);

//   // Auto TTS effect should only trigger when text changes if Auto TTS is on
//   useEffect(() => {
//     if (isAutoTTSOn) {
//       handleAction("play");
//     }
//   }, [text, isAutoTTSOn, handleAction]);

//   return (
//     <div className="tts-controls-container">
//       <div className="tts-radial">
//         {["play", "pause", "resume", "stop", "replay"].map((action) => (
//           <button
//             key={action}
//             className={`tts-btn tts-${action}`}
//             onClick={() => handleAction(action)}
//           >
//             {action.charAt(0).toUpperCase() + action.slice(1)}
//           </button>
//         ))}
//         <div className="tts-controls-settings">
//           <div className="tts-settings-row">
//             <label>
//               Auto TTS:
//               <input
//                 type="checkbox"
//                 checked={isAutoTTSOn}
//                 onChange={toggleAutoTTS}
//               />
//             </label>
//             <label>
//               Voice:
//               <select
//                 value={selectedVoiceIndex}
//                 onChange={handleVoiceChange}
//                 className="tts-voice"
//               >
//                 <option value="">Default</option>
//                 {voices.map((voice, index) => (
//                   <option key={index} value={index}>
//                     {voice.name} ({voice.lang})
//                   </option>
//                 ))}
//               </select>
//             </label>
//           </div>
//           {/* Second row: Speed control (Always below) */}
//           <div className="tts-speed-control">
//             <label>
//               Speed:
//               <input
//                 type="range"
//                 min="0.5"
//                 max="2"
//                 step="0.1"
//                 value={speed}
//                 onChange={handleSpeedChange}
//               />
//               <span>{speed}x</span> {/* Speed text aligned properly */}
//             </label>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TTSRadialControls;

import React, { useState, useEffect, useCallback } from "react";
import ttsService from "../core/tts-service";
import "../styles/TTSRadialControls.css";

const TTSRadialControls = ({ text, chatId, storyColor }) => {
  const [voices, setVoices] = useState([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState("");
  const [speed, setSpeed] = useState(1);
  const [isAutoTTSOn, setIsAutoTTSOn] = useState(() => {
    return localStorage.getItem(`autoTTS_${chatId}`) === "true" || false;
  });

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = ttsService.getVoices();
      setVoices(availableVoices);

      const googleUSEnglishIndex = availableVoices.findIndex(
        (voice) =>
          voice.name.includes("Google US English") && voice.lang === "en-US"
      );

      if (googleUSEnglishIndex !== -1) {
        setSelectedVoiceIndex(googleUSEnglishIndex.toString());
        ttsService.setVoiceIndex(googleUSEnglishIndex);
      } else if (availableVoices.length > 0) {
        setSelectedVoiceIndex("0");
        ttsService.setVoiceIndex(0);
      }
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
      switch (action) {
        case "play":
          ttsService.setTtsEnabled(true);
          ttsService.setSpeechRate(speed);
          ttsService.setVoiceIndex(parseInt(selectedVoiceIndex, 10));
          ttsService.speakText(text);
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
          ttsService.speakText(text);
          break;
        default:
          console.error("Unknown TTS action:", action);
      }
    },
    [text, speed, selectedVoiceIndex]
  );

  const handleVoiceChange = useCallback((e) => {
    setSelectedVoiceIndex(e.target.value);
    ttsService.setVoiceIndex(parseInt(e.target.value, 10));
  }, []);

  const handleSpeedChange = useCallback((e) => {
    const newSpeed = parseFloat(e.target.value);
    setSpeed(newSpeed);
    ttsService.setSpeechRate(newSpeed);
  }, []);

  const toggleAutoTTS = useCallback(() => {
    setIsAutoTTSOn(!isAutoTTSOn);
  }, [isAutoTTSOn]);

  useEffect(() => {
    if (isAutoTTSOn) {
      handleAction("play");
    }
  }, [text, isAutoTTSOn, handleAction]);

  return (
    <div
      className="tts-controls-container"
      style={{ backgroundColor: storyColor || "#FFFFFF" }} // Apply the story color
    >
      <div className="tts-radial">
        {["play", "pause", "resume", "stop", "replay"].map((action) => (
          <button
            key={action}
            className={`tts-btn tts-${action}`}
            onClick={() => handleAction(action)}
            style={{
              backgroundColor: storyColor || "#F0F0F0", // Apply the story's color to buttons
              borderColor: "#CCC", // Keep a light border
              color: "#000", // Ensure text remains readable
            }}
          >
            {action.charAt(0).toUpperCase() + action.slice(1)}
          </button>
        ))}
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
                value={selectedVoiceIndex}
                onChange={handleVoiceChange}
                className="tts-voice"
              >
                <option value="">Default</option>
                {voices.map((voice, index) => (
                  <option key={index} value={index}>
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
      </div>
    </div>
  );
};

export default TTSRadialControls;
