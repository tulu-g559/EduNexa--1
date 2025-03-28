// "use client";

// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { db } from "./firebase/firebase";
// import { doc, setDoc, getDoc, deleteDoc, collection, getDocs, query, where } from "firebase/firestore";
// import { useSelector } from "react-redux";

// const Classroom = () => {
//   const [roomCode, setRoomCode] = useState("");
//   const [isTeacher, setIsTeacher] = useState("student");
//   const [className, setClassName] = useState("");
//   const [liveRoomLink, setLiveRoomLink] = useState("");
//   const [liveRooms, setLiveRooms] = useState([]);
//   const { user } = useSelector((state) => state.auth);

//   // Generate a unique room code
//   const generateRoomCode = () => {
//     return Math.random().toString(36).substr(2, 6).toUpperCase();
//   };

//   // Fetch user role
//   const fetchUserRole = async (uid) => {
//     try {
//       const userRef = doc(db, "users", uid);
//       const userSnap = await getDoc(userRef);
//       if (userSnap.exists()) {
//         setIsTeacher(userSnap.data().role);
//       }
//     } catch (error) {
//       console.error("Error fetching user role: ", error);
//     }
//   };

//   // Fetch rooms for the teacher who created them
//   const fetchLiveRooms = async () => {
//     try {
//       if (!user) return;
//       const roomsRef = collection(db, "rooms");
//       const q = query(roomsRef, where("teacherId", "==", user.uid));
//       const roomSnapshot = await getDocs(q);

//       const roomsList = roomSnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data(),
//       }));

//       setLiveRooms(roomsList);
//     } catch (error) {
//       console.error("Error fetching live rooms: ", error);
//     }
//   };

//   // Create a new room (only for teachers)
//   const handleCreateRoom = async () => {
//     if (!className.trim()) {
//       alert("Please enter a class name");
//       return;
//     }

//     if (!user) {
//       alert("User not logged in");
//       return;
//     }

//     try {
//       const roomRef = doc(db, "rooms", className.trim());
//       const roomSnap = await getDoc(roomRef);

//       if (roomSnap.exists()) {
//         alert("Room already exists! Please use the existing one.");
//         return;
//       }

//       const newRoomCode = generateRoomCode();
//       const newRoomLink = `https://meet.jit.si/${className}-${newRoomCode}`;

//       setLiveRoomLink(newRoomLink);
//       setRoomCode(newRoomCode);

//       await setDoc(roomRef, {
//         className: className.trim(),
//         link: newRoomLink,
//         teacher: user.email,
//         teacherId: user.uid, // Store teacher UID
//         roomCode: newRoomCode,
//       });

//       alert(`Room created! Share this code: ${newRoomCode}`);
//       fetchLiveRooms(); 

//     } catch (error) {
//       console.error("Error creating room: ", error);
//       alert("Failed to create room");
//     }
//   };

//   // Students can search and join an existing room
//   const fetchRoomLink = async () => {
//     if (!className.trim()) {
//       alert("Please enter a class name to join");
//       return;
//     }

//     try {
//       const roomRef = doc(db, "rooms", className.trim());
//       const roomSnap = await getDoc(roomRef);

//       if (roomSnap.exists()) {
//         setLiveRoomLink(roomSnap.data().link);
//         setRoomCode(roomSnap.data().roomCode);
//         alert(`Room found! Click the link to join.`);
//       } else {
//         alert("No room found with this class name!");
//         setLiveRoomLink("");
//       }
//     } catch (error) {
//       console.error("Error fetching room: ", error);
//       alert("Failed to fetch room");
//     }
//   };

//   // Delete a room (Only the teacher can delete their own rooms)
//   const handleDeleteRoom = async (roomId) => {
//     try {
//       const roomRef = doc(db, "rooms", roomId);
//       await deleteDoc(roomRef);

//       setLiveRooms(liveRooms.filter(room => room.id !== roomId));
//       alert("Room deleted successfully!");
//     } catch (error) {
//       console.error("Error deleting room: ", error);
//       alert("Failed to delete the room");
//     }
//   };

//   // Fetch live rooms on load
//   useEffect(() => {
//     if (user) fetchUserRole(user.uid);
//     if (user && isTeacher === "teacher") fetchLiveRooms();
//   }, [user, isTeacher]);

//   return (
//     <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white relative">
//       <div className="h-16 w-full"></div>

//       <motion.h1
//         className="text-4xl font-bold mb-6 text-blue-400"
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//       >
//         Welcome to Your Classroom
//       </motion.h1>

//       <motion.div
//         className="flex flex-col items-center gap-6"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//       >
//         {/* Teacher View - Create/Delete Room */}
//         {isTeacher === "teacher" ? (
//           <>
//             <input
//               type="text"
//               value={className}
//               onChange={(e) => setClassName(e.target.value)}
//               placeholder="Enter Class Name"
//               className="p-2 rounded-lg text-white bg-gray-800"
//             />
//             <button
//               onClick={handleCreateRoom}
//               className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg text-xl shadow-md transition-all"
//             >
//               Create Room
//             </button>
//             {liveRoomLink && (
//               <div className="text-lg text-yellow-400 mt-4">
//                 Room Code: <strong>{roomCode}</strong>
//                 <br />
//                 <a
//                   href={liveRoomLink}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="underline"
//                 >
//                   Join Room
//                 </a>
//               </div>
//             )}

//             {/* Show Only Teacher's Live Rooms */}
//             <div className="mt-8 w-full">
//               <h2 className="text-2xl font-bold text-green-400 mb-4">Your Live Rooms</h2>
//               {liveRooms.length > 0 ? (
//                 <ul className="w-full flex flex-col gap-4">
//                   {liveRooms.map((room) => (
//                     <li
//                       key={room.id}
//                       className="flex justify-between items-center bg-gray-800 p-4 rounded-lg shadow-md"
//                     >
//                       <div>
//                         <p className="text-lg font-semibold">{room.className}</p>
//                         <p className="text-sm text-gray-400">Room Code: {room.roomCode}</p>
//                         <a
//                           href={room.link}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-blue-400 underline"
//                         >
//                           Join Room
//                         </a>
//                       </div>
//                       <button
//                         onClick={() => handleDeleteRoom(room.id)}
//                         className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm transition-all"
//                       >
//                         Delete
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="text-gray-400">No live rooms available.</p>
//               )}
//             </div>
//           </>
//         ) : (
//           <>
//             {/* Student View - Join Room */}
//             <input
//               type="text"
//               value={className}
//               onChange={(e) => setClassName(e.target.value)}
//               placeholder="Enter Class Name to Join"
//               className="p-2 rounded-lg text-white bg-gray-800"
//             />
//             <button
//               onClick={fetchRoomLink}
//               className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg text-xl shadow-md transition-all"
//             >
//               Search Room
//             </button>
//             {liveRoomLink && (
//               <a href={liveRoomLink} target="_blank" rel="noopener noreferrer" className="text-green-400 underline">
//                 Click here to join
//               </a>
//             )}
//           </>
//         )}
//       </motion.div>
//     </div>
//   );
// };

// export default Classroom;



"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db } from "./firebase/firebase";
import { doc, setDoc, getDoc, deleteDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useSelector } from "react-redux";

const Classroom = () => {
  const [roomCode, setRoomCode] = useState("");
  const [isTeacher, setIsTeacher] = useState("student");
  const [className, setClassName] = useState("");
  const [liveRoomLink, setLiveRoomLink] = useState("");
  const [liveRooms, setLiveRooms] = useState([]);
  const { user } = useSelector((state) => state.auth);

  // Generate a unique room code
  const generateRoomCode = () => {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
  };

  // Fetch user role
  const fetchUserRole = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setIsTeacher(userSnap.data().role);
      }
    } catch (error) {
      console.error("Error fetching user role: ", error);
    }
  };

  // Fetch rooms for the teacher who created them
  const fetchLiveRooms = async () => {
    try {
      if (!user) {
        console.error("User not logged in");
        return;
      }
  
      const roomsRef = collection(db, "rooms");
      const q = query(roomsRef, where("teacherId", "==", user.uid));
      const roomSnapshot = await getDocs(q);
  
      const roomsList = roomSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      setLiveRooms(roomsList);
    } catch (error) {
      console.error("Error fetching live rooms:", error);
    }
  };

  // Create a new room (only for teachers)
  const handleCreateRoom = async () => {
    if (!className.trim()) {
      alert("Please enter a class name");
      return;
    }
  
    if (!user) {
      alert("User not logged in");
      return;
    }
  
    try {
      const newRoomCode = generateRoomCode();
      const newRoomLink = `https://meet.jit.si/${className}-${newRoomCode}`;
      const roomRef = doc(db, "rooms", newRoomCode); // Use roomCode as the document ID
  
      // Check if the room already exists
      const roomSnap = await getDoc(roomRef);
      if (roomSnap.exists()) {
        alert("Room already exists! Please use the existing one.");
        return;
      }
  
      // Create the room in Firestore
      await setDoc(roomRef, {
        className: className.trim(),
        link: newRoomLink,
        teacher: user.email,
        teacherId: user.uid,
        roomCode: newRoomCode,
      });
  
      // Update state and notify the user
      setLiveRoomLink(newRoomLink);
      setRoomCode(newRoomCode);
      alert(`Room created! Share this code: ${newRoomCode}`);
      fetchLiveRooms(); // Refresh the list of live rooms
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Failed to create room. Please try again.");
    }
  };

  // Students can search and join an existing room
  const fetchRoomLink = async () => {
    if (!className.trim()) {
      alert("Please enter a class name to join");
      return;
    }
  
    try {
      const roomsRef = collection(db, "rooms");
      const q = query(roomsRef, where("className", "==", className.trim()));
      const roomSnapshot = await getDocs(q);
  
      if (!roomSnapshot.empty) {
        const roomData = roomSnapshot.docs[0].data(); // Get the first matching room
        setLiveRoomLink(roomData.link);
        setRoomCode(roomData.roomCode);
        alert(`Room found! Click the link to join.`);
      } else {
        alert("No room found with this class name!");
        setLiveRoomLink("");
      }
    } catch (error) {
      console.error("Error fetching room:", error);
      alert("Failed to fetch room. Please try again.");
    }
  };

  // Delete a room (Only the teacher can delete their own rooms)
  const handleDeleteRoom = async (roomId) => {
    try {
      const roomRef = doc(db, "rooms", roomId);
      await deleteDoc(roomRef);

      setLiveRooms(liveRooms.filter(room => room.id !== roomId));
      alert("Room deleted successfully!");
    } catch (error) {
      console.error("Error deleting room: ", error);
      alert("Failed to delete the room");
    }
  };

  // Fetch live rooms on load
  useEffect(() => {
    if (user) fetchUserRole(user.uid);
    if (user && isTeacher === "teacher") fetchLiveRooms();
  }, [user, isTeacher]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white relative">
      <div className="h-16 w-full"></div>

      <motion.h1
        className="text-4xl font-bold mb-6 text-blue-400"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Welcome to Your Classroom
      </motion.h1>

      <motion.div
        className="flex flex-col items-center gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Teacher View - Create/Delete Room */}
        {isTeacher === "teacher" ? (
          <>
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="Enter Class Name"
              className="p-2 rounded-lg text-white bg-gray-800"
            />
            <button
              onClick={handleCreateRoom}
              className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg text-xl shadow-md transition-all"
            >
              Create Room
            </button>
            {liveRoomLink && (
              <div className="text-lg text-yellow-400 mt-4">
                Room Code: <strong>{roomCode}</strong>
                <br />
                <a
                  href={liveRoomLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Join Room
                </a>
              </div>
            )}

            {/* Show Only Teacher's Live Rooms */}
            <div className="mt-8 w-full">
              <h2 className="text-2xl font-bold text-green-400 mb-4">Your Live Rooms</h2>
              {liveRooms.length > 0 ? (
                <ul className="w-full flex flex-col gap-4">
                  {liveRooms.map((room) => (
                    <li
                      key={room.id}
                      className="flex justify-between items-center bg-gray-800 p-4 rounded-lg shadow-md"
                    >
                      <div>
                        <p className="text-lg font-semibold">{room.className}</p>
                        <p className="text-sm text-gray-400">Room Code: {room.roomCode}</p>
                        <a
                          href={room.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 underline"
                        >
                          Join Room
                        </a>
                      </div>
                      <button
                        onClick={() => handleDeleteRoom(room.id)}
                        className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm transition-all"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No live rooms available.</p>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Student View - Join Room */}
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="Enter Class Name to Join"
              className="p-2 rounded-lg text-white bg-gray-800"
            />
            <button
              onClick={fetchRoomLink}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg text-xl shadow-md transition-all"
            >
              Search Room
            </button>
            {liveRoomLink && (
              <a href={liveRoomLink} target="_blank" rel="noopener noreferrer" className="text-green-400 underline">
                Click here to join
              </a>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Classroom;