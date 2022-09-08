import React, { useState, useEffect } from 'react';
import Competitors from './Competitors';

const LeaderBoard = (props) => {
    const [ places, setPlaces ] = useState([]);
    const [ scores, setScore ] = useState([]);

    useEffect(() => {
        console.log('accuracy use effect triggered')
        fetch('/board')
        .then(response => response.json())
        .then(response => {
            console.log('response object', response);
            console.log('props.progress: ', props.progress);
            //response.sort((a,b) => b.score - a.score);
            response.sort((a,b) => (Number(b.progress) === 0 ? 0 : Math.floor((b.score / Number(b.progress)) * 100)) - (Number(a.progress) === 0 ? 0 : Math.floor((a.score / Number(a.progress)) * 100)))
            const finalList = [];
            let key = 1;
            for (const element of response) {
                finalList.push(<Competitors num={key} name={element.username} progress={`${Number(element.progress) === 0 ? 0 : Math.floor((element.score / Number(element.progress)) * 100)}%`}/>)
                key++;
            }
            setPlaces(finalList);
        })
        .catch((err) => console.log(err.json()));
    }, [props.progress]);

    useEffect(() => {
        fetch('/board')
        .then(response => response.json())
        .then(response => {
            response.sort((a,b) => b.score - a.score);
            const scoreList = [];
            let key = 1;
            for (const element of response) {
                scoreList.push(<Competitors num={key} name={element.username} score={element.score}/>)
                key++;
            }
            setScore(scoreList);
        })
        .catch((err) => console.log(err.json()));
    }, [props.score]);

    //Number(element.progress) === 0 ? 0 : Math.floor((element.score / Number(element.progress)) * 100)
  return (
    <div>
        {<h2>MOST COMPLETED</h2>/* <h2>LEADERBOARD SCORE: {props.score}</h2> */}
        {scores[0]} 
        {scores[1]}
        {scores[2]}
        {scores[3]}
        {scores[4]}
        {scores[5]}
        {scores[6]}
        {scores[7]}
        {scores[8]}
        {scores[9]}
        {<h2>ACCURACY LEADERS</h2>/* <h2>LEADERBOARD SCORE: {props.score}</h2> */}
        {places[0]} 
        {places[1]}
        {places[2]}
        {places[3]}
        {places[4]}
        {places[5]}
        {places[6]}
        {places[7]}
        {places[8]}
        {places[9]}
    </div>
  )
}

export default LeaderBoard