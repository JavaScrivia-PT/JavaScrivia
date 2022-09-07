import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage (props) {
    const [ message, setMessage ] = useState('Please enter your username and password');

    const navigate = useNavigate();
    
    const navigateToTrivia = () => { navigate('trivia') };  


    // refactor with axios
    // hash password
    // change to post request w/ username and password body

    const handleSubmit = () => {
        fetch(`/api?username=${document.getElementById('user1').value}&password=${document.getElementById('pass1').value}`)
        .then(response => response.json())
        .then(response => {
            if (response) {
                fetch(`/user?username=${document.getElementById('user1').value}`)
                .then(response => response.json())
                .then(data => {
                    props.setScore(data.score);
                    props.setProgress(data.progress);
                })
                .catch(err => console.log(err));
                props.setUsername(document.getElementById('user1').value)
                return navigateToTrivia();
            } else {
                return setMessage('Your username/password is incorrect')
            }
        })
        .catch(err => console.log(err));
    }
    
    return (
        <div className="initialContainer">
            <h1 className="landingH1">Log In</h1>
            <div className="signInArea">
            <form className="formsArea">
                <input className="landingInput" type="text" id="user1" placeholder="username"></input>
                <input className="landingInput" type="text" id="pass1" placeholder="password"></input>
            </form>
            <h3>{message}</h3>
            <button className="landingButton" onClick={handleSubmit}>enter</button>
            </div>
        </div>
    );
}