import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router';
import './App.css';
import SignUpForm from './components/SignUpForm/SignUpForm';
import Profile from './components/Profile/Profile';

function App() {
  return (

    <Router>
      <Routes>
          <Route path='/signup' element={<SignUpForm />} />
          <Route path='/login' element={<SignUpForm />} />
          <Route path='/profile' element={<Profile/> } />
          <Route path='/update-profile' element={<Profile/> } />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </Router>

  );
}

export default App;
