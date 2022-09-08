import React, { useState, useEffect } from 'react';

const FavoritesDisplay = props => {
  const [favoritesList, setFavoritesList] = useState([]);

  useEffect(() => {
    fetch(`/allfavorites?username=${props.username}`)
      .then(res => res.json())
      .then(data => {
        const newFavoritesList = [];
        // console.log(data);
        data.forEach(question => {
          newFavoritesList.push(question.question);
        });
        console.log(newFavoritesList)
        setFavoritesList(newFavoritesList);
      })
  }, [props.isFavorite])

  return(
    <div className='favoriteslist'>
      <p>Favorite Questions:</p>
      <p>{favoritesList.join(', ')}</p>
    </div>
  )
}

export default FavoritesDisplay;