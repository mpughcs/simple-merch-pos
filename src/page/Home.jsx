import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../FirebaseConfig';
import { collection, addDoc, getDoc, doc } from "firebase/firestore";
import { db } from '../../FirebaseConfig';
import logo from '../assets/Images/SM_logo.jpg';
import { FaArrowRight } from "react-icons/fa";

function Home() {
    const navigate = useNavigate();
    const [venueName, setVenueName] = useState('testVenue');
    const [showAddSession, setShowAddSession] = useState(false);
    const [showResumeSession, setShowResumeSession] = useState(false);
    const [sessionId, setSessionId] = useState('');

    const handleCreateSession = async () => {
        const docRef = await addDoc(collection(db, "sessions"), {
            date: new Date(),
            venueName: venueName,
            revenue: 0,
        });
        console.log("Document written with ID: ", docRef.id);
        navigate(`/SessionScreen`, { state: { sessionId: docRef.id } });
    }

    const handleResumeSession = async (sessionId) => {
        const docRef = doc(db, "sessions", sessionId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            navigate(`/SessionScreen`, { state: { sessionId: sessionId } });
        } else {
            alert('No such document!');
        }
    }

    const handleLogout = () => {
        auth.signOut();
        console.log('User logged out');
    };

    return (
        <div className="flex flex-col py-4 px-2 mx-auto my-3 max-w-md sm:max-w-lg lg:max-w-xl"> {/* Adjusted margins and max-width for better mobile viewing */}
            <h1 className='text-xl sm:text-2xl md:text-3xl text-center'>Sunday Mourners Merch Manager</h1> {/* Adjusted font sizes and added text centering for better readability on mobile */}
            <img src={logo} className='my-4 w-full max-w-xs mx-auto' alt="SM logo" /> {/* Adjusted image sizing for better mobile fit */}
            <div className='flex flex-col gap-6'>
                <div>
                    <button className='text-lg sm:text-3xl hover:text-pink-400' onClick={() => setShowAddSession(!showAddSession)}>Create Session</button>
                    {showAddSession && (
                        <div className='flex gap-4 py-2'>
                            <input className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 appearance-none leading-normal text-black w-[60%]" placeholder="Session Name" onChange={(e) => setVenueName(e.target.value)} />
                            <FaArrowRight className='text-xl my-auto hover:text-pink-400 hover:cursor-pointer' onClick={handleCreateSession} />
                        </div>
                    )}
                </div>
                <div>
                    <button className='text-lg sm:text-3xl hover:text-pink-400' onClick={() => setShowResumeSession(!showResumeSession)}>Resume Session</button>
                    {showResumeSession && (
                        <div className='flex gap-4 py-2'>
                            <input className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 appearance-none leading-normal text-black w-[60%]" placeholder="Session ID" onChange={(e) => setSessionId(e.target.value)} />
                            <FaArrowRight className='text-xl my-auto hover:text-pink-400 hover:cursor-pointer' onClick={() => handleResumeSession(sessionId)} />
                        </div>
                    )}
                </div>
                <button className='text-lg hover:text-pink-400' onClick={handleLogout}>Log Out</button>
            </div>
        </div>
    );
}

export default Home;
