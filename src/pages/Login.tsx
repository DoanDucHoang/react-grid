import '../App.css';
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth, db } from '../firestore';
import { Link, useNavigate } from 'react-router-dom';
import { collection } from 'firebase/firestore';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const onLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        const user = userCredential.user;
        navigate('/');
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setErrorMessage(errorCode);
      });
  };

  return (
    <div className="login-form">
      <h2>LogIn</h2>
      <TextField
        label="Email"
        size="small"
        sx={{ m: 1, width: '35ch' }}
        onChange={e => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        size="small"
        type="password"
        sx={{ m: 1, width: '35ch' }}
        onChange={e => setPassword(e.target.value)}
      />
      <div className="error">{errorMessage}</div>
      <div className="button-login">
        <Button
          variant="contained"
          sx={{ m: 1, width: '15ch' }}
          onClick={onLogin}
        >
          login
        </Button>
        <Link to={'/register'} className="link">
          <Button variant="outlined" sx={{ m: 1, width: '15ch' }}>
            register
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Login;
