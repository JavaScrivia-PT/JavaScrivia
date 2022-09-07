import React, { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';

import App from '../client/App'
import SignupPage from '../client/pages/SignupPage'

describe('User Signup unit tests', () => {
  let signupPage;
  // const [ username, setUsername ] = useState('hiii');
  // const [ score, setScore ] = useState(0);
  beforeEach(() => {
    signupPage = render(<Router>
      <SignupPage username={''} setUsername={(input) => console.log(input)} setScore={(input) => console.log(input)}/>
      </Router>
      )
  })

  test('sign up page loads', () => {
    expect(signupPage.getByRole('heading', { level: 3 }).nextSibling).toHaveTextContent('enter');
  })

  test('signup requires unique user name', () => {
    userEvent.click(signupPage.getAllByRole('button')[0]);
    screen.debug();
    expect(signupPage.getByRole('heading', { level: 3 })).toHaveTextContent('Your username/password already exist, please try again')
  })
})
