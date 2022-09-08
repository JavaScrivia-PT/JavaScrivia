import React, { useState, useEffect } from 'react';

const Favorite = props => {

  useEffect(() => {
    fetch(`/favorites?username=${props.username}&question=${props.question}`)
      .then(res => res.json())
      .then(isFavorite => {
        console.log('isFavorite:', isFavorite)
        if (isFavorite) {
<<<<<<< HEAD
          props.setIsFavorite(true);
        } else {
          props.setIsFavorite(false);
=======
          setIsFavorite(true);
        } else {
          setIsFavorite(false);
>>>>>>> dev
        }
      })
      .catch(err => console.log('error: ', err))

  }, [props.question])

  const handleClick = () => {
    if(!isFavorite) {
      fetch('/favorites',
        {
          method: 'POST',
          body: JSON.stringify( { username: props.username, question: props.question } ),
          headers: { 'Content-Type' : 'application/json' },
        })
        .then(res => res.json())
        .then(res => {
          console.log(res);
          props.setIsFavorite(true);
        })
        .catch(err => console.log('error: ', err))
    }
    else {
      fetch('/favorites',
        {
          method: 'DELETE',
          body: JSON.stringify( { username: props.username, question: props.question } ),
          headers: { 'Content-Type' : 'application/json' },
        })
        .then(res => res.json())
        .then(res => {
          console.log(res);
          props.setIsFavorite(false);
        })
        .catch(err => console.log('error: ', err))

    }
  }

  return(
    <div className='favorite'>
      <button className={props.isFavorite ? 'favbutton' : 'notfavbutton'} onClick={handleClick}>{props.isFavorite ? 'Unfavorite' : 'Favorite'}</button>
    </div>
  )
}

export default Favorite;
