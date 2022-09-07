import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeaderBoard from './LeaderBoard';
import Answer from './Answer';


// look into redux toolkit to make this simpler
const TriviaPage = props => {
  const [ explanation, setExplanation ] = useState(false);
  const [ clicked, setClicked ] = useState(false);
  const [incorrect, setIncorrect] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [state, setState] = useState({
    i: 0,
    codeSnippet: '',
    currentQuestion: '',
    answerExplanation: '',
    answerOptions: {
      A: '',
      B: '',
      C: '',
      D: '',
    },
    correctAnswer: '',
    answerExplanation: '',
  });

  const navigate = useNavigate();

  const logOut = () => {
    navigate('/landing');
  };

  // refactor not to reload all questions on button click
  //https://api.javascript-trivia.com/en/2 (questions start at index 1)
  const grabTrivia = () => {
    fetch(`https://api.javascript-trivia.com/`)
      .then(res => res.json())
      .then(data => {
        setState({
          i: state.i + 1,
          codeSnippet: data.questions[state.i].codeSnippet,
          currentQuestion: data.questions[state.i].question,
          answerOptions: data.questions[state.i].answerOptions,
          correctAnswer: data.questions[state.i].correctAnswer,
          answerExplanation: data.questions[state.i].answerExplanation,
        });
        setExplanation(false);
        setClicked(false);
      });
  };

  // checks for correct answer and sets the score
  const changeBoolean = e => {
    if (e.target.innerHTML[0] === state.correctAnswer && clicked === false) {
      let tempor = correct
      setCorrect(tempor + 1);
      let temp = props.score + 1;
      fetch('/api', {
        method: 'PATCH',
        body: JSON.stringify({
            username: props.username,
            score: temp,
        }),
        headers: { 'Content-Type' : 'application/json' },
      })
      .then(res => res.json())
      .then(data => props.setScore(temp))
      .catch(err => console.log('error: ', err))
    } else if (e.target.innerHTML[0] !== state.correctAnswer && clicked === false) {
      let incorrectTemp = incorrect;
      setIncorrect(incorrectTemp + 1);

    }
    setClicked(true);
    setExplanation(true);
  };

  // maybe break down into different react components
  return (
    <div className="wrapper">
      <h1 className="landingH1">It's Time To Get JavaSavvyyyy</h1>
      <div className="mainContainer">
        <div className="triviaContainer">
          <div className="codeSnippet">
            <p className="codesnippet">
              
              Prompt: <br />
              <br />
              {state.codeSnippet}{' '}
            </p>
          </div>
          <div className="questionArea">
            <p>Question: {state.currentQuestion}</p>
          </div>
          <div className="answerOptions">
            {state.answerOptions.A && (
              <button onClick={e => changeBoolean(e)}>
                A {state.answerOptions.A}{' '}
              </button>
            )}
            {state.answerOptions.B && (
              <button onClick={e => changeBoolean(e)}>
                B {state.answerOptions.B}{' '}
              </button>
            )}
            {state.answerOptions.C && (
              <button onClick={e => changeBoolean(e)}>
                C {state.answerOptions.C}{' '}
              </button>
            )}
            {state.answerOptions.D && (
              <button onClick={e => changeBoolean(e)}>
                D {state.answerOptions.D}{' '}
              </button>
            )}
          </div>
          <div className="explanation">
            {explanation && (
              <Answer
                correctAnswer={state.correctAnswer}
                explanation={state.answerExplanation}
              />
            )}
          </div>
          <div className="incorrectAnswer">
            Correctly Answered: {correct} <br/>
            Incorrectly Answered: {incorrect}
          </div>
        </div>
        <div className="nameAndButtons">
          <h2>Name: {props.username}</h2>
          <button className="landingButton" onClick={grabTrivia}>Next Question</button>
          <button className="landingButton" onClick={logOut}>Sign Out</button>
        </div>
        <div className="leaderboardContainer">
          <h2>High Scores:</h2>
          <LeaderBoard score={props.score}/>
        </div>
      </div>
    </div>
  );
};

export default TriviaPage;


