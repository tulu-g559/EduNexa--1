// import React, { useState, useEffect, useRef } from "react";
// import { useSelector } from "react-redux";
// import { toast } from "react-hot-toast";
// import { doc, getDoc } from "firebase/firestore";
// // import { db } from "../../firebase/firebase"; // Import your Firestore instance

// const formatText = (text) => {
//   // Formatting logic (same as before)
//   text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/__(.*?)__/g, "<strong>$1</strong>");
//   text = text.replace(/\*(.*?)\*/g, "<em>$1</em>").replace(/_(.*?)_/g, "<em>$1</em>");
//   text = text.replace(/`(.*?)`/g, "<code>$1</code>");
//   text = text.replace(/\[([^\[]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank" class="text-blue-400">$1</a>');
//   text = text.replace(/^([*|-])\s(.*)$/gm, "<ul><li>$2</li></ul>");
//   text = text.replace(/^\d+\.\s(.*)$/gm, "<ol><li>$1</li></ol>");
//   text = text.replace(/^>\s(.*)$/gm, "<blockquote class='text-gray-500 italic'>$1</blockquote>");
//   text = text.replace(/^###\s(.*)$/gm, "<h3 class='font-semibold text-lg'>$1</h3>");
//   text = text.replace(/\n/g, "<p>$&</p>");
//   return text;
// };

// const GetHints = () => {
//   const { user } = useSelector((state) => state.auth); // Get user from Redux for Firebase UID
//   const [file, setFile] = useState(null);
//   const [extractedText, setExtractedText] = useState("");
//   const [question, setQuestion] = useState("");
//   const [hint1, setHint1] = useState("");
//   const [hint2, setHint2] = useState("");
//   const [answer, setAnswer] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showHint2, setShowHint2] = useState(false);
//   const [showAnswer, setShowAnswer] = useState(false);
//   const [showHint1Button, setShowHint1Button] = useState(true);
//   const hintEndRef = useRef(null); // Reference to the bottom of the hint container

//   // Handle file selection
//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile && selectedFile.type === "application/pdf") {
//       setFile(selectedFile);
//     } else {
//       toast.error("Please upload a valid PDF file!");
//     }
//   };

//   // Upload PDF to backend
//   const handleUpload = async () => {
//     if (!file) {
//       toast.error("Please select a PDF file first!");
//       return;
//     }

//     setLoading(true);
//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await fetch("http://localhost:5000/upload", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setExtractedText(data.text);
//         toast.success("PDF uploaded successfully!");
//       } else {
//         toast.error(data.error || "Failed to upload PDF");
//       }
//     } catch (error) {
//       console.error("Error uploading PDF:", error);
//       toast.error("Error uploading PDF!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Ask for the first hint based on extracted text
//   const handleAskHint1 = async () => {
//     if (!question || !extractedText) {
//       toast.error("Please upload a PDF and enter a question!");
//       return;
//     }

//     setLoading(true);
//     const payload = {
//       user_id: user.uid, // Firebase UID from Redux
//       question: question,
//       context: extractedText, // Extracted PDF text as context
//     };

//     try {
//       const response = await fetch("http://localhost:5000/ask", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         const [hint1Text] = data.answer.split("\n\n");
//         simulateTyping(hint1Text, setHint1);
//         setShowHint1Button(false); // Hide the "Get Hint 1" button
//         toast.success("Hint 1 received!");
//       } else {
//         toast.error(data.error || "Failed to get hint 1");
//       }
//     } catch (error) {
//       console.error("Error getting hint 1:", error);
//       toast.error("Error getting hint 1!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Ask for the second hint based on extracted text
//   const handleAskHint2 = async () => {
//     if (!question || !extractedText) {
//       toast.error("Please upload a PDF and enter a question!");
//       return;
//     }

//     setLoading(true);
//     const payload = {
//       user_id: user.uid, // Firebase UID from Redux
//       question: question,
//       context: extractedText, // Extracted PDF text as context
//     };

//     try {
//       const response = await fetch("http://localhost:5000/ask", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         const [, hint2Text] = data.answer.split("\n\n");
//         simulateTyping(hint2Text, setHint2);
//         setShowHint2(true);
//         toast.success("Hint 2 received!");
//       } else {
//         toast.error(data.error || "Failed to get hint 2");
//       }
//     } catch (error) {
//       console.error("Error getting hint 2:", error);
//       toast.error("Error getting hint 2!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Ask for the final answer based on extracted text
//   const handleAskAnswer = async () => {
//     if (!question || !extractedText) {
//       toast.error("Please upload a PDF and enter a question!");
//       return;
//     }

//     setLoading(true);
//     const payload = {
//       user_id: user.uid, // Firebase UID from Redux
//       question: question,
//       context: extractedText, // Extracted PDF text as context
//     };

//     try {
//       const response = await fetch("http://localhost:5000/ask", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         const [, , answerText] = data.answer.split("\n\n");
//         simulateTyping(answerText, setAnswer);
//         setShowAnswer(true);
//         toast.success("Answer received!");
//       } else {
//         toast.error(data.error || "Failed to get answer");
//       }
//     } catch (error) {
//       console.error("Error getting answer:", error);
//       toast.error("Error getting answer!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const simulateTyping = (text, setText) => {
//     let currentText = "";
//     let i = 0;

//     // Simulate typing letter by letter
//     const typingInterval = setInterval(() => {
//       if (i < text.length) {
//         currentText += text.charAt(i);
//         setText(formatText(currentText)); // Format AI's message before displaying and Update it
//         i++;
//       } else {
//         clearInterval(typingInterval);
//       }
//     }, 10); // Adjust typing speed here (in ms)
//   };

//   // Scroll to the bottom of the hint container whenever hint changes
//   useEffect(() => {
//     if (hintEndRef.current) {
//       hintEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [hint1, hint2, answer]);

//   return (
//     <div className="min-h-screen bg-black/[0.96] text-white p-6 flex flex-col items-center">
//       <h1 className="text-3xl font-bold mb-6">Get Hints to complete your Assignment</h1>

//       {/* File Upload Section */}
//       <div className="w-full max-w-md mb-6">
//         <input
//           type="file"
//           accept="application/pdf"
//           onChange={handleFileChange}
//           className="mb-4 p-2 border border-gray-500 rounded bg-gray-800 text-white w-full"
//         />
//         <button
//           onClick={handleUpload}
//           disabled={loading}
//           className={`w-full py-2 px-4 rounded ${
//             loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
//           } text-white font-semibold`}
//         >
//           {loading ? "Uploading..." : "Upload PDF"}
//         </button>
//       </div>

//       {/* Question Input and Hint Section */}
//       <div className="w-full max-w-md mb-6">
//         <input
//           type="text"
//           value={question}
//           onChange={(e) => setQuestion(e.target.value)}
//           placeholder="Just ask the question from your assignment uploaded"
//           className="w-full p-2 mb-4 border border-gray-500 rounded bg-gray-800 text-white"
//         />
//         {showHint1Button && (
//           <button
//             onClick={handleAskHint1}
//             disabled={loading}
//             className={`w-full py-2 px-4 rounded ${
//               loading ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"
//             } text-white font-semibold`}
//           >
//             {loading ? "Processing..." : "Get Hint 1"}
//           </button>
//         )}
//       </div>

//       {/* Display Hint 1 */}
//       {hint1 && (
//         <div className="w-full max-w-2xl">
//           <h2 className="text-xl font-semibold mb-2">Hint 1:</h2>
//           <p className="p-4 border border-gray-500 rounded bg-gray-800" dangerouslySetInnerHTML={{ __html: hint1 }}></p>
//         </div>
//       )}

//       {/* Button to get Hint 2 */}
//       {hint1 && !showHint2 && (
//         <button
//           onClick={handleAskHint2}
//           disabled={loading}
//           className={`w-full max-w-md py-2 px-4 rounded ${
//             loading ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"
//           } text-white font-semibold mt-4`}
//         >
//           {loading ? "Processing..." : "Get Hint 2"}
//         </button>
//       )}

//       {/* Display Hint 2 */}
//       {showHint2 && (
//         <div className="w-full max-w-2xl">
//           <h2 className="text-xl font-semibold mb-2">Hint 2:</h2>
//           <p className="p-4 border border-gray-500 rounded bg-gray-800" dangerouslySetInnerHTML={{ __html: hint2 }}></p>
//         </div>
//       )}

//       {/* Button to get Answer */}
//       {showHint2 && !showAnswer && (
//         <button
//           onClick={handleAskAnswer}
//           disabled={loading}
//           className={`w-full max-w-md py-2 px-4 rounded ${
//             loading ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"
//           } text-white font-semibold mt-4`}
//         >
//           {loading ? "Processing..." : "Get Answer"}
//         </button>
//       )}

//       {/* Display Answer */}
//       {showAnswer && (
//         <div className="w-full max-w-2xl">
//           <h2 className="text-xl font-semibold mb-2">Answer:</h2>
//           <p className="p-4 border border-gray-500 rounded bg-gray-800" dangerouslySetInnerHTML={{ __html: answer }}></p>
//           <div ref={hintEndRef} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default GetHints;


import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase"; // Import your Firestore instance

const formatText = (text) => {
  // Formatting logic (same as before)
  text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/__(.*?)__/g, "<strong>$1</strong>");
  text = text.replace(/\*(.*?)\*/g, "<em>$1</em>").replace(/_(.*?)_/g, "<em>$1</em>");
  text = text.replace(/`(.*?)`/g, "<code>$1</code>");
  text = text.replace(/\[([^\[]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank" class="text-blue-400">$1</a>');
  text = text.replace(/^([*|-])\s(.*)$/gm, "<ul><li>$2</li></ul>");
  text = text.replace(/^\d+\.\s(.*)$/gm, "<ol><li>$1</li></ol>");
  text = text.replace(/^>\s(.*)$/gm, "<blockquote class='text-gray-500 italic'>$1</blockquote>");
  text = text.replace(/^###\s(.*)$/gm, "<h3 class='font-semibold text-lg'>$1</h3>");
  text = text.replace(/\n/g, "<p>$&</p>");
  return text;
};

const GetHints = () => {
  const { user } = useSelector((state) => state.auth); // Get user from Redux for Firebase UID
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [question, setQuestion] = useState("");
  const [hint1, setHint1] = useState("");
  const [hint2, setHint2] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHint2, setShowHint2] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint1Button, setShowHint1Button] = useState(true);
  const hintEndRef = useRef(null); // Reference to the bottom of the hint container

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      toast.error("Please upload a valid PDF file!");
    }
  };

  // Upload PDF to backend
  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a PDF file first!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setExtractedText(data.text);
        toast.success("PDF uploaded successfully!");
      } else {
        toast.error(data.error || "Failed to upload PDF");
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
      toast.error("Error uploading PDF!");
    } finally {
      setLoading(false);
    }
  };

  // Ask for the first hint based on extracted text
  const handleAskHint1 = async () => {
    if (!question || !extractedText) {
      toast.error("Please upload a PDF and enter a question!");
      return;
    }

    setLoading(true);
    const payload = {
      user_id: user.uid, // Firebase UID from Redux
      question: question,
      context: extractedText, // Extracted PDF text as context
    };

    try {
      const response = await fetch("http://localhost:5000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        const [hint1Text] = data.answer.split("\n\n");
        simulateTyping(hint1Text, setHint1);
        setShowHint1Button(false); // Hide the "Get Hint 1" button
        toast.success("Hint 1 received!");
      } else {
        toast.error(data.error || "Failed to get hint 1");
      }
    } catch (error) {
      console.error("Error getting hint 1:", error);
      toast.error("Error getting hint 1!");
    } finally {
      setLoading(false);
    }
  };

  // Ask for the second hint based on extracted text
  const handleAskHint2 = async () => {
    if (!question || !extractedText) {
      toast.error("Please upload a PDF and enter a question!");
      return;
    }

    setLoading(true);
    const payload = {
      user_id: user.uid, // Firebase UID from Redux
      question: question,
      context: extractedText, // Extracted PDF text as context
    };

    try {
      const response = await fetch("http://localhost:5000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        const [, hint2Text] = data.answer.split("\n\n");
        simulateTyping(hint2Text, setHint2);
        setShowHint2(true);
        toast.success("Hint 2 received!");
      } else {
        toast.error(data.error || "Failed to get hint 2");
      }
    } catch (error) {
      console.error("Error getting hint 2:", error);
      toast.error("Error getting hint 2!");
    } finally {
      setLoading(false);
    }
  };

  // Ask for the final answer based on extracted text
  const handleAskAnswer = async () => {
    if (!question || !extractedText) {
      toast.error("Please upload a PDF and enter a question!");
      return;
    }

    setLoading(true);
    const payload = {
      user_id: user.uid, // Firebase UID from Redux
      question: question,
      context: extractedText, // Extracted PDF text as context
    };

    try {
      const response = await fetch("http://localhost:5000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        const [, , answerText] = data.answer.split("\n\n");
        simulateTyping(answerText, setAnswer);
        setShowAnswer(true);
        toast.success("Answer received!");
      } else {
        toast.error(data.error || "Failed to get answer");
      }
    } catch (error) {
      console.error("Error getting answer:", error);
      toast.error("Error getting answer!");
    } finally {
      setLoading(false);
    }
  };

  const simulateTyping = (text, setText) => {
    let currentText = "";
    let i = 0;

    // Simulate typing letter by letter
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        currentText += text.charAt(i);
        setText(formatText(currentText)); // Format AI's message before displaying and Update it
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 10); // Adjust typing speed here (in ms)
  };

  // Scroll to the bottom of the hint container whenever hint changes
  useEffect(() => {
    if (hintEndRef.current) {
      hintEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [hint1, hint2, answer]);

  return (
    <div className="min-h-screen bg-black/[0.96] text-white p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Get Hints to complete your Assignment</h1>

      {/* File Upload Section */}
      <div className="w-full max-w-md mb-6">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="mb-4 p-2 border border-gray-500 rounded bg-gray-800 text-white w-full"
        />
        <button
          onClick={handleUpload}
          disabled={loading}
          className={`w-full py-2 px-4 rounded ${
            loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
          } text-white font-semibold`}
        >
          {loading ? "Uploading..." : "Upload PDF"}
        </button>
      </div>

      {/* Question Input and Hint Section */}
      <div className="w-full max-w-md mb-6">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Just ask the question from your assignment uploaded"
          className="w-full p-2 mb-4 border border-gray-500 rounded bg-gray-800 text-white"
        />
        {showHint1Button && (
          <button
            onClick={handleAskHint1}
            disabled={loading}
            className={`w-full py-2 px-4 rounded ${
              loading ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"
            } text-white font-semibold`}
          >
            {loading ? "Processing..." : "Get Hint 1"}
          </button>
        )}
      </div>

      {/* Display Hint 1 */}
      {hint1 && (
        <div className="w-full max-w-2xl">
          <h2 className="text-xl font-semibold mb-2">Hint 1:</h2>
          <p className="p-4 border border-gray-500 rounded bg-gray-800" dangerouslySetInnerHTML={{ __html: hint1 }}></p>
        </div>
      )}

      {/* Button to get Hint 2 */}
      {hint1 && !showHint2 && (
        <button
          onClick={handleAskHint2}
          disabled={loading}
          className={`w-full max-w-md py-2 px-4 rounded ${
            loading ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"
          } text-white font-semibold mt-4`}
        >
          {loading ? "Processing..." : "Get Hint 2"}
        </button>
      )}

      {/* Display Hint 2 */}
      {showHint2 && (
        <div className="w-full max-w-2xl">
          <h2 className="text-xl font-semibold mb-2">Hint 2:</h2>
          <p className="p-4 border border-gray-500 rounded bg-gray-800" dangerouslySetInnerHTML={{ __html: hint2 }}></p>
        </div>
      )}

      {/* Button to get Answer */}
      {showHint2 && !showAnswer && (
        <button
          onClick={handleAskAnswer}
          disabled={loading}
          className={`w-full max-w-md py-2 px-4 rounded ${
            loading ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"
          } text-white font-semibold mt-4`}
        >
          {loading ? "Processing..." : "Get Answer"}
        </button>
      )}

      {/* Display Answer */}
      {showAnswer && (
        <div className="w-full max-w-2xl">
          <h2 className="text-xl font-semibold mb-2">Answer:</h2>
          <p className="p-4 border border-gray-500 rounded bg-gray-800" dangerouslySetInnerHTML={{ __html: answer }}></p>
          <div ref={hintEndRef} />
        </div>
      )}
    </div>
  );
};

export default GetHints;