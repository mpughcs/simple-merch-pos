import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom'
import { auth } from '../../FirebaseConfig';
import { collection, addDoc } from "firebase/firestore";
import { db } from '../../FirebaseConfig';
import { useState } from 'react';
import logo from '../assets/Images/SM_logo.jpg';
import { FaArrowRight } from "react-icons/fa";
import { getDoc, doc } from "firebase/firestore";


function Home() {
    const navigate = useNavigate();
    const [venueName, setVenueName] = useState('testVenue');
    const [showAddSession, setShowAddSession] = useState(false);
    const [showResumeSession, setShowResumeSession] = useState(false);
    const [sessionId, setSessionId] = useState('');

    const handleCreateSession = async () => {
        const docRef = await addDoc(collection(db, "sessions"),
            {
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
            // doc.data() will be undefined in this case
            alert('No such document!');
        }
    }



    const handleLogout = () => {
        // Perform logout logic here
        auth.signOut();
        console.log('User logged out');
        // Redirect to login or another relevant page
    };

    return (
        <div className="flex flex-col text-center py-20 ">
            <h1 className='text-2xl'>Sunday Mourners Merch Manager</h1>
            <img src={logo} className='w-[40%] mx-auto my-5' alt="SM logo" />
            <div className='flex flex-col justify-start gap-10'>
                <div className='flex-col mx-auto '>
                    <button className='hover:text-pink-400' onClick={() => setShowAddSession(!showAddSession)}>Create Session</button>
                    {showAddSession && <div className='flex  gap-5 py-2'>
                        <input class="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block appearance-none leading-normal text-black w-[300px] " placeholder="Venue Name" onChange={(e) => setVenueName(e.target.value)} />
                        <FaArrowRight className='text-2xl my-auto hover:text-pink-400 hover:cursor-pointer' onClick={handleCreateSession} />
                    </div>}
                </div>
                <div className='flex-col mx-auto '>
                    <button className='hover:text-pink-400' onClick={() => setShowResumeSession(!showResumeSession)}>Resume Session</button>
                    {showResumeSession && <div className='flex  gap-5 py-2'>
                        <input class="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block appearance-none leading-normal text-black w-[300px] " placeholder="session id" onChange={(e) => setSessionId(e.target.value)} />
                        <FaArrowRight className='text-2xl my-auto hover:text-pink-400 hover:cursor-pointer' onClick={() => handleResumeSession(sessionId)} />
                    </div>}
                </div>
                <button className='hover:text-pink-400' onClick={handleLogout}>Log Out</button>
            </div>
        </div>
    );
}

export default Home;
