import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './styles.css';
import LandingPage from './pages/LandingPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import TriviaPage from './pages/TriviaPage';

function App () {
    const [ username, setUsername ] = useState('');
    const [ score, setScore ] = useState(0);
    const [ progress, setProgress ] = useState('0');
    return (

        <Routes>
            <Route path="/" element={<LandingPage />} />
                <Route path="/landing" element={<LandingPage />} />
                <Route path="/signup" element={<SignupPage username={username} setUsername={setUsername} setScore={setScore}/>} />
                <Route path="/login" element={<LoginPage username={username} setUsername={setUsername} setScore={setScore} setProgress={setProgress} />} />
                <Route path="/login/trivia" element={<TriviaPage username={username} score={score} progress={progress} setScore={setScore}/>} />
                <Route path="/signup/trivia" element={<TriviaPage username={username} score={score} progress={progress} setScore={setScore}/>} />
                <Route 
                    path="*" 
                    element={
                        <main>
                            <p>There's no page at this URL!</p>
                        </main>
                    }
                />
        </Routes>
    )

}

export default App;