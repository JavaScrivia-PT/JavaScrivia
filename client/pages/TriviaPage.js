import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LeaderBoard from './LeaderBoard';
import Answer from './Answer';
import Favorite from './Favorite';
import FavoritesDisplay from './FavoritesDisplay';
// import { useEffect } from 'react/cjs/react.production.min';


// look into redux toolkit to make this simpler
const TriviaPage = props => {
  const [ explanation, setExplanation ] = useState(false);
  const [ clicked, setClicked ] = useState(false);
  const [incorrect, setIncorrect] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [questions, setQuestions] = useState(null)
  const [state, setState] = useState({
    i: 0,
    codeSnippet: '',
    currentQuestion: '',
    answerOptions: {
      A: '',
      B: '',
      C: '',
      D: '',
      E: ''
    },
    correctAnswer: '',
    answerExplanation: '',
  });

  //const [progress, setProgress] = useState(props.progress);
  const [accuracy, setAccuracy] = useState(0/*state.i === 0 ? 0 : (Math.floor(props.score / state.i)) * 100*/);
  const [ isFavorite, setIsFavorite ] = useState(false);

  const navigate = useNavigate();

  const logOut = () => {
    navigate('/landing');
  };

  useEffect(() => {
    if (questions) {
      const randomizedState = {...state};
      const answerOptions = {...state.answerOptions}
      randomizedState.answerOptions = answerOptions;
      const currentOptions = questions.questions[state.i].answerOptions;
      const randomMap = {};
      const letters = Object.keys(currentOptions).slice();
      letters.forEach(key => {
        randomMap[key] = null;
      });
      for(const option in randomMap) {
        const randIndex = Math.floor(Math.random() * letters.length);
        randomMap[option] = letters[randIndex];
        letters.splice(randIndex, 1);
      }
      // console.log('randomized map:', randomMap);
      randomizedState.correctAnswer = randomMap[state.correctAnswer];
      for (const option in state.answerOptions) {
        // console.log('letter accessed:', option)
        // console.log('answer given:', state.answerOptions[option]);
        randomizedState.answerOptions[randomMap[option]] = state.answerOptions[option];
      }
      setState(randomizedState);
      console.log(state);
    }
  }, [state.i])

  // refactor not to reload all questions on button click

  // pull all questions once and store in the state to make aplication more scalable
  //in the future same logic to store all created questions as opposed to multiple calls

  // make a seperate handle click to just change question id and get a new question
  //https://api.javascript-trivia.com/en/2 (questions start at index 1)
  // const grabTrivia = () => {
  //   fetch(`https://api.javascript-trivia.com/`)
  //     .then(res => res.json())
  //     .then(data => {
  //       setState({
  //         i: state.i + 1,
  //         codeSnippet: data.questions[state.i].codeSnippet,
  //         currentQuestion: data.questions[state.i].question,
  //         answerOptions: data.questions[state.i].answerOptions,
  //         correctAnswer: data.questions[state.i].correctAnswer,
  //         answerExplanation: data.questions[state.i].answerExplanation,
  //       });
  //       setExplanation(false);
  //       setClicked(false);
  //     });
  // };

  //this is essentially handleclick to determine which question we want to render

  const changeQuestion = () => {
    if (clicked) {
      let i = state.i + 1;
      if (i >= questions.questions.length) {
        console.log('triggered overflow')
        i = 0;
      }
      console.log('sent progress', i)
      fetch('/api/updateProgress', {
        method: 'PATCH',
        body: JSON.stringify({
          username: props.username,
          progress: i.toString(),
        }),
        headers: { 'Content-Type' : 'application/json' },
      })
      .then(res => res.json())
      .then(data => {
        console.log('data:', data);
        const i = Number(data.progress);
        props.setProgress(data.progress);
        let newAccuracy; 
        console.log('i: ', i)
        console.log('props.score: ', props.score)
        if(i === 0) {
          newAccuracy = 0;
        } else {
          newAccuracy = Math.floor((props.score / i) * 100) ;
        }
        console.log('newAccuracy: ',newAccuracy)
        setAccuracy(newAccuracy)
        console.log('props.score: ', props.score);
        console.log('i: ', i);
        console.log('recieved response', i);
        setState({
          i,
          codeSnippet: questions.questions[i].codeSnippet,
          currentQuestion: questions.questions[i].question,
          answerOptions: questions.questions[i].answerOptions,
          correctAnswer: questions.questions[i].correctAnswer,
          answerExplanation: questions.questions[i].answerExplanation,
        });
      })
      .catch(err => console.log('error: ', err));
      setExplanation(false);
      setClicked(false);
    }
  }
  
  //useffect hook allows us to emulate a component did mount in order to to make the fetch call once, 
  //we will just grab our questions from this big variable from now on
  useEffect(() => {
    fetch(`https://api.javascript-trivia.com/`)
      .then(res => res.json())
      .then(data => {
        console.log(props.progress);
        setState({
          i: Number(props.progress),
          codeSnippet: data.questions[props.progress].codeSnippet,
          currentQuestion: data.questions[props.progress].question,
          answerOptions: data.questions[props.progress].answerOptions,
          correctAnswer: data.questions[props.progress].correctAnswer,
          answerExplanation: data.questions[props.progress].answerExplanation,
        })
        setQuestions(data);
        console.log('score:', props.score, 'progress:', props.progress, 'intended accuracy:', Math.floor((props.score / Number(props.progress)) * 100));
        setAccuracy(Number(props.progress) === 0 ? 0 : Math.floor((props.score / Number(props.progress)) * 100))
      });
  }, [])

  // checks for correct answer and sets the score
  const changeBoolean = e => {
    if (e.target.innerHTML[0] === state.correctAnswer && clicked === false) {
      setCorrect(correct + 1);
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
      .then(data => {
        console.log('score data: ',data)
        props.setScore(temp)
      })
      .catch(err => console.log('error: ', err))
    } else if (e.target.innerHTML[0] !== state.correctAnswer && clicked === false) {
      setIncorrect(incorrect + 1);
    }
    setClicked(true);
    setExplanation(true);
  };

  
  //make a reset button handle click that makes a fetch patch request to the backend 
  //make a router for that patch request 
  //make the middleware that queries the db and updates it with the progress and score set to 0
  //make another fetch req on the front end that queries the db for that new progress and score value
  const reset = () => {
    fetch('/api/resetScore', {
      method: 'PATCH',
      body: JSON.stringify({
        username: props.username,
      }),
      headers: { 'Content-Type' : 'application/json' },
    })
      .then(res => res.json())
      .then(data => {
       // console.log('resetData: ', data);
        //console.log('data.progress: ', data.progress);
        props.setProgress(data.progress);
        props.setScore(data.score);
        setAccuracy(0);
        setState({    i: 0,
          codeSnippet: questions.questions[0].codeSnippet,
          currentQuestion: questions.questions[0].question,
          answerOptions: questions.questions[0].answerOptions,
          correctAnswer: questions.questions[0].correctAnswer,
          answerExplanation: questions.questions[0].answerExplanation,})
        //console.log('state: ', state);
        //console.log('data.score: ', data.score)
        setIncorrect(0);
        setCorrect(0);
      })
  }

  // maybe break down into different react components

  //Math.floor((accuracy/progress * 100))
  return (
    <div className="wrapper">
      <h1 className="landingH1">It's Time To Get JavaSavvyyyy</h1>
          <h2>Name: {props.username}</h2>
          <h2 className="percentage">Progress {Math.floor((props.progress/155) * 100)}% {`(${props.progress}/155)`}</h2>
          <h2 className="accuracy">Accuracy {accuracy}% </h2>
      <div className="mainContainer">
        <div className="triviaContainer">
          <Favorite username={props.username} question={state.i} isFavorite={isFavorite} setIsFavorite={setIsFavorite}/>
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
            {state.answerOptions.E && (
              <button onClick={e => changeBoolean(e)}>
                E {state.answerOptions.E}{' '}
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
            Correctly Answered This Session: {correct} <br/>
            Incorrectly Answered This Session: {incorrect}
          </div>
        </div>
        <div className="nameAndButtons">
          <button onClick={e => reset()}> Reset Score and Progress</button><br />
          <button className="landingButton" onClick={changeQuestion}>Next Question</button><br />
          <button className="landingButton" onClick={logOut}>Sign Out</button>
        </div>
        <div className="leaderboardContainer">
          <h2>LEADERBOARD</h2>
          <LeaderBoard score={props.score} progress={props.progress} setProgress={props.setProgress}/>
          <FavoritesDisplay username={props.username} isFavorite={isFavorite}/>
        </div>
        
      </div>
    </div>
  );
};

export default TriviaPage;


