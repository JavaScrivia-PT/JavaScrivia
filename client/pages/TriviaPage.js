import React, { useEffect, useState } from 'react';
import {Routes, Route, useNavigate} from 'react-router-dom';
import LeaderBoard from './LeaderBoard';
import Answer from './Answer';

const TriviaPage = (props) => {
    const [ explanation, setExplanation ] = useState(false);
    const [ clicked, setClicked ] = useState(false);

    const [state, setState] = useState({ 
        i: 0,
        codeSnippet: '',
        currentQuestion: '',
        answerExplanation: '',
        answerOptions: {
            A: '',
            B: '',
            C: '',
            D: ''
        },
        correctAnswer: '',
        answerExplanation: '',

    })
    
    
    const navigate = useNavigate();

    const logOut = () => { navigate('/landing') };

    const grabTrivia = () => {
        fetch(`https://api.javascript-trivia.com/`)
            .then(res => res.json())

            .then(data => {
                // console.log(JSON.stringify(data.questions[state.i].codeSnippet));
                // data.questions[state.i].codeSnippet.replaceAll('\n', '<br />');
                console.log(data.questions[0]);
                setState({
                i: state.i + 1,
                codeSnippet: data.questions[state.i].codeSnippet,
                currentQuestion: data.questions[state.i].question,
                answerOptions: data.questions[state.i].answerOptions,
                correctAnswer: data.questions[state.i].correctAnswer,
                answerExplanation: data.questions[state.i].answerExplanation   
            })
            setExplanation(false);
            setClicked(false);
        })
            // .then(data => console.log(data.questions[state.i]));
        // console.log(data)
    }

    const changeBoolean = (e) => {
        // console.log(state.answerOptions.D)
        //we can access the correct answer with state.correctAnswer
        // console.log(e.target.innerHTML);
        // console.log(state.correctAnswer);
        if (e.target.innerHTML[0] === state.correctAnswer && clicked === false) {
            props.setScore(props.score + 1);
        }
        setClicked(true);
        setExplanation(true);
    }


    return (
        <div className="wrapper">
            <h1>It's Time To Get JavaSavyyyyy</h1>
            <div className="mainContainer">
                <div className="triviaContainer">
                    <div className="codeSnippet">
                         <p className="codesnippet"> Prompt: <br/><br/>{state.codeSnippet} </p>
                    </div>
                    <div className="questionArea">
                        <p>Question: {state.currentQuestion}</p>
                    </div>
                    <div className="answerOptions">
                        { state.answerOptions.A && <button onClick={(e) => changeBoolean(e)}>A  {state.answerOptions.A} </button> }
                        { state.answerOptions.B && <button onClick={(e) => changeBoolean(e)}>B  {state.answerOptions.B} </button> }
                        { state.answerOptions.C && <button onClick={(e) => changeBoolean(e)}>C  {state.answerOptions.C} </button> }
                        { state.answerOptions.D && <button onClick={(e) => changeBoolean(e)}>D  {state.answerOptions.D} </button> }
                    </div>
                    <div className="explanation">
                        { explanation && <Answer correctAnswer={state.correctAnswer} explanation={state.answerExplanation}/> }
                        
                    </div> 
                </div>
                <div>
                    <h2>Name: {props.username}</h2>
                    <h2>Score: {props.score} </h2>
                    
                </div>
                <div className="leaderboardContainer">
                    <p>High Scores:</p>
                    <LeaderBoard />
                </div>
            </div>
            <button onClick={grabTrivia}>Next Question</button>
            <button className="signOut" onClick={logOut}>Sign Out</button>
            
        </div>
    )
}

export default TriviaPage;


            //.then(data => setState({
            //   i: state.i + 1,
            //   codeSnippet: data.questions[state.i].codeSnippet,
            //currentQuestion: data.questions[state.i].question,
            //answerExplanation: data.questions[state.i].answerExplanation,
            //}))
            //
            // .then(console.log(res))
            // PROTOTYPE OF RENDERING BUTTON OPTIONS: