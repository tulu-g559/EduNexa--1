import { useState } from "react";

const JitsiMeeting = () => {
  const [roomCode, setRoomCode] = useState("");

  const joinMeeting = () => {
    if (!roomCode.trim()) {
      alert("Please enter a valid room code.");
      return;
    }
    const roomLink = `https://meet.jit.si/${roomCode}`;
    window.open(roomLink, "_blank");
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="text"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
        placeholder="Enter Room Code"
        className="p-2 rounded-lg text-black"
      />
      <button
        onClick={joinMeeting}
        className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg text-xl shadow-md transition-all"
      >
        Join Class
      </button>
    </div>
  );
};

export default JitsiMeeting;