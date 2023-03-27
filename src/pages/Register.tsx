import '../App.css';
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { auth, db } from '../firestore';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const onRegister = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        const user: any = userCredential.user;
        const auth: any = getAuth();
        updateProfile(auth.currentUser, {
          displayName: name,
        });
        const newCollectionRef = collection(db, user.email);
        addDoc(newCollectionRef, {
          date: new Date().getMonth() + 1 + '/' + new Date().getFullYear(),
          name: '',
        });
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setErrorMessage(errorCode);
      });
  };

  return (
    <div className="login-form">
      <h2>Register</h2>
      <TextField
        label="Your Name"
        size="small"
        sx={{ m: 1, width: '35ch' }}
        onChange={e => setName(e.target.value)}
      />

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
        <Link to={'/login'} className="link">
          <Button
            variant="contained"
            sx={{ m: 1, width: '15ch' }}
            onClick={onRegister}
          >
            Submit
          </Button>
        </Link>
        <Link to={'/login'} className="link">
          <Button variant="outlined" sx={{ m: 1, width: '15ch' }}>
            Login
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Register;
