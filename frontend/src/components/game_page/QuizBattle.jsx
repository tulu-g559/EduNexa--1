import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { XCircle } from "lucide-react";

export default function QuizBattle() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state for fetching quiz
  const [topics] = useState(["Coding", "Algorithm", "Physics", "Math"]);
  const [selectedTopic, setSelectedTopic] = useState("Coding");
  const [score, setScore] = useState(0); // Single player's score
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isAnsweringAllowed, setIsAnsweringAllowed] = useState(true);
  const [timeUpMessage, setTimeUpMessage] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions] = useState(5); // Fixed total number of questions
  const [quizStarted, setQuizStarted] = useState(false); // Control when the quiz starts

  // Fetch Quiz from Flask API
  const fetchQuiz = async () => {
    setLoading(true); // Set loading state while fetching
    try {
      const response = await fetch("http://127.0.0.1:5000/game/generate_quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: selectedTopic }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (data && data.question) {
        setQuestion(data); // Set the fetched question
        setIsTimerRunning(true); // Start the timer
        setIsAnsweringAllowed(true); // Allow answering
        setTimeUpMessage(""); // Reset the timeUpMessage when a new question is loaded
        setTimeLeft(10); // Reset the timer to 10 seconds for each new question
      } else {
        console.error("Error: No question received", data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false); // Stop loading after the request finishes
    }
  };

  // Countdown Timer Effect
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer); // Cleanup timer on unmount
    }

    // When time reaches 0, stop the timer and disable answering
    if (timeLeft === 0) {
      setIsTimerRunning(false); // Stop the timer when it reaches 0
      setIsAnsweringAllowed(false); // Disable answering after timer ends
      setTimeUpMessage("No option chosen"); // Show message after time ends

      // After 2 seconds, reset the question and move to the next one
      setTimeout(() => {
        setTimeUpMessage(""); // Clear the timeUpMessage
        setQuestion(null); // Clear the current question
        setQuestionIndex((prev) => prev + 1); // Move to the next question
      }, 2000);
    }
  }, [timeLeft, isTimerRunning]);

  // Handle Question Navigation
  useEffect(() => {
    if (questionIndex >= totalQuestions) {
      // Navigate to results page when all questions are answered
      navigate("/results", { state: { score } });
    } else if (quizStarted) {
      fetchQuiz(); // Fetch next question when question index is updated
    }
  }, [questionIndex, totalQuestions, quizStarted]);

  // Handle Answer Selection
  const handleAnswer = (answer) => {
    if (!isAnsweringAllowed) return; // Prevent answer selection after time's up
    setSelectedAnswer(answer);

    // Update score for correct answer
    if (answer === question.correct_answer) {
      setScore((prev) => prev + 10);
    }

    // Wait 1 second before moving to the next question
    setIsAnsweringAllowed(false); // Disable answering after selection
    setTimeout(() => {
      setSelectedAnswer(null); // Reset the selected answer
      setTimeLeft(10); // Reset timer for the next question
      setIsTimerRunning(false); // Reset the timer
      setQuestion(null); // Clear the current question
      setQuestionIndex((prev) => prev + 1); // Increment question index
    }, 1000);
  };

  // Start the Quiz
  const startQuiz = () => {
    setQuizStarted(true); // Set quizStarted to true
    fetchQuiz(); // Fetch the first question
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black text-white relative p-4">
      {/* Topic Selection Dropdown */}
      <select
        className="p-2 mb-4 bg-gray-800 text-white rounded"
        onChange={(e) => setSelectedTopic(e.target.value)}
      >
        {topics.map((topic, index) => (
          <option key={index} value={topic}>
            {topic}
          </option>
        ))}
      </select>

      {/* Start Quiz Button */}
      {!quizStarted && (
        <button
          onClick={startQuiz}
          className="p-3 bg-yellow-500 rounded-lg hover:bg-yellow-400"
        >
          Start Quiz on {selectedTopic}
        </button>
      )}

      {/* Show Question */}
      {loading && <p>Loading quiz...</p>}

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)} // Navigate to home or another page
        className="absolute top-5 left-5 p-2 bg-yellow-500 hover:bg-yellow-400 rounded-full transition"
      >
        <XCircle className="w-6 h-6 text-black" />
      </button>

      {/* Scoreboard */}
      <div className="bg-gray-800 p-4 rounded-lg text-center mb-6">
        <h2 className="text-lg font-semibold">Score</h2>
        <p className="text-xl font-bold text-yellow-400">{score}</p>
      </div>

      {/* Countdown Timer */}
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 1 }}
        className="text-2xl font-bold text-red-400 mb-4"
      >
        ⏳ {timeLeft}s
      </motion.div>

      {/* Question Box */}
      {loading ? (
        <p>Loading Question...</p>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-900 p-6 rounded-lg shadow-lg text-center w-full max-w-lg"
        >
          <h2 className="text-xl font-semibold mb-4">{question?.question}</h2>

          {/* Answer Options */}
          <div className="grid grid-cols-2 gap-4">
            {question?.options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleAnswer(option)}
                whileTap={{ scale: 0.9 }}
                className={`p-3 rounded-lg font-semibold ${
                  selectedAnswer === option
                    ? option === question.correct_answer
                      ? "bg-green-500 text-black"
                      : "bg-red-500 text-black"
                    : "bg-gray-700 text-black"
                }`}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* End Quiz Button */}
      <button
        onClick={() => navigate("/results")}
        className="mt-6 p-3 bg-blue-500 rounded-lg hover:bg-blue-400"
      >
        End Quiz
      </button>
    </div>
  );
}