import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {

   const navigate = useNavigate();

    const navigateToLogin = () => { navigate('/login') };
    const navigateToSignup = () => { navigate('/signup') };

        return (
            <div className="initialContainer">
                <h1 className="landingH1">JavaScrivia!</h1>
                <p className="landingText">a beginner's trivia game for daily improvement in JavaScript.</p>
                <div className="signInArea">
                    <h2 className="landingH2">Please sign up or log in to continue.</h2>
                    <div className="buttonsArea">
                        <p className="landingText">already have an account?</p>
                        <button className="landingButton" onClick={navigateToLogin}>Log In</button>
                        <p className="landingText">new here?</p>
                        <button className="landingButton" onClick={navigateToSignup}>Sign Up</button>
                    </div>
                </div>
            </div>
        );
}

export default LandingPage;