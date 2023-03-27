import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firestore';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

function Navbar(props: any) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate('/login');
        console.log('Signed out successfully');
      })
      .catch(error => {});
  };

  useEffect(() => {
    if (props.props !== undefined) {
      setUserName(props.props.displayName);
    }
  }, [props.props]);

  return (
    <nav>
      <h2>Maid Payslip</h2>
      <div className="button-logout">
        <span className="user-name">
          Maid Name: <p className="name">{userName}</p>
        </span>
        <Button size="small" variant="contained" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </nav>
  );
}

export default Navbar;
