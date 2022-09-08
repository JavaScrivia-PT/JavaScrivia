import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignupPage (props) {
    const [ message, setMessage ] = useState('Sign up! Please be advised that your username will also be your leaderboard display name');

    const navigate = useNavigate();
    
    const navigateToTrivia = () => { navigate('trivia') };     

    // hash password here
    const handleSignup = () => {
        fetch('/api',
        {
            method: 'POST',
            body: JSON.stringify( { username: document.getElementById('user').value, password: document.getElementById('pass').value } ),
            headers: { 'Content-Type' : 'application/json' },
        })
        .then(response => response.json())
        .then(response => {
            console.log('signup worked: ', response);
            if (response) {
                props.setUsername(document.getElementById('user').value);
                props.setScore(0);
                props.setProgress('0');
                return navigateToTrivia();
            } else {
                return setMessage('Your username/password already exist, please try again');
            }
        })
        .catch(err => console.log(err));
    };

    // change form to be onsumbit
    return (
        <div className="initialContainer">
            <h1 className="landingH1">Sign Up</h1>
            <div className="signInArea">
            <form className="formsArea">
                <input className="landingInput" id="user" type="text" placeholder="username"></input>
                <input className="landingInput" id="pass" type="password" placeholder="password"></input>
            </form>
            <h3>{message}</h3>
            <button className="landingButton" onClick={handleSignup}>enter</button>
            </div>
        </div>
    );
}