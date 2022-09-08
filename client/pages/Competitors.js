import React from 'react'

const Competitors = (props) => {
  return (
    <div>{props.num} {props.name} {props.score} {props.progress}</div>
  )
}

export default Competitors