import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router';
import './App.css';
import SignUpForm from './components/SignUpForm/SignUpForm';
import Profile from './components/Profile/Profile';
import ResetPassword from './components/ResetPassword/ResetPassword';

function App() {
  return (

    <Router>
      <Routes>
        <Route path='/signup' element={<SignUpForm />} />
        <Route path='/login' element={<SignUpForm />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/update-profile' element={<Profile />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/reset-password' element={<ResetPassword />} />
      </Routes>
    </Router>

  );
}

export default App;
