// import React, { useState, useEffect, useCallback } from "react";
// import ttsService from "../core/tts-service";
// import "../styles/TTSRadialControlsNew.css";
// import {
//   MdPlayArrow,
//   MdPause,
//   MdReplay,
//   MdStop,
//   MdPlayCircleOutline,
// } from "react-icons/md";

// const TTSRadialControls = ({ text, chatId, storyColor }) => {
//   const [voices, setVoices] = useState([]);
//   const [selectedVoiceIndex, setSelectedVoiceIndex] = useState("");
//   const [speed, setSpeed] = useState(1);
//   const [isAutoTTSOn, setIsAutoTTSOn] = useState(() => {
//     return localStorage.getItem(`autoTTS_${chatId}`) === "true" || false;
//   });

//   // Function to clean text before sending to TTS
//   const cleanTextForTTS = useCallback((inputText) => {
//     // Remove dashes or any other unwanted characters
//     let cleanedText = inputText.replace(/[-–—]{3,}/g, "");

//     // Ensure numbers in lists are read as numbers
//     cleanedText = cleanedText.replace(
//       /(\d+)\.\s/g,
//       (match, number) => `${number}. `
//     );

//     return cleanedText;
//   }, []);

//   // State to manage hover effect
//   const [hoveredButton, setHoveredButton] = useState(null);

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

//     loadVoices();
//     window.speechSynthesis.onvoiceschanged = loadVoices;

//     return () => {
//       window.speechSynthesis.onvoiceschanged = null;
//     };
//   }, []);

//   useEffect(() => {
//     localStorage.setItem(`autoTTS_${chatId}`, isAutoTTSOn);
//   }, [isAutoTTSOn, chatId]);

//   const handleAction = useCallback(
//     (action) => {
//       const cleanedText = cleanTextForTTS(text); // Clean text before passing to TTS

//       switch (action) {
//         case "play":
//           ttsService.setTtsEnabled(true);
//           ttsService.setSpeechRate(speed);
//           ttsService.setVoiceIndex(parseInt(selectedVoiceIndex, 10));
//           ttsService.speakText(cleanedText);
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
//           ttsService.speakText(cleanedText);
//           break;
//         default:
//           console.error("Unknown TTS action:", action);
//       }
//     },
//     [text, speed, selectedVoiceIndex, cleanTextForTTS]
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

//   useEffect(() => {
//     if (isAutoTTSOn) {
//       handleAction("play");
//     }
//   }, [text, isAutoTTSOn, handleAction]);

//   return (
//     <div
//       className="tts-controls-container"
//       style={{ backgroundColor: storyColor || "#FFFFFF" }} // Apply the story color
//     >
//       <div className="tts-radial">
//         {[
//           { action: "play", icon: <MdPlayArrow /> },
//           { action: "pause", icon: <MdPause /> },
//           { action: "resume", icon: <MdPlayCircleOutline /> },
//           { action: "stop", icon: <MdStop /> },
//           { action: "replay", icon: <MdReplay /> },
//         ].map(({ action, icon }) => (
//           <div key={action} className="tts-btn-wrapper">
//             <button
//               className={`tts-btn tts-${action}`}
//               onClick={() => handleAction(action)}
//               onMouseEnter={() => setHoveredButton(action)} // Add mouse enter event
//               onMouseLeave={() => setHoveredButton(null)} // Add mouse leave event
//               style={{
//                 backgroundColor:
//                   hoveredButton === action
//                     ? `hsl(0, 0%, calc(83% - 5%))` // Darken by 5% on hover
//                     : storyColor || "#F0F0F0",
//                 borderColor: "#CCC",
//                 color: "#C3C3C3",
//                 transform:
//                   hoveredButton === action ? "scale(1.05)" : "scale(1)",
//                 transition: "all 0.3s ease", // Smooth transition
//               }}
//             >
//               {icon}
//             </button>
//           </div>
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
//               <span>{speed}x</span>
//             </label>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TTSRadialControls;

// import React, { useState, useEffect, useCallback } from "react";
// import ttsService from "../core/tts-service";
// import "../styles/TTSRadialControlsNew.css";
// import {
//   MdPlayArrow,
//   MdPause,
//   MdReplay,
//   MdStop,
//   MdPlayCircleOutline,
//   MdExpandMore,
//   MdExpandLess,
// } from "react-icons/md";

// const TTSRadialControls = ({ text, chatId, storyColor }) => {
//   const [voices, setVoices] = useState([]);
//   const [selectedVoiceIndex, setSelectedVoiceIndex] = useState("");
//   const [speed, setSpeed] = useState(1);
//   const [isAutoTTSOn, setIsAutoTTSOn] = useState(() => {
//     return localStorage.getItem(`autoTTS_${chatId}`) === "true" || false;
//   });
//   const [hoveredButton, setHoveredButton] = useState(null);
//   const [isAccordionOpen, setIsAccordionOpen] = useState(false);

//   // Function to clean text before sending to TTS
//   const cleanTextForTTS = useCallback((inputText) => {
//     let cleanedText = inputText.replace(/[-–—]{3,}/g, "");
//     cleanedText = cleanedText.replace(
//       /(\d+)\.\s/g,
//       (match, number) => `${number}. `
//     );
//     return cleanedText;
//   }, []);

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

//     loadVoices();
//     window.speechSynthesis.onvoiceschanged = loadVoices;

//     return () => {
//       window.speechSynthesis.onvoiceschanged = null;
//     };
//   }, []);

//   useEffect(() => {
//     localStorage.setItem(`autoTTS_${chatId}`, isAutoTTSOn);
//   }, [isAutoTTSOn, chatId]);

//   const handleAction = useCallback(
//     (action) => {
//       const cleanedText = cleanTextForTTS(text); // Clean text before passing to TTS

//       switch (action) {
//         case "play":
//           ttsService.setTtsEnabled(true);
//           ttsService.setSpeechRate(speed);
//           ttsService.setVoiceIndex(parseInt(selectedVoiceIndex, 10));
//           ttsService.speakText(cleanedText);
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
//           ttsService.speakText(cleanedText);
//           break;
//         default:
//           console.error("Unknown TTS action:", action);
//       }
//     },
//     [text, speed, selectedVoiceIndex, cleanTextForTTS]
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

//   const toggleAccordion = useCallback(() => {
//     setIsAccordionOpen(!isAccordionOpen);
//   }, [isAccordionOpen]);

//   useEffect(() => {
//     if (isAutoTTSOn) {
//       handleAction("play");
//     }
//   }, [text, isAutoTTSOn, handleAction]);

//   return (
//     <div
//       className="tts-controls-container"
//       style={{ backgroundColor: storyColor || "#FFFFFF" }}
//     >
//       <div className="tts-radial">
//         {[
//           { action: "play", icon: <MdPlayArrow /> },
//           { action: "pause", icon: <MdPause /> },
//           { action: "resume", icon: <MdPlayCircleOutline /> },
//           { action: "stop", icon: <MdStop /> },
//           { action: "replay", icon: <MdReplay /> },
//         ].map(({ action, icon }) => (
//           <div key={action} className="tts-btn-wrapper">
//             <button
//               className={`tts-btn tts-${action}`}
//               onClick={() => handleAction(action)}
//               onMouseEnter={() => setHoveredButton(action)}
//               onMouseLeave={() => setHoveredButton(null)}
//               style={{
//                 backgroundColor:
//                   hoveredButton === action
//                     ? `hsl(0, 0%, calc(83% - 5%))`
//                     : storyColor || "#F0F0F0",
//                 borderColor: "#CCC",
//                 color: "#000",
//                 transform:
//                   hoveredButton === action ? "scale(1.05)" : "scale(1)",
//                 transition: "all 0.3s ease",
//               }}
//             >
//               {icon}
//             </button>
//           </div>
//         ))}
//         {/* Accordion Header */}
//         <div className="tts-accordion-header" onClick={toggleAccordion}>
//           <span>Settings</span>
//           {isAccordionOpen ? <MdExpandLess /> : <MdExpandMore />}
//         </div>
//         {/* Accordion Content */}
//         <div
//           className={`tts-controls-settings ${
//             isAccordionOpen ? "open" : "closed"
//           }`}
//         >
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
//               <span>{speed}x</span>
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
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState("");
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
      const cleanedText = cleanTextForTTS(text);

      switch (action) {
        case "play":
          ttsService.setTtsEnabled(true);
          ttsService.setSpeechRate(speed);
          ttsService.setVoiceIndex(parseInt(selectedVoiceIndex, 10));
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
          ttsService.speakText(cleanedText);
          break;
        default:
          console.error("Unknown TTS action:", action);
      }
    },
    [text, speed, selectedVoiceIndex, cleanTextForTTS]
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
                backgroundColor:
                  hoveredButton === action
                    ? `hsl(0, 0%, 88.63%)` // Equivalent to #E2E2E2
                    : storyColor || "#F0F0F0",
                // Change border color to match icon color on hover
                borderColor: hoveredButton === action ? "#9c9c9c" : "#CCC",
                // Change icon color on hover
                color: hoveredButton === action ? "#9c9c9c" : "#C3C3C3",
                transform:
                  hoveredButton === action ? "scale(1.05)" : "scale(1)",
                transition: "all 0.3s ease",
                boxShadow:
                  hoveredButton === action
                    ? "none"
                    : "2px 2px 3px rgba(0, 0, 0, 0.3)",
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
            borderWidth: "1px", // Adds a 1 pixel wide border
            borderStyle: "solid", // Sets the border style to solid
          }}
        >
          <span
            style={{
              color: "#5c5c5c",
              //   textTransform: "uppercase",
              fontSize: "1rem",
              letterSpacing: "1.2px",
            }}
          >
            Settings
          </span>
          {
            isAccordionOpen ? (
              <MdExpandLess style={{ color: "#5c5c5c" }} /> // Change this to your desired color for the expand less icon
            ) : (
              <MdExpandMore style={{ color: "#5c5c5c" }} />
            ) // Change this to your desired color for the expand more icon
          }
        </div>
        {/* Settings Panel (Now Fully Removed from DOM When Closed) */}
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
        )}
      </div>
    </div>
  );
};

export default TTSRadialControls;
