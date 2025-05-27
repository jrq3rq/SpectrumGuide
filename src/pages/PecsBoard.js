// import React, { useState, useEffect, useRef } from "react";
// import { Link } from "react-router-dom";
// import { firestore } from "../firebase";
// import { collection, getDocs } from "firebase/firestore";
// import { useUser } from "../context/UserContext";
// import {
//   FaBookOpen,
//   FaCalculator,
//   FaPencilAlt,
//   FaGlobe,
//   FaLandmark,
//   FaSmileBeam,
//   FaPaintBrush,
//   FaRunning,
//   FaDrum,
//   FaMicroscope,
//   FaBook,
//   FaHandsHelping,
//   FaVolumeDown,
//   FaRegGrinStars,
//   FaThumbsUp,
//   FaUserShield,
//   FaBan,
//   FaHandPaper,
//   FaHandRock,
//   FaUserTimes,
//   FaHome,
// } from "react-icons/fa";
// import html2canvas from "html2canvas";
// import { pdfjs } from "react-pdf";
// import "../styles/PecsBoard.css";

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// // ImageUploader Component
// const ImageUploader = ({ maxImages, onImagesChange }) => {
//   const [images, setImages] = useState([]);
//   const [error, setError] = useState(null);

//   const handleFileChange = async (e) => {
//     const files = Array.from(e.target.files);
//     if (images.length + files.length > maxImages) {
//       setError(`You can only upload up to ${maxImages} images.`);
//       return;
//     }

//     const newImages = [];
//     for (const file of files) {
//       if (file.type === "application/pdf") {
//         try {
//           const url = URL.createObjectURL(file);
//           const pdf = await pdfjs.getDocument(url).promise;
//           const page = await pdf.getPage(1);
//           const viewport = page.getViewport({ scale: 1.0 });

//           const canvas = document.createElement("canvas");
//           const context = canvas.getContext("2d");
//           canvas.height = viewport.height;
//           canvas.width = viewport.width;

//           await page.render({
//             canvasContext: context,
//             viewport: viewport,
//           }).promise;

//           const imageUrl = canvas.toDataURL("image/png");
//           newImages.push({ file, imageUrl });
//           URL.revokeObjectURL(url);
//         } catch (err) {
//           setError("Failed to process PDF. Please try another file.");
//           return;
//         }
//       } else if (file.type.startsWith("image/")) {
//         const imageUrl = URL.createObjectURL(file);
//         newImages.push({ file, imageUrl });
//       } else {
//         setError("Please upload images or PDFs only.");
//         return;
//       }
//     }

//     setImages([...images, ...newImages]);
//     onImagesChange([...images, ...newImages]);
//   };

//   const removeImage = (index) => {
//     const updatedImages = images.filter((_, i) => i !== index);
//     setImages(updatedImages);
//     onImagesChange(updatedImages);
//   };

//   return (
//     <div className="image-uploader">
//       <label htmlFor="image-upload-input" className="upload-button">
//         Upload Images (Max {maxImages})
//       </label>
//       <input
//         id="image-upload-input"
//         type="file"
//         accept="image/*,application/pdf"
//         multiple
//         onChange={handleFileChange}
//         disabled={images.length >= maxImages}
//         style={{ display: "none" }}
//       />
//       {error && <p className="error-message">{error}</p>}
//       <div className="image-preview-container">
//         {images.map((img, index) => (
//           <div key={index} className="image-preview-item">
//             <img src={img.imageUrl} alt={`Preview image ${index + 1}`} />
//             <button
//               onClick={() => removeImage(index)}
//               className="remove-image-button"
//               aria-label={`Remove preview image ${index + 1}`}
//             >
//               ×
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// // LoadingOverlay Component
// const LoadingOverlay = ({ message = "Loading, please wait..." }) => (
//   <div className="loading-overlay">
//     <div className="loading-spinner"></div>
//     <p>{message}</p>
//   </div>
// );

// // DeletionPromptModal Component
// const DeletionPromptModal = ({ boards, onDelete, onCancel }) => {
//   const [selectedBoardId, setSelectedBoardId] = useState(null);

//   const handleDelete = () => {
//     if (selectedBoardId) {
//       onDelete(selectedBoardId);
//     }
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//         <h3>Storage Limit Reached</h3>
//         <p>
//           You can only store up to 2 boards locally. Please select a board to
//           delete to make room for the new one.
//         </p>
//         <div className="board-selection">
//           {boards.map((board) => (
//             <div key={board.id} className="board-option">
//               <input
//                 type="radio"
//                 id={`board-${board.id}`}
//                 name="board-to-delete"
//                 value={board.id}
//                 checked={selectedBoardId === board.id}
//                 onChange={() => setSelectedBoardId(board.id)}
//               />
//               <label htmlFor={`board-${board.id}`}>{board.title}</label>
//             </div>
//           ))}
//         </div>
//         <div className="modal-actions">
//           <button
//             onClick={handleDelete}
//             className="delete-button"
//             disabled={!selectedBoardId}
//           >
//             Delete Selected Board
//           </button>
//           <button onClick={onCancel} className="cancel-button">
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // PECS Items
// const pecsItems = [
//   { id: "reading", label: "Reading", icon: <FaBookOpen /> },
//   { id: "math", label: "Math", icon: <FaCalculator /> },
//   { id: "writing", label: "Writing", icon: <FaPencilAlt /> },
//   { id: "science", label: "Science", icon: <FaGlobe /> },
//   { id: "social-studies", label: "Social Studies", icon: <FaLandmark /> },
//   { id: "social-story", label: "Social Story", icon: <FaHandsHelping /> },
//   { id: "no-tantrums", label: "No Tantrums", icon: <FaBan /> },
//   { id: "calm-voice", label: "Calm Voice", icon: <FaVolumeDown /> },
//   { id: "be-kind", label: "Be Kind", icon: <FaSmileBeam /> },
//   { id: "nice-job", label: "Nice Job!", icon: <FaThumbsUp /> },
//   { id: "art", label: "Art", icon: <FaPaintBrush /> },
//   { id: "pe", label: "PE", icon: <FaRunning /> },
//   { id: "music", label: "Music", icon: <FaDrum /> },
//   { id: "stem", label: "STEM", icon: <FaMicroscope /> },
//   { id: "library", label: "Library", icon: <FaBook /> },
//   { id: "safe-body", label: "Safe Body", icon: <FaUserShield /> },
//   { id: "no-whining", label: "No Whining", icon: <FaRegGrinStars /> },
//   { id: "no-hitting", label: "No Hitting", icon: <FaHandPaper /> },
//   { id: "no-kicking", label: "No Kicking", icon: <FaHandRock /> },
//   { id: "no-pushing", label: "No Pushing", icon: <FaUserTimes /> },
// ];

// // Fallback Placeholder Image
// const placeholderImage =
//   "https://via.placeholder.com/512?text=PECS+Board+Failed";

// // Categories for Pre-Made Templates
// const CATEGORIES = [
//   { value: "All", label: "All" },
//   { value: "Daily Routines", label: "🕒 Daily Routines" },
//   { value: "Activities", label: "🎨 Activities" },
//   { value: "Social Skills", label: "🤝 Social Skills" },
//   { value: "Emotions", label: "😊 Emotions" },
//   { value: "Behavioral Expectations", label: "🚫 Behavioral Expectations" },
//   { value: "Sensory Needs", label: "🌿 Sensory Needs" },
//   { value: "Choices", label: "✅ Choices" },
//   { value: "Transitions", label: "🔄 Transitions" },
// ];

// // Helper Functions for Image Paths
// const getLocalImagePath = (smallPng, subcategory, category) => {
//   const safeSmallPng = typeof smallPng === "string" ? smallPng : "";
//   let safeSubcategory =
//     typeof subcategory === "string" ? subcategory.toLowerCase() : "";

//   // Map subcategory to folder name based on category
//   const folderMap = {
//     Activities: "activities",
//     "Social Skills": "socialskills",
//     Emotions: "emotions",
//     "Behavioral Expectations": "behavioralexpectations",
//     "Sensory Needs": "sensoryneeds",
//     Choices: "choices",
//     Transitions: "transitions",
//   };

//   safeSubcategory = folderMap[category] || safeSubcategory.replace(/\s+/g, "");

//   const basePath = process.env.PUBLIC_URL || "";
//   const path =
//     safeSmallPng && safeSubcategory
//       ? `${basePath}/images/PECS/${safeSubcategory}/${safeSmallPng}`
//       : placeholderImage;
//   console.log(`Generated image path: ${path}`);
//   return path;
// };

// const getLocalFullPngPath = (fullPng, subcategory, category) => {
//   const safeFullPng = typeof fullPng === "string" ? fullPng : "";
//   let safeSubcategory =
//     typeof subcategory === "string" ? subcategory.toLowerCase() : "";

//   // Map subcategory to folder name based on category
//   const folderMap = {
//     Activities: "activities",
//     "Social Skills": "socialskills",
//     Emotions: "emotions",
//     "Behavioral Expectations": "behavioralexpectations",
//     "Sensory Needs": "sensoryneeds",
//     Choices: "choices",
//     Transitions: "transitions",
//   };

//   safeSubcategory = folderMap[category] || safeSubcategory.replace(/\s+/g, "");

//   const basePath = process.env.PUBLIC_URL || "";
//   const path =
//     safeFullPng && safeSubcategory
//       ? `${basePath}/images/PECS/${safeSubcategory}/${safeFullPng}`
//       : placeholderImage;
//   console.log(`Generated full PNG path: ${path}`);
//   return path;
// };

// // Constants
// const DAILY_ROUTINES_ORDER = ["morning", "day", "night"];
// const MAX_LOCAL_BOARDS = 2;

// // Main Component
// const PecsBoard = () => {
//   const {
//     isAuthenticated,
//     user,
//     credits,
//     deductCredits,
//     loadingCredits,
//     creditError,
//     handleNavigation,
//     CREDIT_COSTS,
//   } = useUser();
//   const [pecsBoards, setPecsBoards] = useState([]);
//   const [filteredBoards, setFilteredBoards] = useState([]);
//   const [groupedBoards, setGroupedBoards] = useState({});
//   const [templateBoards, setTemplateBoards] = useState([]);
//   const [pecsSymbols, setPecsSymbols] = useState([]);
//   const [customBoardName, setCustomBoardName] = useState("");
//   const [customBoardDesc, setCustomBoardDesc] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [error, setError] = useState(null);
//   const [viewMode, setViewMode] = useState("premade");
//   const [localCreditError, setLocalCreditError] = useState(null);
//   const [selectedCategory, setSelectedCategory] = useState("Daily Routines");
//   const [selectedBoard, setSelectedBoard] = useState(null);
//   const [modalImage, setModalImage] = useState(null);
//   const [modalTitle, setModalTitle] = useState("");
//   const [gridSize, setGridSize] = useState(4);
//   const [uploadedImages, setUploadedImages] = useState([]);
//   const [userBoards, setUserBoards] = useState([]);
//   const [showDeletePrompt, setShowDeletePrompt] = useState(false);
//   const [pendingBoard, setPendingBoard] = useState(null);
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Track mobile state
//   const categorySelectRef = useRef(null);

//   // Track window resize to toggle mobile state
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 768);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Load user boards from localStorage on mount
//   useEffect(() => {
//     const savedBoards = localStorage.getItem(`userPecsBoards_${user?.uid}`);
//     if (savedBoards) {
//       try {
//         const parsedBoards = JSON.parse(savedBoards);
//         setUserBoards(parsedBoards);
//       } catch (err) {
//         console.error("Error parsing user boards from localStorage:", err);
//         localStorage.removeItem(`userPecsBoards_${user?.uid}`);
//       }
//     }
//   }, [user]);

//   // Save user boards to localStorage whenever they change
//   useEffect(() => {
//     if (userBoards.length > 0) {
//       try {
//         localStorage.setItem(
//           `userPecsBoards_${user.uid}`,
//           JSON.stringify(userBoards)
//         );
//       } catch (err) {
//         console.error("Error saving user boards to localStorage:", err);
//         setLocalCreditError(
//           "Failed to save boards locally. Storage may be full."
//         );
//       }
//     } else {
//       localStorage.removeItem(`userPecsBoards_${user.uid}`);
//     }
//   }, [userBoards, user]);

//   // Fetch PECS boards and symbols
//   useEffect(() => {
//     const fetchPecsBoards = async () => {
//       try {
//         setLoading(true);
//         const boardsSnapshot = await getDocs(
//           collection(firestore, "pecsBoards")
//         );
//         const boards = boardsSnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));

//         const itemBoards = boards.filter(
//           (board) => board.subcategory !== "template"
//         );
//         const templateBoards = boards.filter(
//           (board) => board.subcategory === "template"
//         );

//         setPecsBoards(itemBoards);
//         setFilteredBoards(itemBoards);
//         setTemplateBoards(templateBoards);

//         const grouped = itemBoards.reduce((acc, board) => {
//           if (!board.category || !board.subcategory) {
//             console.warn(
//               `Skipping board with missing category or subcategory:`,
//               board
//             );
//             return acc;
//           }
//           const category = board.category || "Uncategorized";
//           const subcategory = board.subcategory || "other";
//           if (!acc[category]) acc[category] = {};
//           if (!acc[category][subcategory]) acc[category][subcategory] = [];
//           acc[category][subcategory].push(board);
//           return acc;
//         }, {});
//         setGroupedBoards(grouped);

//         const symbolsSnapshot = await getDocs(
//           collection(firestore, "pecsSymbols")
//         );
//         const symbols = symbolsSnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setPecsSymbols(symbols.length > 0 ? symbols : pecsItems);
//       } catch (err) {
//         setError(
//           "Failed to load PECS boards or symbols. Using default symbols."
//         );
//         console.error("Error fetching data:", err);
//         setPecsSymbols(pecsItems);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPecsBoards();
//   }, [user]);

//   // Filter boards based on selected category
//   useEffect(() => {
//     let filtered = pecsBoards;
//     if (selectedCategory !== "All") {
//       filtered = filtered.filter(
//         (board) => board.category === selectedCategory
//       );
//     }
//     setFilteredBoards(filtered);

//     const grouped = filtered.reduce((acc, board) => {
//       if (!board.category || !board.subcategory) {
//         console.warn(
//           `Skipping board with missing category or subcategory:`,
//           board
//         );
//         return acc;
//       }
//       const category = board.category || "Uncategorized";
//       const subcategory = board.subcategory || "other";
//       if (!acc[category]) acc[category] = {};
//       if (!acc[category][subcategory]) acc[category][subcategory] = [];
//       acc[category][subcategory].push(board);
//       return acc;
//     }, {});
//     setGroupedBoards(grouped);
//   }, [selectedCategory, pecsBoards]);

//   // Adjust category select width dynamically
//   useEffect(() => {
//     const adjustSelectWidth = () => {
//       const select = categorySelectRef.current;
//       if (!select) return;

//       const tempSpan = document.createElement("span");
//       tempSpan.style.visibility = "hidden";
//       tempSpan.style.position = "absolute";
//       tempSpan.style.whiteSpace = "nowrap";
//       tempSpan.style.fontSize = window.getComputedStyle(select).fontSize;
//       tempSpan.style.fontFamily = window.getComputedStyle(select).fontFamily;
//       document.body.appendChild(tempSpan);

//       let maxWidth = 0;
//       Array.from(select.options).forEach((option) => {
//         tempSpan.textContent = option.textContent;
//         const textWidth = tempSpan.offsetWidth;
//         maxWidth = Math.max(maxWidth, textWidth);
//       });

//       document.body.removeChild(tempSpan);

//       const paddingRight = 30;
//       const paddingLeft = 12;
//       const extraSpace = 10;
//       const newWidth = maxWidth + paddingLeft + paddingRight + extraSpace;
//       select.style.width = `${Math.min(Math.max(newWidth, 250), 400)}px`;
//     };

//     adjustSelectWidth();
//     window.addEventListener("resize", adjustSelectWidth);
//     return () => window.removeEventListener("resize", adjustSelectWidth);
//   }, []);

//   // Handlers
//   const handleDownload = async (url, title, format) => {
//     const creditCost = format === "png" ? 0 : 0.5;

//     if (creditCost > 0 && credits < creditCost) {
//       setLocalCreditError(
//         "You don't have enough credits to download this board. Please purchase more credits."
//       );
//       handleNavigation("/payment");
//       return;
//     }

//     if (format === "png") {
//       try {
//         const link = document.createElement("a");
//         link.href = url;
//         link.download = `${title}.${format}`;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//       } catch (err) {
//         setLocalCreditError("Failed to download the file. Please try again.");
//         console.error("Download error:", err);
//       }
//     } else if (format === "pdf") {
//       const success = await deductCredits(creditCost, "pecsDownloads");
//       if (success) {
//         setLocalCreditError(null);
//         try {
//           // Open the PDF in a new tab
//           window.open(url, "_blank");
//         } catch (err) {
//           setLocalCreditError("Failed to open the PDF. Please try again.");
//           console.error("Download error:", err);
//         }
//       } else {
//         setLocalCreditError("Failed to deduct credits. Please try again.");
//       }
//     }
//   };

//   const handleCardSelect = (board) => {
//     setSelectedBoard(board);
//   };

//   const openModal = (image, title) => {
//     setModalImage(image);
//     setModalTitle(title);
//   };

//   const closeModal = () => {
//     setModalImage(null);
//     setModalTitle("");
//   };

//   const generateCustomBoard = async () => {
//     if (!customBoardName) {
//       setLocalCreditError("Please enter a name for your custom PECS board.");
//       return;
//     }

//     if (uploadedImages.length !== gridSize) {
//       setLocalCreditError(
//         `Please upload exactly ${gridSize} images for the selected grid size.`
//       );
//       return;
//     }

//     if (credits < CREDIT_COSTS.pecsGenerate) {
//       setLocalCreditError(
//         "You don't have enough credits to generate a custom board. Please purchase more credits."
//       );
//       handleNavigation("/payment");
//       return;
//     }

//     const newBoard = {
//       id: Date.now().toString(),
//       title: customBoardName,
//       description: customBoardDesc,
//       imageUrls: uploadedImages.map((img) => img.imageUrl),
//       gridSize: gridSize,
//       createdAt: new Date().toISOString(),
//     };

//     if (userBoards.length >= MAX_LOCAL_BOARDS) {
//       setPendingBoard(newBoard);
//       setShowDeletePrompt(true);
//       return;
//     }

//     const success = await deductCredits(
//       CREDIT_COSTS.pecsGenerate,
//       "pecsGenerations"
//     );
//     if (success) {
//       setLocalCreditError(null);
//       setIsGenerating(true);

//       try {
//         const updatedBoards = [...userBoards, newBoard];
//         setUserBoards(updatedBoards);
//         setCustomBoardName("");
//         setCustomBoardDesc("");
//         setUploadedImages([]);
//       } catch (error) {
//         console.error("Error generating PECS board:", error);
//         setLocalCreditError(
//           "Failed to generate the PECS board. Please try again."
//         );
//       } finally {
//         setIsGenerating(false);
//       }
//     } else {
//       setLocalCreditError("Failed to deduct credits. Please try again.");
//     }
//   };

//   const handleDeleteBoard = async (boardId) => {
//     const updatedBoards = userBoards.filter((board) => board.id !== boardId);
//     setUserBoards(updatedBoards);

//     if (pendingBoard) {
//       const success = await deductCredits(
//         CREDIT_COSTS.pecsGenerate,
//         "pecsGenerations"
//       );
//       if (success) {
//         setLocalCreditError(null);
//         setIsGenerating(true);

//         try {
//           const updatedBoardsWithNew = [...updatedBoards, pendingBoard];
//           setUserBoards(updatedBoardsWithNew);
//           setCustomBoardName("");
//           setCustomBoardDesc("");
//           setUploadedImages([]);
//         } catch (error) {
//           console.error("Error generating PECS board:", error);
//           setLocalCreditError(
//             "Failed to generate the PECS board. Please try again."
//           );
//         } finally {
//           setIsGenerating(false);
//           setPendingBoard(null);
//           setShowDeletePrompt(false);
//         }
//       } else {
//         setLocalCreditError("Failed to deduct credits. Please try again.");
//         setPendingBoard(null);
//         setShowDeletePrompt(false);
//       }
//     }
//   };

//   const cancelDeletePrompt = () => {
//     setPendingBoard(null);
//     setShowDeletePrompt(false);
//   };

//   const downloadBoard = async (board, index) => {
//     const boardElement = document.getElementById(`user-board-${index}`);
//     if (boardElement) {
//       const canvas = await html2canvas(boardElement, {
//         useCORS: true,
//         scale: 2,
//       });
//       const link = document.createElement("a");
//       link.href = canvas.toDataURL("image/png");
//       link.download = `${board.title}.png`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };

//   const clearLocalBoards = () => {
//     setUserBoards([]);
//     localStorage.removeItem(`userPecsBoards_${user.uid}`);
//   };

//   if (!isAuthenticated) {
//     handleNavigation("/login");
//     return null;
//   }

//   if (loading || loadingCredits) {
//     return <LoadingOverlay message="Loading PECS boards, please wait..." />;
//   }

//   return (
//     <div className="container">
//       {error ? (
//         <>
//           <header className="header">
//             <h1>PECS Board Access</h1>
//             <div className="credits-display-shared">
//               Credit balance: {credits || 0}
//             </div>
//           </header>
//           <main className="main-content">
//             <p className="error-message">{error}</p>
//             <Link to="/" className="back-button">
//               Back to Home
//             </Link>
//           </main>
//         </>
//       ) : (
//         <>
//           {/* Sticky Header */}
//           <header className="header">
//             <div className="header-content">
//               <h1>PECS Board Access</h1>
//               <div className="credits-display-shared">
//                 Credit balance: {credits || 0}
//               </div>
//             </div>
//             <nav className="view-toggle">
//               <button
//                 onClick={() => setViewMode("premade")}
//                 className={`toggle-button ${
//                   viewMode === "premade" ? "active" : ""
//                 }`}
//                 aria-pressed={viewMode === "premade"}
//               >
//                 Pre-Made Boards
//               </button>
//               <button
//                 onClick={() => setViewMode("custom")}
//                 className={`toggle-button ${
//                   viewMode === "custom" ? "active" : ""
//                 }`}
//                 aria-pressed={viewMode === "custom"}
//               >
//                 Create Custom Board
//               </button>
//             </nav>
//           </header>

//           {/* Main Content */}
//           <main className="main-content">
//             {(isGenerating || showDeletePrompt) && (
//               <>
//                 {isGenerating && (
//                   <LoadingOverlay message="Generating PECS board, please wait..." />
//                 )}
//                 {showDeletePrompt && (
//                   <DeletionPromptModal
//                     boards={userBoards}
//                     onDelete={handleDeleteBoard}
//                     onCancel={cancelDeletePrompt}
//                   />
//                 )}
//               </>
//             )}

//             {(creditError || localCreditError) && (
//               <p className="error-message">{creditError || localCreditError}</p>
//             )}

//             {viewMode === "premade" ? (
//               <section className="premade-boards-section">
//                 <div className="intro-text">
//                   Browse our collection of pre-made PECS boards below. Select a
//                   category to filter, then click a card to preview and download.
//                 </div>
//                 <div className="category-filter">
//                   <label htmlFor="category-select">Filter by Category:</label>
//                   <select
//                     id="category-select"
//                     ref={categorySelectRef}
//                     value={selectedCategory}
//                     onChange={(e) => setSelectedCategory(e.target.value)}
//                   >
//                     {CATEGORIES.map((category) => (
//                       <option key={category.value} value={category.value}>
//                         {category.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {Object.keys(groupedBoards).length > 0 ? (
//                   <div className="boards-list">
//                     {Object.keys(groupedBoards).map((category) => (
//                       <div key={category} className="category-section">
//                         <h2 className="category-title">
//                           {CATEGORIES.find((cat) => cat.value === category)
//                             ?.label || category}
//                         </h2>
//                         {(category === "Daily Routines" ||
//                           (groupedBoards[category] &&
//                             Object.keys(groupedBoards[category]).length > 0 &&
//                             groupedBoards[category][
//                               Object.keys(groupedBoards[category])[0]
//                             ][0]?.pdfUrl)) && (
//                           <div className="template-downloads">
//                             <h3>Download Full Templates</h3>
//                             <div className="template-downloads-list">
//                               {category === "Daily Routines" ? (
//                                 templateBoards
//                                   .filter(
//                                     (board) => board.category === category
//                                   )
//                                   .map((template) => (
//                                     <button
//                                       key={template.id}
//                                       onClick={() =>
//                                         handleDownload(
//                                           template.pdfUrl,
//                                           template.title,
//                                           "pdf"
//                                         )
//                                       }
//                                       className="download-template-button"
//                                       aria-label={`Download ${template.title} PDF`}
//                                     >
//                                       {template.title} (PDF)
//                                     </button>
//                                   ))
//                               ) : (
//                                 <button
//                                   onClick={() => {
//                                     const firstBoard =
//                                       groupedBoards[category][
//                                         Object.keys(groupedBoards[category])[0]
//                                       ][0];
//                                     handleDownload(
//                                       firstBoard.pdfUrl,
//                                       `${category} Full Template`,
//                                       "pdf"
//                                     );
//                                   }}
//                                   className="download-template-button"
//                                   aria-label={`Download ${category} Full Template PDF`}
//                                 >
//                                   {category} Full Template (PDF)
//                                 </button>
//                               )}
//                             </div>
//                           </div>
//                         )}
//                         {Object.keys(groupedBoards[category])
//                           .filter((subcategory) => subcategory !== "template")
//                           .sort((a, b) => {
//                             if (category === "Daily Routines") {
//                               return (
//                                 DAILY_ROUTINES_ORDER.indexOf(a) -
//                                 DAILY_ROUTINES_ORDER.indexOf(b)
//                               );
//                             }
//                             return a.localeCompare(b);
//                           })
//                           .map((subcategory) => (
//                             <div
//                               key={subcategory}
//                               className="subcategory-section"
//                             >
//                               <h3 className="subcategory-title">
//                                 {subcategory.charAt(0).toUpperCase() +
//                                   subcategory.slice(1)}
//                               </h3>
//                               <div className="boards-grid">
//                                 {groupedBoards[category][subcategory].map(
//                                   (board) =>
//                                     board.smallPng && board.subcategory ? (
//                                       <div
//                                         key={board.id}
//                                         className={`board-card ${
//                                           selectedBoard &&
//                                           selectedBoard.id === board.id
//                                             ? "selected"
//                                             : ""
//                                         }`}
//                                         onClick={() => handleCardSelect(board)}
//                                         role="button"
//                                         tabIndex={0}
//                                         onKeyDown={(e) => {
//                                           if (
//                                             e.key === "Enter" ||
//                                             e.key === " "
//                                           ) {
//                                             handleCardSelect(board);
//                                           }
//                                         }}
//                                       >
//                                         <div className="board-image-wrapper">
//                                           <img
//                                             src={getLocalImagePath(
//                                               board.smallPng,
//                                               board.subcategory,
//                                               category
//                                             )}
//                                             alt={board.title}
//                                             className="board-image"
//                                             onError={(e) =>
//                                               (e.target.src = placeholderImage)
//                                             }
//                                             onClick={(e) => {
//                                               e.stopPropagation();
//                                               openModal(
//                                                 getLocalImagePath(
//                                                   board.smallPng,
//                                                   board.subcategory,
//                                                   category
//                                                 ),
//                                                 board.title
//                                               );
//                                             }}
//                                           />
//                                         </div>
//                                         <p className="board-title">
//                                           {board.title}
//                                         </p>
//                                         <button
//                                           onClick={(e) => {
//                                             e.stopPropagation();
//                                             handleDownload(
//                                               getLocalImagePath(
//                                                 board.smallPng,
//                                                 board.subcategory,
//                                                 category
//                                               ),
//                                               board.title,
//                                               "png"
//                                             );
//                                           }}
//                                           className="download-button small"
//                                           aria-label={`Download ${board.title} PNG`}
//                                         >
//                                           PNG
//                                         </button>
//                                       </div>
//                                     ) : (
//                                       console.warn(
//                                         `Skipping board with missing smallPng or subcategory:`,
//                                         board
//                                       )
//                                     )
//                                 )}
//                               </div>
//                             </div>
//                           ))}
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="no-boards-message">
//                     No pre-made PECS boards available in this category. Please
//                     try a different category.
//                   </p>
//                 )}

//                 {selectedBoard &&
//                   selectedBoard.fullPng &&
//                   selectedBoard.subcategory && (
//                     <div className="board-preview">
//                       <h2>{selectedBoard.title}</h2>
//                       {selectedBoard.description && (
//                         <p className="board-description">
//                           Description: {selectedBoard.description}
//                         </p>
//                       )}
//                       <img
//                         src={getLocalFullPngPath(
//                           selectedBoard.fullPng,
//                           selectedBoard.subcategory,
//                           selectedBoard.category
//                         )}
//                         alt={selectedBoard.title}
//                         className="preview-image"
//                         onError={(e) => (e.target.src = placeholderImage)}
//                       />
//                       <p className="preview-note">
//                         Previewing PNG version. PDF may contain additional pages
//                         or formatting.
//                       </p>
//                       <div className="download-actions">
//                         <button
//                           onClick={() =>
//                             handleDownload(
//                               getLocalFullPngPath(
//                                 selectedBoard.fullPng,
//                                 selectedBoard.subcategory,
//                                 selectedBoard.category
//                               ),
//                               selectedBoard.title,
//                               "png"
//                             )
//                           }
//                           className="download-button"
//                           aria-label={`Download ${selectedBoard.title} PECS Board PNG`}
//                         >
//                           Download PNG
//                         </button>
//                         <button
//                           onClick={() =>
//                             handleDownload(
//                               selectedBoard.pdfUrl,
//                               selectedBoard.title,
//                               "pdf"
//                             )
//                           }
//                           className="download-button"
//                           aria-label={`Download ${selectedBoard.title} PECS Board PDF`}
//                         >
//                           Download PDF
//                         </button>
//                       </div>
//                     </div>
//                   )}
//               </section>
//             ) : (
//               <section className="custom-boards-section">
//                 <div className="custom-board-info">
//                   <p>
//                     Create a custom PECS board by filling out the details below
//                     and uploading images. You can store up to 2 boards locally.
//                     Download them to save permanently.
//                   </p>
//                 </div>

//                 <form className="custom-board-form">
//                   <div className="form-group">
//                     <label htmlFor="custom-board-name">Board Name</label>
//                     <input
//                       id="custom-board-name"
//                       type="text"
//                       value={customBoardName}
//                       onChange={(e) => setCustomBoardName(e.target.value)}
//                       placeholder="Enter a name for your board"
//                       aria-required="true"
//                     />
//                   </div>
//                   <div className="form-group">
//                     <label htmlFor="custom-board-desc">
//                       Description (Optional)
//                     </label>
//                     <textarea
//                       id="custom-board-desc"
//                       value={customBoardDesc}
//                       onChange={(e) => setCustomBoardDesc(e.target.value)}
//                       placeholder="Add a description for your board"
//                       rows={3}
//                     />
//                   </div>
//                   <div className="form-group">
//                     <label htmlFor="grid-size" className="grid-dropdown">
//                       Grid Size
//                     </label>
//                     <select
//                       id="grid-size"
//                       value={gridSize}
//                       onChange={(e) => setGridSize(Number(e.target.value))}
//                     >
//                       <option value={4}>4 Squares (2x2)</option>
//                       <option value={6}>6 Squares (3x2)</option>
//                       <option value={8}>8 Squares (4x2)</option>
//                     </select>
//                   </div>
//                 </form>

//                 <ImageUploader
//                   maxImages={gridSize}
//                   onImagesChange={setUploadedImages}
//                 />

//                 <div className="preview-grid">
//                   {Array.from({ length: gridSize }).map((_, index) => (
//                     <div key={index} className="preview-slot">
//                       {uploadedImages[index] ? (
//                         <img
//                           src={uploadedImages[index].imageUrl}
//                           alt={`Preview image ${index + 1}`}
//                         />
//                       ) : (
//                         <span>Image {index + 1}</span>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//                 <button
//                   onClick={generateCustomBoard}
//                   className="generate-button"
//                   disabled={
//                     uploadedImages.length !== gridSize ||
//                     !customBoardName ||
//                     isGenerating
//                   }
//                 >
//                   {isGenerating ? "Generating..." : "Generate PECS Board"}
//                 </button>

//                 <div className="user-boards">
//                   <h2>
//                     Your Custom Boards ({userBoards.length}/{MAX_LOCAL_BOARDS})
//                   </h2>
//                   <p className="local-storage-notice">
//                     Note: You can store up to 2 boards locally in your browser.
//                     Download them to save permanently.
//                     <button
//                       onClick={clearLocalBoards}
//                       className="clear-boards-button"
//                     >
//                       Clear All Boards
//                     </button>
//                   </p>
//                   <div className="user-boards-list">
//                     {userBoards.map((board, index) => (
//                       <div
//                         key={board.id}
//                         id={`user-board-${index}`}
//                         className="user-board"
//                       >
//                         <h3>{board.title}</h3>
//                         {board.description && (
//                           <p className="board-description">
//                             {board.description}
//                           </p>
//                         )}
//                         <div className="user-board-grid">
//                           {board.imageUrls.map((url, idx) => (
//                             <div key={idx} className="user-board-slot">
//                               <img src={url} alt={`Image ${idx + 1}`} />
//                             </div>
//                           ))}
//                         </div>
//                         <button
//                           onClick={() => downloadBoard(board, index)}
//                           className="download-board-button"
//                         >
//                           Download as PNG
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </section>
//             )}

//             {modalImage && (
//               <div className="modal-overlay" onClick={closeModal}>
//                 <div
//                   className="modal-content"
//                   onClick={(e) => e.stopPropagation()}
//                   role="dialog"
//                   aria-modal="true"
//                 >
//                   <h3>{modalTitle}</h3>
//                   <img
//                     src={modalImage}
//                     alt={modalTitle}
//                     className="modal-image"
//                     onError={(e) => (e.target.src = placeholderImage)}
//                   />
//                   <div className="modal-actions">
//                     <button
//                       onClick={() =>
//                         handleDownload(modalImage, modalTitle, "png")
//                       }
//                       className="download-button"
//                       aria-label={`Download ${modalTitle} PNG`}
//                     >
//                       Download PNG
//                     </button>
//                     <button
//                       onClick={closeModal}
//                       className="close-button"
//                       aria-label="Close modal"
//                     >
//                       Close
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </main>

//           {/* Footer with Back Button */}
//           <footer className="footer">
//             <Link to="/about" className="back-button">
//               {isMobile ? <FaHome /> : "Back to Home"}
//             </Link>
//           </footer>
//         </>
//       )}
//     </div>
//   );
// };

// export default PecsBoard;
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { firestore, storage } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useUser } from "../context/UserContext";
import {
  FaBookOpen,
  FaCalculator,
  FaPencilAlt,
  FaGlobe,
  FaLandmark,
  FaSmileBeam,
  FaPaintBrush,
  FaRunning,
  FaDrum,
  FaMicroscope,
  FaBook,
  FaHandsHelping,
  FaVolumeDown,
  FaRegGrinStars,
  FaThumbsUp,
  FaUserShield,
  FaBan,
  FaHandPaper,
  FaHandRock,
  FaUserTimes,
  FaHome,
} from "react-icons/fa";
import html2canvas from "html2canvas";
import { pdfjs } from "react-pdf";
import { jsPDF } from "jspdf";
import "../styles/PecsBoard.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// ImageUploader Component with Firebase Storage
const ImageUploader = ({ maxImages, onImagesChange }) => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useUser();

  const handleFileChange = async (e) => {
    if (!user) {
      setError("You must be logged in to upload images.");
      return;
    }

    const files = Array.from(e.target.files);
    if (images.length + files.length > maxImages) {
      setError(`You can only upload up to ${maxImages} images.`);
      return;
    }

    const newImages = [];
    for (const file of files) {
      // Check file size (10 MB limit = 10 * 1024 * 1024 bytes)
      if (file.size > 10 * 1024 * 1024) {
        setError(
          "File size exceeds 10 MB limit. Please upload a smaller file."
        );
        return;
      }

      if (file.type === "application/pdf") {
        try {
          const url = URL.createObjectURL(file);
          const pdf = await pdfjs.getDocument(url).promise;
          const page = await pdf.getPage(1);
          const viewport = page.getViewport({ scale: 1.0 });

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({
            canvasContext: context,
            viewport: viewport,
          }).promise;

          const imageUrl = canvas.toDataURL("image/png");
          newImages.push({
            file: new File([await (await fetch(imageUrl)).blob()], file.name, {
              type: "image/png",
            }),
            imageUrl,
          });
          URL.revokeObjectURL(url);
        } catch (err) {
          setError("Failed to process PDF. Please try another file.");
          console.error("PDF processing error:", err);
          return;
        }
      } else if (file.type.startsWith("image/")) {
        const imageUrl = URL.createObjectURL(file);
        newImages.push({ file, imageUrl });
      } else {
        setError("Please upload images or PDFs only.");
        return;
      }
    }

    // Upload images to Firebase Storage
    const uploadedImages = [];
    for (const img of newImages) {
      try {
        const storageRef = ref(
          storage,
          `user-boards/${user.uid}/${Date.now()}_${img.file.name}`
        );
        console.log("Uploading to:", storageRef.fullPath);
        console.log("File size:", img.file.size, "bytes");
        await uploadBytes(storageRef, img.file);
        const downloadUrl = await getDownloadURL(storageRef);
        uploadedImages.push({ file: img.file, imageUrl: downloadUrl });
      } catch (err) {
        setError("Failed to upload image to storage. Please try again.");
        console.error("Upload error:", err);
        console.error("Error code:", err.code);
        console.error("Error message:", err.message);
        return;
      }
    }

    setImages([...images, ...uploadedImages]);
    onImagesChange([...images, ...uploadedImages]);
  };

  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  const fileInputRef = React.useRef(null);

  const handleLabelClick = (e) => {
    e.preventDefault();
    if (fileInputRef.current && images.length < maxImages) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="image-uploader">
      <label
        htmlFor="image-upload-input"
        className="upload-button"
        onClick={handleLabelClick}
      >
        Upload Images (Max {maxImages})
      </label>
      <input
        ref={fileInputRef}
        id="image-upload-input"
        type="file"
        accept="image/*,application/pdf"
        multiple
        onChange={handleFileChange}
        disabled={images.length >= maxImages}
        style={{ display: "none" }}
      />
      {error && <p className="error-message">{error}</p>}
      <div className="image-preview-container">
        {images.map((img, index) => (
          <div key={index} className="image-preview-item">
            <img src={img.imageUrl} alt={`Preview image ${index + 1}`} />
            <button
              onClick={() => removeImage(index)}
              className="remove-image-button"
              aria-label={`Remove preview image ${index + 1}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// LoadingOverlay Component
const LoadingOverlay = ({
  message = "Loading PECS boards, please wait...",
}) => (
  <div className="loading-overlay">
    <div className="loading-spinner"></div>
    <p>{message}</p>
  </div>
);

// DeletionPromptModal Component
const DeletionPromptModal = ({ boards, onDelete, onCancel }) => {
  const [selectedBoardId, setSelectedBoardId] = useState(null);

  const handleDelete = () => {
    if (selectedBoardId) {
      onDelete(selectedBoardId);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Storage Limit Reached</h3>
        <p>
          You can only store up to 2 boards locally. Please select a board to
          delete to make room for the new one.
        </p>
        <div className="board-selection">
          {boards.map((board) => (
            <div key={board.id} className="board-option">
              <input
                type="radio"
                id={`board-${board.id}`}
                name="board-to-delete"
                value={board.id}
                checked={selectedBoardId === board.id}
                onChange={() => setSelectedBoardId(board.id)}
              />
              <label htmlFor={`board-${board.id}`}>{board.title}</label>
            </div>
          ))}
        </div>
        <div className="modal-actions">
          <button
            onClick={handleDelete}
            className="delete-button"
            disabled={!selectedBoardId}
          >
            Delete Selected Board
          </button>
          <button onClick={onCancel} className="cancel-button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// DownloadFormatModal Component
const DownloadFormatModal = ({ board, index, onDownload, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Choose Download Format</h3>
        <p>Please select the format for your custom PECS board:</p>
        <div className="modal-actions">
          <button
            onClick={() => onDownload(board, index, "png")}
            className="download-button"
            aria-label={`Download ${board.title} as PNG`}
          >
            Download as PNG
          </button>
          <button
            onClick={() => onDownload(board, index, "pdf")}
            className="download-button"
            aria-label={`Download ${board.title} as PDF`}
          >
            Download as PDF
          </button>
          <button
            onClick={onClose}
            className="cancel-button"
            aria-label="Close modal"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// PECS Items
const pecsItems = [
  { id: "reading", label: "Reading", icon: <FaBookOpen /> },
  { id: "math", label: "Math", icon: <FaCalculator /> },
  { id: "writing", label: "Writing", icon: <FaPencilAlt /> },
  { id: "science", label: "Science", icon: <FaGlobe /> },
  { id: "social-studies", label: "Social Studies", icon: <FaLandmark /> },
  { id: "social-story", label: "Social Story", icon: <FaHandsHelping /> },
  { id: "no-tantrums", label: "No Tantrums", icon: <FaBan /> },
  { id: "calm-voice", label: "Calm Voice", icon: <FaVolumeDown /> },
  { id: "be-kind", label: "Be Kind", icon: <FaSmileBeam /> },
  { id: "nice-job", label: "Nice Job!", icon: <FaThumbsUp /> },
  { id: "art", label: "Art", icon: <FaPaintBrush /> },
  { id: "pe", label: "PE", icon: <FaRunning /> },
  { id: "music", label: "Music", icon: <FaDrum /> },
  { id: "stem", label: "STEM", icon: <FaMicroscope /> },
  { id: "library", label: "Library", icon: <FaBook /> },
  { id: "safe-body", label: "Safe Body", icon: <FaUserShield /> },
  { id: "no-whining", label: "No Whining", icon: <FaRegGrinStars /> },
  { id: "no-hitting", label: "No Hitting", icon: <FaHandPaper /> },
  { id: "no-kicking", label: "No Kicking", icon: <FaHandRock /> },
  { id: "no-pushing", label: "No Pushing", icon: <FaUserTimes /> },
];

// Fallback Placeholder Image
const placeholderImage =
  "https://via.placeholder.com/512?text=PECS+Board+Failed";

// Categories for Pre-Made Templates
const CATEGORIES = [
  { value: "All", label: "All" },
  { value: "Daily Routines", label: "🕒 Daily Routines" },
  { value: "Activities", label: "🎨 Activities" },
  { value: "Social Skills", label: "🤝 Social Skills" },
  { value: "Emotions", label: "😊 Emotions" },
  { value: "Behavioral Expectations", label: "🚫 Behavioral Expectations" },
  { value: "Sensory Needs", label: "🌿 Sensory Needs" },
  { value: "Choices", label: "✅ Choices" },
  { value: "Transitions", label: "🔄 Transitions" },
];

//   { value: "All", label: "All" },
//   { value: "Daily Routines", label: "🕒 Daily Routines" },
//   { value: "Activities", label: "🎨 Activities" },
//   { value: "Social Skills", label: "🤝 Social Skills" },
//   { value: "Emotions", label: "😊 Emotions" },
//   { value: "Mood States", label: "🌈 Mood States" }, // New: More granular emotions
//   { value: "Calming Strategies", label: "🧘 Calming Strategies" }, // New: Strategies to reduce stress
//   { value: "Mood Boosters", label: "☀️ Mood Boosters" }, // New: Activities to improve mood
//   { value: "Self-Advocacy", label: "🗣️ Self-Advocacy" }, // New: Expressing needs/wants
//   { value: "Sensory Needs", label: "🌿 Sensory Needs" },
//   { value: "Sensory Preferences", label: "🎧 Sensory Preferences" }, // New: Specific sensory requests
//   { value: "Rewards & Celebrations", label: "🎉 Rewards & Celebrations" }, // New: Positive reinforcement
//   { value: "Health & Comfort", label: "🩺 Health & Comfort" }, // New: Physical needs
//   { value: "Interests & Hobbies", label: "🎲 Interests & Hobbies" }, // New: Favorite activities
//   { value: "Safety & Comfort Zones", label: "🏡 Safety & Comfort Zones" }, // New: Safe spaces
//   { value: "Social Preferences", label: "👥 Social Preferences" }, // New: Social interaction preferences
//   { value: "Choices", label: "✅ Choices" },
//   { value: "Transitions", label: "🔄 Transitions" },
//   { value: "Behavioral Expectations", label: "🚫 Behavioral Expectations" },

// Helper Functions for Image Paths
const getLocalImagePath = (smallPng, subcategory, category) => {
  const safeSmallPng = typeof smallPng === "string" ? smallPng : "";
  let safeSubcategory =
    typeof subcategory === "string" ? subcategory.toLowerCase() : "";

  const folderMap = {
    Activities: "activities",
    "Social Skills": "socialskills",
    Emotions: "emotions",
    "Behavioral Expectations": "behavioralexpectations",
    "Sensory Needs": "sensoryneeds",
    Choices: "choices",
    Transitions: "transitions",
  };

  safeSubcategory = folderMap[category] || safeSubcategory.replace(/\s+/g, "");

  const basePath = process.env.PUBLIC_URL || "";
  const path =
    safeSmallPng && safeSubcategory
      ? `${basePath}/images/PECS/${safeSubcategory}/${safeSmallPng}`
      : placeholderImage;
  console.log(`Generated image path: ${path}`);
  return path;
};

const getLocalFullPngPath = (fullPng, subcategory, category) => {
  const safeFullPng = typeof fullPng === "string" ? fullPng : "";
  let safeSubcategory =
    typeof subcategory === "string" ? subcategory.toLowerCase() : "";

  const folderMap = {
    Activities: "activities",
    "Social Skills": "socialskills",
    Emotions: "emotions",
    "Behavioral Expectations": "behavioralexpectations",
    "Sensory Needs": "sensoryneeds",
    Choices: "choices",
    Transitions: "transitions",
  };

  safeSubcategory = folderMap[category] || safeSubcategory.replace(/\s+/g, "");

  const basePath = process.env.PUBLIC_URL || "";
  const path =
    safeFullPng && safeSubcategory
      ? `${basePath}/images/PECS/${safeSubcategory}/${safeFullPng}`
      : placeholderImage;
  console.log(`Generated full PNG path: ${path}`);
  return path;
};

// Constants
const DAILY_ROUTINES_ORDER = ["morning", "day", "night"];
const MAX_LOCAL_BOARDS = 2;

// Main Component
const PecsBoard = ({ onLoadingChange }) => {
  const {
    isAuthenticated,
    user,
    credits,
    deductCredits,
    loadingCredits,
    creditError,
    handleNavigation,
    CREDIT_COSTS,
  } = useUser();
  const [pecsBoards, setPecsBoards] = useState([]);
  const [filteredBoards, setFilteredBoards] = useState([]);
  const [groupedBoards, setGroupedBoards] = useState({});
  const [templateBoards, setTemplateBoards] = useState([]);
  const [pecsSymbols, setPecsSymbols] = useState([]);
  const [customBoardName, setCustomBoardName] = useState("");
  const [customBoardDesc, setCustomBoardDesc] = useState("");
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("premade");
  const [localCreditError, setLocalCreditError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Daily Routines");
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const [modalTitle, setModalTitle] = useState("");
  const [gridSize, setGridSize] = useState(4);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [userBoards, setUserBoards] = useState([]);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [pendingBoard, setPendingBoard] = useState(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [newBoard, setNewBoard] = useState(null);
  const [newBoardIndex, setNewBoardIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const categorySelectRef = useRef(null);

  // Notify parent of loading state changes
  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(loading || loadingCredits);
    }
  }, [loading, loadingCredits, onLoadingChange]);

  // Track window resize to toggle mobile state
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Load user boards from localStorage on mount
  useEffect(() => {
    const savedBoards = localStorage.getItem(`userPecsBoards_${user?.uid}`);
    if (savedBoards) {
      try {
        const parsedBoards = JSON.parse(savedBoards);
        setUserBoards(parsedBoards);
      } catch (err) {
        console.error("Error parsing user boards from localStorage:", err);
        localStorage.removeItem(`userPecsBoards_${user?.uid}`);
      }
    }
  }, [user]);

  // Save user boards to localStorage whenever they change
  useEffect(() => {
    if (userBoards.length > 0) {
      try {
        localStorage.setItem(
          `userPecsBoards_${user.uid}`,
          JSON.stringify(userBoards)
        );
      } catch (err) {
        console.error("Error saving user boards to localStorage:", err);
        setLocalCreditError(
          "Failed to save boards locally. Storage may be full."
        );
      }
    } else {
      localStorage.removeItem(`userPecsBoards_${user.uid}`);
    }
  }, [userBoards, user]);

  // Fetch PECS boards and symbols
  useEffect(() => {
    const fetchPecsBoards = async () => {
      try {
        setLoading(true);
        const boardsSnapshot = await getDocs(
          collection(firestore, "pecsBoards")
        );
        const boards = boardsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const itemBoards = boards.filter(
          (board) => board.subcategory !== "template"
        );
        const templateBoards = boards.filter(
          (board) => board.subcategory === "template"
        );

        setPecsBoards(itemBoards);
        setFilteredBoards(itemBoards);
        setTemplateBoards(templateBoards);

        const grouped = itemBoards.reduce((acc, board) => {
          if (!board.category || !board.subcategory) {
            console.warn(
              `Skipping board with missing category or subcategory:`,
              board
            );
            return acc;
          }
          const category = board.category || "Uncategorized";
          const subcategory = board.subcategory || "other";
          if (!acc[category]) acc[category] = {};
          if (!acc[category][subcategory]) acc[category][subcategory] = [];
          acc[category][subcategory].push(board);
          return acc;
        }, {});
        setGroupedBoards(grouped);

        const symbolsSnapshot = await getDocs(
          collection(firestore, "pecsSymbols")
        );
        const symbols = symbolsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPecsSymbols(symbols.length > 0 ? symbols : pecsItems);
      } catch (err) {
        setError(
          "Failed to load PECS boards or symbols. Using default symbols."
        );
        console.error("Error fetching data:", err);
        setPecsSymbols(pecsItems);
      } finally {
        setLoading(false);
      }
    };

    fetchPecsBoards();
  }, [user]);

  // Filter boards based on selected category
  useEffect(() => {
    let filtered = pecsBoards;
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (board) => board.category === selectedCategory
      );
    }
    setFilteredBoards(filtered);

    const grouped = filtered.reduce((acc, board) => {
      if (!board.category || !board.subcategory) {
        console.warn(
          `Skipping board with missing category or subcategory:`,
          board
        );
        return acc;
      }
      const category = board.category || "Uncategorized";
      const subcategory = board.subcategory || "other";
      if (!acc[category]) acc[category] = {};
      if (!acc[category][subcategory]) acc[category][subcategory] = [];
      acc[category][subcategory].push(board);
      return acc;
    }, {});
    setGroupedBoards(grouped);
  }, [selectedCategory, pecsBoards]);

  // Adjust category select width dynamically
  useEffect(() => {
    const adjustSelectWidth = () => {
      const select = categorySelectRef.current;
      if (!select) return;

      const tempSpan = document.createElement("span");
      tempSpan.style.visibility = "hidden";
      tempSpan.style.position = "absolute";
      tempSpan.style.whiteSpace = "nowrap";
      tempSpan.style.fontSize = window.getComputedStyle(select).fontSize;
      tempSpan.style.fontFamily = window.getComputedStyle(select).fontFamily;
      document.body.appendChild(tempSpan);

      let maxWidth = 0;
      Array.from(select.options).forEach((option) => {
        tempSpan.textContent = option.textContent;
        const textWidth = tempSpan.offsetWidth;
        maxWidth = Math.max(maxWidth, textWidth);
      });

      document.body.removeChild(tempSpan);

      const paddingRight = 30;
      const paddingLeft = 12;
      const extraSpace = 10;
      const newWidth = maxWidth + paddingLeft + paddingRight + extraSpace;
      select.style.width = `${Math.min(Math.max(newWidth, 250), 400)}px`;
    };

    adjustSelectWidth();
    window.addEventListener("resize", adjustSelectWidth);
    return () => window.removeEventListener("resize", adjustSelectWidth);
  }, []);

  // Handlers
  const handleDownload = async (url, title, format) => {
    const creditCost = format === "png" ? 0 : 0.5;

    if (creditCost > 0 && credits < creditCost) {
      setLocalCreditError(
        "You don't have enough credits to download this board. Please purchase more credits."
      );
      handleNavigation("/payment");
      return;
    }

    if (format === "png") {
      try {
        const link = document.createElement("a");
        link.href = url;
        link.download = `${title}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        setLocalCreditError("Failed to download the file. Please try again.");
        console.error("Download error:", err);
      }
    } else if (format === "pdf") {
      const success = await deductCredits(creditCost, "pecsDownloads");
      if (success) {
        setLocalCreditError(null);
        try {
          window.open(url, "_blank");
        } catch (err) {
          setLocalCreditError("Failed to open the PDF. Please try again.");
          console.error("Download error:", err);
        }
      } else {
        setLocalCreditError("Failed to deduct credits. Please try again.");
      }
    }
  };

  const handleCardSelect = (board) => {
    setSelectedBoard(board);
  };

  const openModal = (image, title) => {
    setModalImage(image);
    setModalTitle(title);
  };

  const closeModal = () => {
    setModalImage(null);
    setModalTitle("");
  };

  const generateCustomBoard = async () => {
    if (!customBoardName) {
      setLocalCreditError("Please enter a name for your custom PECS board.");
      return;
    }

    if (uploadedImages.length !== gridSize) {
      setLocalCreditError(
        `Please upload exactly ${gridSize} images for the selected grid size.`
      );
      return;
    }

    if (credits < CREDIT_COSTS.pecsGenerate) {
      setLocalCreditError(
        "You don't have enough credits to generate a custom board. Please purchase more credits."
      );
      handleNavigation("/payment");
      return;
    }

    const newBoard = {
      id: Date.now().toString(),
      title: customBoardName,
      description: customBoardDesc,
      imageUrls: uploadedImages.map((img) => img.imageUrl),
      gridSize: gridSize,
      createdAt: new Date().toISOString(),
    };

    if (userBoards.length >= MAX_LOCAL_BOARDS) {
      setPendingBoard(newBoard);
      setShowDeletePrompt(true);
      return;
    }

    const success = await deductCredits(
      CREDIT_COSTS.pecsGenerate,
      "pecsGenerations"
    );
    if (success) {
      setLocalCreditError(null);
      setIsGenerating(true);

      try {
        setNewBoard(newBoard);
        setNewBoardIndex(userBoards.length);
        setShowDownloadModal(true);
      } catch (error) {
        console.error("Error generating PECS board:", error);
        setLocalCreditError(
          "Failed to generate the PECS board. Please try again."
        );
      } finally {
        setIsGenerating(false);
      }
    } else {
      setLocalCreditError("Failed to deduct credits. Please try again.");
    }
  };

  const handleDownloadCustomBoard = async (board, index, format) => {
    const boardElement = document.getElementById(`temp-board-${index}`);
    if (!boardElement) {
      setLocalCreditError("Failed to generate the board for download.");
      console.error(
        "Board element not found for download:",
        `temp-board-${index}`
      );
      return;
    }

    if (format === "png") {
      try {
        const canvas = await html2canvas(boardElement, {
          useCORS: true,
          scale: 2,
        });
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `${board.title}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        setLocalCreditError("Failed to download the PNG. Please try again.");
        console.error("Download error:", err);
        return;
      }
    } else if (format === "pdf") {
      const creditCost = 0.5;
      if (credits < creditCost) {
        setLocalCreditError(
          "You don't have enough credits to download this board as a PDF. Please purchase more credits."
        );
        handleNavigation("/payment");
        return;
      }

      const success = await deductCredits(creditCost, "pecsDownloads");
      if (success) {
        setLocalCreditError(null);
        try {
          const canvas = await html2canvas(boardElement, {
            useCORS: true,
            scale: 2,
          });
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF({
            orientation: "portrait",
            unit: "px",
            format: [canvas.width, canvas.height],
          });
          pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
          pdf.save(`${board.title}.pdf`);
        } catch (err) {
          setLocalCreditError("Failed to download the PDF. Please try again.");
          console.error("Download error:", err);
          return;
        }
      } else {
        setLocalCreditError("Failed to deduct credits. Please try again.");
        return;
      }
    }

    // After successful download, add the board to userBoards
    const updatedBoards = [...userBoards, board];
    setUserBoards(updatedBoards);
    setCustomBoardName("");
    setCustomBoardDesc("");
    setUploadedImages([]);
    setShowDownloadModal(false);
    setNewBoard(null);
    setNewBoardIndex(null);
  };

  const closeDownloadModal = () => {
    setShowDownloadModal(false);
    setNewBoard(null);
    setNewBoardIndex(null);
    setCustomBoardName("");
    setCustomBoardDesc("");
    setUploadedImages([]);
  };

  const handleDeleteBoard = async (boardId) => {
    const updatedBoards = userBoards.filter((board) => board.id !== boardId);
    setUserBoards(updatedBoards);

    if (pendingBoard) {
      const success = await deductCredits(
        CREDIT_COSTS.pecsGenerate,
        "pecsGenerations"
      );
      if (success) {
        setLocalCreditError(null);
        setIsGenerating(true);

        try {
          setNewBoard(pendingBoard);
          setNewBoardIndex(updatedBoards.length);
          setShowDownloadModal(true);
        } catch (error) {
          console.error("Error generating PECS board:", error);
          setLocalCreditError(
            "Failed to generate the PECS board. Please try again."
          );
        } finally {
          setIsGenerating(false);
          setPendingBoard(null);
          setShowDeletePrompt(false);
        }
      } else {
        setLocalCreditError("Failed to deduct credits. Please try again.");
        setPendingBoard(null);
        setShowDeletePrompt(false);
      }
    }
  };

  const cancelDeletePrompt = () => {
    setPendingBoard(null);
    setShowDeletePrompt(false);
  };

  const downloadBoard = async (board, index) => {
    setNewBoard(board);
    setNewBoardIndex(index);
    setShowDownloadModal(true);
  };

  const clearLocalBoards = () => {
    setUserBoards([]);
    localStorage.removeItem(`userPecsBoards_${user.uid}`);
  };

  if (!isAuthenticated) {
    handleNavigation("/login");
    return null;
  }

  return (
    <div className="container">
      {error ? (
        <>
          <header className="header">
            <h1>PECS Board Access</h1>
            <div className="credits-display-shared">
              Credit balance: {credits || 0}
            </div>
          </header>
          <main className="main-content">
            <p className="error-message">{error}</p>
            <Link to="/" className="back-button">
              Back to Home
            </Link>
          </main>
        </>
      ) : (
        <>
          {/* Hidden container for rendering the new board temporarily */}
          {newBoard && (
            <div style={{ position: "absolute", left: "-9999px" }}>
              <div id={`temp-board-${newBoardIndex}`} className="user-board">
                <h3>{newBoard.title}</h3>
                {newBoard.description && (
                  <p className="board-description">{newBoard.description}</p>
                )}
                <div
                  className="user-board-grid"
                  data-grid-size={newBoard.gridSize}
                >
                  {newBoard.imageUrls.map((url, idx) => (
                    <div key={idx} className="user-board-slot">
                      <img src={url} alt={`Image ${idx + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sticky Header */}
          <header className="header">
            <div className="header-content">
              <h1>PECS Board Access</h1>
              <div className="credits-display-shared">
                Credit balance: {credits || 0}
              </div>
            </div>
            <nav className="view-toggle">
              <button
                onClick={() => setViewMode("premade")}
                className={`toggle-button ${
                  viewMode === "premade" ? "active" : ""
                }`}
                aria-pressed={viewMode === "premade"}
              >
                Pre-Made Boards
              </button>
              <button
                onClick={() => setViewMode("custom")}
                className={`toggle-button ${
                  viewMode === "custom" ? "active" : ""
                }`}
                aria-pressed={viewMode === "custom"}
              >
                Create Custom Board
              </button>
            </nav>
          </header>

          {/* Main Content */}
          <main className="main-content">
            {(isGenerating || showDeletePrompt || showDownloadModal) && (
              <>
                {isGenerating && (
                  <LoadingOverlay message="Generating PECS board, please wait..." />
                )}
                {showDeletePrompt && (
                  <DeletionPromptModal
                    boards={userBoards}
                    onDelete={handleDeleteBoard}
                    onCancel={cancelDeletePrompt}
                  />
                )}
                {showDownloadModal && newBoard && (
                  <DownloadFormatModal
                    board={newBoard}
                    index={newBoardIndex}
                    onDownload={handleDownloadCustomBoard}
                    onClose={closeDownloadModal}
                  />
                )}
              </>
            )}

            {(creditError || localCreditError) && (
              <p className="error-message">{creditError || localCreditError}</p>
            )}

            {viewMode === "premade" ? (
              <section className="premade-boards-section">
                <div className="intro-text">
                  Browse our collection of pre-made PECS boards below. Select a
                  category to filter, then click a card to preview and download.
                </div>
                <div className="category-filter">
                  <label htmlFor="category-select">Filter by Category:</label>
                  <select
                    id="category-select"
                    ref={categorySelectRef}
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {Object.keys(groupedBoards).length > 0 ? (
                  <div className="boards-list">
                    {Object.keys(groupedBoards).map((category) => (
                      <div key={category} className="category-section">
                        <h2 className="category-title">
                          {CATEGORIES.find((cat) => cat.value === category)
                            ?.label || category}
                        </h2>
                        {(category === "Daily Routines" ||
                          (groupedBoards[category] &&
                            Object.keys(groupedBoards[category]).length > 0 &&
                            groupedBoards[category][
                              Object.keys(groupedBoards[category])[0]
                            ][0]?.pdfUrl)) && (
                          <div className="template-downloads">
                            <h3>Download Full Templates</h3>
                            <div className="template-downloads-list">
                              {category === "Daily Routines" ? (
                                templateBoards
                                  .filter(
                                    (board) => board.category === category
                                  )
                                  .map((template) => (
                                    <button
                                      key={template.id}
                                      onClick={() =>
                                        handleDownload(
                                          template.pdfUrl,
                                          template.title,
                                          "pdf"
                                        )
                                      }
                                      className="download-template-button"
                                      aria-label={`Download ${template.title} PDF`}
                                    >
                                      {template.title} (PDF)
                                    </button>
                                  ))
                              ) : (
                                <button
                                  onClick={() => {
                                    const firstBoard =
                                      groupedBoards[category][
                                        Object.keys(groupedBoards[category])[0]
                                      ][0];
                                    handleDownload(
                                      firstBoard.pdfUrl,
                                      `${category} Full Template`,
                                      "pdf"
                                    );
                                  }}
                                  className="download-template-button"
                                  aria-label={`Download ${category} Full Template PDF`}
                                >
                                  {category} Full Template (PDF)
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                        {Object.keys(groupedBoards[category])
                          .filter((subcategory) => subcategory !== "template")
                          .sort((a, b) => {
                            if (category === "Daily Routines") {
                              return (
                                DAILY_ROUTINES_ORDER.indexOf(a) -
                                DAILY_ROUTINES_ORDER.indexOf(b)
                              );
                            }
                            return a.localeCompare(b);
                          })
                          .map((subcategory) => (
                            <div
                              key={subcategory}
                              className="subcategory-section"
                            >
                              <h3 className="subcategory-title">
                                {subcategory.charAt(0).toUpperCase() +
                                  subcategory.slice(1)}
                              </h3>
                              <div className="boards-grid">
                                {groupedBoards[category][subcategory].map(
                                  (board) =>
                                    board.smallPng && board.subcategory ? (
                                      <div
                                        key={board.id}
                                        className={`board-card ${
                                          selectedBoard &&
                                          selectedBoard.id === board.id
                                            ? "selected"
                                            : ""
                                        }`}
                                        onClick={() => handleCardSelect(board)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                          if (
                                            e.key === "Enter" ||
                                            e.key === " "
                                          ) {
                                            handleCardSelect(board);
                                          }
                                        }}
                                      >
                                        <div className="board-image-wrapper">
                                          <img
                                            src={getLocalImagePath(
                                              board.smallPng,
                                              board.subcategory,
                                              category
                                            )}
                                            alt={board.title}
                                            className="board-image"
                                            onError={(e) =>
                                              (e.target.src = placeholderImage)
                                            }
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              openModal(
                                                getLocalImagePath(
                                                  board.smallPng,
                                                  board.subcategory,
                                                  category
                                                ),
                                                board.title
                                              );
                                            }}
                                          />
                                        </div>
                                        <p className="board-title">
                                          {board.title}
                                        </p>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDownload(
                                              getLocalImagePath(
                                                board.smallPng,
                                                board.subcategory,
                                                category
                                              ),
                                              board.title,
                                              "png"
                                            );
                                          }}
                                          className="download-button small"
                                          aria-label={`Download ${board.title} PNG`}
                                        >
                                          PNG
                                        </button>
                                      </div>
                                    ) : (
                                      console.warn(
                                        `Skipping board with missing smallPng or subcategory:`,
                                        board
                                      )
                                    )
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-boards-message">
                    No pre-made PECS boards available in this category. Please
                    try a different category.
                  </p>
                )}

                {selectedBoard &&
                  selectedBoard.fullPng &&
                  selectedBoard.subcategory && (
                    <div className="board-preview">
                      <h2>{selectedBoard.title}</h2>
                      {selectedBoard.description && (
                        <p className="board-description">
                          Description: {selectedBoard.description}
                        </p>
                      )}
                      <img
                        src={getLocalFullPngPath(
                          selectedBoard.fullPng,
                          selectedBoard.subcategory,
                          selectedBoard.category
                        )}
                        alt={selectedBoard.title}
                        className="preview-image"
                        onError={(e) => (e.target.src = placeholderImage)}
                      />
                      <p className="preview-note">
                        Previewing PNG version. PDF may contain additional pages
                        or formatting.
                      </p>
                      <div className="download-actions">
                        <button
                          onClick={() =>
                            handleDownload(
                              getLocalFullPngPath(
                                selectedBoard.fullPng,
                                selectedBoard.subcategory,
                                selectedBoard.category
                              ),
                              selectedBoard.title,
                              "png"
                            )
                          }
                          className="download-button"
                          aria-label={`Download ${selectedBoard.title} PECS Board PNG`}
                        >
                          Download PNG
                        </button>
                        <button
                          onClick={() =>
                            handleDownload(
                              selectedBoard.pdfUrl,
                              selectedBoard.title,
                              "pdf"
                            )
                          }
                          className="download-button"
                          aria-label={`Download ${selectedBoard.title} PECS Board PDF`}
                        >
                          Download PDF
                        </button>
                      </div>
                    </div>
                  )}
              </section>
            ) : (
              <section className="custom-boards-section">
                <div className="custom-board-info">
                  <p>
                    Create a custom PECS board by filling out the details below
                    and uploading images. You can store up to 2 boards locally.
                    Download them to save permanently.
                  </p>
                </div>

                <form className="custom-board-form">
                  <div className="form-group">
                    <label htmlFor="custom-board-name">Board Name</label>
                    <input
                      id="custom-board-name"
                      type="text"
                      value={customBoardName}
                      onChange={(e) => setCustomBoardName(e.target.value)}
                      placeholder="Enter a name for your board"
                      aria-required="true"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="custom-board-desc">
                      Description (Optional)
                    </label>
                    <textarea
                      id="custom-board-desc"
                      value={customBoardDesc}
                      onChange={(e) => setCustomBoardDesc(e.target.value)}
                      placeholder="Add a description for your board"
                      rows={3}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="grid-size" className="grid-dropdown">
                      Grid Size
                    </label>
                    <select
                      id="grid-size"
                      value={gridSize}
                      onChange={(e) => setGridSize(Number(e.target.value))}
                    >
                      <option value={4}>4 Squares (2x2)</option>
                      <option value={6}>6 Squares (3x2)</option>
                      <option value={8}>8 Squares (4x2)</option>
                    </select>
                  </div>
                </form>

                <ImageUploader
                  maxImages={gridSize}
                  onImagesChange={setUploadedImages}
                />

                <div className="preview-grid">
                  {Array.from({ length: gridSize }).map((_, index) => (
                    <div key={index} className="preview-slot">
                      {uploadedImages[index] ? (
                        <img
                          src={uploadedImages[index].imageUrl}
                          alt={`Preview image ${index + 1}`}
                        />
                      ) : (
                        <span>Image {index + 1}</span>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={generateCustomBoard}
                  className="generate-button"
                  disabled={
                    uploadedImages.length !== gridSize ||
                    !customBoardName ||
                    isGenerating
                  }
                >
                  {isGenerating ? "Generating..." : "Generate PECS Board"}
                </button>

                <div className="user-boards">
                  <h2>
                    Your Custom Boards ({userBoards.length}/{MAX_LOCAL_BOARDS})
                  </h2>
                  <p className="local-storage-notice">
                    Note: You can store up to 2 boards locally in your browser.
                    Download them to save permanently.
                    <button
                      onClick={clearLocalBoards}
                      className="clear-boards-button"
                    >
                      Clear All Boards
                    </button>
                  </p>
                  <div className="user-boards-list">
                    {userBoards.map((board, index) => (
                      <div
                        key={board.id}
                        id={`user-board-${index}`}
                        className="user-board"
                      >
                        <h3>{board.title}</h3>
                        {board.description && (
                          <p className="board-description">
                            {board.description}
                          </p>
                        )}
                        <div
                          className="user-board-grid"
                          data-grid-size={board.gridSize}
                        >
                          {board.imageUrls.map((url, idx) => (
                            <div key={idx} className="user-board-slot">
                              <img src={url} alt={`Image ${idx + 1}`} />
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => downloadBoard(board, index)}
                          className="download-board-button"
                        >
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {modalImage && (
              <div className="modal-overlay" onClick={closeModal}>
                <div
                  className="modal-content"
                  onClick={(e) => e.stopPropagation()}
                  role="dialog"
                  aria-modal="true"
                >
                  <h3>{modalTitle}</h3>
                  <img
                    src={modalImage}
                    alt={modalTitle}
                    className="modal-image"
                    onError={(e) => (e.target.src = placeholderImage)}
                  />
                  <div className="modal-actions">
                    <button
                      onClick={() =>
                        handleDownload(modalImage, modalTitle, "png")
                      }
                      className="download-button"
                      aria-label={`Download ${modalTitle} PNG`}
                    >
                      Download PNG
                    </button>
                    <button
                      onClick={closeModal}
                      className="close-button"
                      aria-label="Close modal"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>

          {/* Footer with Back Button */}
          <footer className="footer">
            <Link to="/about" className="back-button">
              {isMobile ? <FaHome /> : "Back to Home"}
            </Link>
          </footer>
        </>
      )}
    </div>
  );
};

export default PecsBoard;
