import React, { useState, useEffect } from 'react';
import { db } from '../firestore';
import { collection, addDoc } from 'firebase/firestore';
import { options } from '../data/data';
import { types } from '../data/data';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import { RootState } from '../store';
import { useSelector } from 'react-redux';
import axios from 'axios';

function Buttons(props: any) {
  const [value, setValue] = useState({ value: 'date', type: 'asc' });
  const userData = useSelector((state: RootState) => state.user.user);

  function handleChangeValue(e: any) {
    setValue({
      value: e.target.value,
      type: value.type,
    });
  }
  function handleChangeType(e: any) {
    setValue({
      value: value.value,
      type: e.target.value,
    });
  }

  const sendData = (value: any) => {
    props.parentCallback(value);
  };

  const insertRow = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5001/react-grid-dd2de/us-central1/app/${userData.email}`,
        {
          date: new Date().getMonth() + 1 + '/' + new Date().getFullYear(),
          name: userData.displayName,
        }
      );
    } catch (error) {}

    // try {
    //   const docRef = await addDoc(collection(db, userData.email), {
    //     date: new Date().getMonth() + 1 + '/' + new Date().getFullYear(),
    //     name: '',
    //   });
    // } catch (error) {
    //   console.error('Error adding document: ', error);
    // }
  };

  useEffect(() => {
    sendData(value);
  }, [value]);

  return (
    <div className="container-button">
      <div className="buttons">
        <div className="button">
          <Button size="small" variant="contained" onClick={insertRow}>
            Insert
          </Button>
        </div>
      </div>

      <div className="select">
        <FormControl sx={{ m: 1, minWidth: 250 }} onChange={handleChangeValue}>
          <InputLabel variant="standard" htmlFor="uncontrolled-native">
            Value
          </InputLabel>
          <NativeSelect>
            {options.map(option => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </NativeSelect>
        </FormControl>

        <FormControl sx={{ m: 1, minWidth: 100 }} onChange={handleChangeType}>
          <InputLabel variant="standard" htmlFor="uncontrolled-native">
            Value
          </InputLabel>
          <NativeSelect>
            {types.map(type => (
              <option value={type.value} key={type.value}>
                {type.label}
              </option>
            ))}
          </NativeSelect>
        </FormControl>
      </div>
    </div>
  );
}

export default Buttons;
