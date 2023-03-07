import './App.css';
import * as React from 'react';
import { render } from 'react-dom';
import {
  ReactGrid,
  Column,
  Row,
  CellChange,
  TextCell,
} from '@silevis/reactgrid';
import '@silevis/reactgrid/styles.css';
import { db } from './firestore';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { useState, useEffect } from 'react';
import InsertRow from './insertRow';
import DeleteRow from './deleteRow';

interface Person {
  [key: string]: any;
  id: string;
  date: string;
  name: string;
  salary: number;
  servingTime: number;
  waiterPayment: number;
  returnHome: number;
  returnHomeAllowance: number;
  numberOfGifts: number;
  giftAllowance: number;
  commemorativePhoto: number;
  commemorativePhotoAllowance: number;
}

const getColumns = (): Column[] => [
  { columnId: 'index', width: 30 },
  { columnId: 'date', width: 100 },
  { columnId: 'name', width: 150 },
  { columnId: 'salary', width: 130 },
  { columnId: 'servingTime', width: 130 },
  { columnId: 'waiterPayment', width: 130 },
  { columnId: 'returnHome', width: 130 },
  { columnId: 'returnHomeAllowance', width: 130 },
  { columnId: 'numberOfGifts', width: 130 },
  { columnId: 'giftAllowance', width: 130 },
  { columnId: 'commemorativePhoto', width: 130 },
  { columnId: 'commemorativePhotoAllowance', width: 130 },
];
const isNumber = (text: string) => {
  return !Number.isNaN(Number(text));
};
const headerRow: Row = {
  rowId: 'header',
  cells: [
    { type: 'header', text: '' },
    { type: 'header', text: '年月' },
    { type: 'header', text: 'メイド名' },
    { type: 'header', text: '総支給額' },
    { type: 'header', text: 'お給仕時間' },
    { type: 'header', text: 'お給仕支給' },
    { type: 'header', text: 'ご帰宅数' },
    { type: 'header', text: 'ご帰宅数手当' },
    { type: 'header', text: 'プレゼント数' },
    { type: 'header', text: 'プレゼント手当' },
    { type: 'header', text: '記念撮影' },
    { type: 'header', text: '記念撮影手当' },
  ],
};

const getRows = (people: Person[]): Row[] => [
  headerRow,
  ...people.map<Row>((person, idx) => ({
    rowId: idx,
    cells: [
      { type: 'number', value: idx + 1 },
      { type: 'text', text: person.date },
      { type: 'text', text: person.name },
      { type: 'number', value: person.salary, nonEditable: true },
      { type: 'number', value: person.servingTime },
      { type: 'number', value: person.waiterPayment },
      { type: 'number', value: person.returnHome },
      { type: 'number', value: person.returnHomeAllowance },
      { type: 'number', value: person.numberOfGifts },
      { type: 'number', value: person.giftAllowance },
      { type: 'number', value: person.commemorativePhoto },
      { type: 'number', value: person.commemorativePhotoAllowance },
    ],
  })),
];
const normalizeNumberText = (numText: string) => {
  const temNumb = numText;
  if (temNumb.includes('.')) {
    temNumb.replaceAll('.', '');
  }
  return temNumb;
};
function App() {
  const [userList, setUserList] = useState<Array<Person>>([]);

  const fetchData = async () => {
    const temp = collection(db, 'users');
    const q = query(temp, orderBy('date', 'asc'));
    onSnapshot(q, doc => {
      const data: any = doc.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      }));
      setUserList(data);
    });
  };

  const applyChangesToPeople = (
    changes: CellChange<any>[],
    prevPeople: Person[]
  ) => {
    let idx: any;
    console.log('🚀 ~ file: App.tsx:126 ~ App ~ changes:', changes);
    changes.forEach(change => {
      const personIndex: any = change.rowId;
      const fieldName: any = change.columnId;
      idx = personIndex;
      const textValue = change.newCell.text;
      const valuefield = change.newCell.value;

      prevPeople[personIndex][fieldName] = isNumber(textValue)
        ? valuefield
        : textValue;
    });
    updateUserFireStore(prevPeople[idx]);
    return [...prevPeople];
  };

  const updateUserFireStore = async (prevPeople: Person) => {
    const docRef = doc(db, 'users', prevPeople.id);
    await updateDoc(docRef, {
      date: prevPeople.date,
      name: prevPeople.name,
      salary:
        Number(
          prevPeople.waiterPayment +
            prevPeople.returnHomeAllowance +
            prevPeople.giftAllowance +
            prevPeople.commemorativePhotoAllowance
        ) * 1.1,
      servingTime: Number(prevPeople.servingTime),
      waiterPayment: Number(prevPeople.waiterPayment),
      returnHome: Number(prevPeople.returnHome),
      returnHomeAllowance: Number(prevPeople.returnHomeAllowance),
      numberOfGifts: Number(prevPeople.numberOfGifts),
      giftAllowance: Number(prevPeople.giftAllowance),
      commemorativePhoto: Number(prevPeople.commemorativePhoto),
      commemorativePhotoAllowance: Number(
        prevPeople.commemorativePhotoAllowance
      ),
    });
    fetchData();
  };

  const handleCellChange = (changes: any) => {
    setUserList(prevPeople => applyChangesToPeople(changes, prevPeople));
  };
  const rows = getRows(userList);
  const columns = getColumns();

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="App">
      <h2>Maid Payslip</h2>
      <InsertRow />
      <DeleteRow />
      <ReactGrid
        rows={rows}
        onCellsChanged={handleCellChange}
        columns={columns}
      />
    </div>
  );
}

export default App;
