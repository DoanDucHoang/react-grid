import './App.css';
import * as React from 'react';
import { render } from 'react-dom';
import {
  ReactGrid,
  Column,
  Row,
  CellChange,
  MenuOption,
  SelectionMode,
} from '@silevis/reactgrid';
import '@silevis/reactgrid/styles.css';
import { db } from './firestore';
import {
  collection,
  doc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
  limit,
  startAfter,
  deleteDoc,
} from 'firebase/firestore';
import { useState, useEffect } from 'react';
import Button from './component/buttons';
import PaginationButton from './component/paginationButton';

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
      { type: 'number', value: idx + 1, nonEditable: true },
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

function App() {
  const [userList, setUserList] = useState<Array<Person>>([]);
  const [value, setValue] = useState({});
  const [page, setPage] = useState();
  const [numberOfPage, setNumberOfPage] = useState(12);
  const [list, setList] = useState<Array<Person>>([]);
  let unsbscribe: any;

  const callbackFunction = (childData: any) => {
    setValue(childData);
  };

  const callbackFunctionPagination = (childData: any) => {
    setPage(childData);
  };

  const fetchData = async (order: any) => {
    try {
      const temp = collection(db, 'users');
      const q = query(temp, orderBy(order.value, order.type));
      unsbscribe = onSnapshot(q, doc => {
        const data: any = doc.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));
        setUserList(data);
      });
    } catch (error) {}
  };

  const applyChangesToPeople = (
    changes: CellChange<any>[],
    prevPeople: Person[]
  ) => {
    let idx: any;
    changes.forEach(change => {
      const personIndex: any = change.rowId;
      const fieldName: any = change.columnId;
      idx = personIndex;
      const textValue = change.newCell.text;
      const valuefield = change.newCell.value;
      prevPeople[personIndex][fieldName] =
        typeof prevPeople[personIndex][fieldName] === 'string'
          ? textValue
          : valuefield;
    });
    updateUserFireStore(prevPeople[idx]);
    return [...prevPeople];
  };

  const updateUserFireStore = async (prevPeople: Person) => {
    const docRef = doc(db, 'users', prevPeople.id);
    await updateDoc(docRef, {
      date: prevPeople.date.toString(),
      name: prevPeople.name.toString(),
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
    fetchData(value);
    return unsbscribe;
  };

  const handleCellChange = (changes: any) => {
    setList(prevPeople => applyChangesToPeople(changes, prevPeople));
  };

  const handleContextMenu = (
    selectedRowIds: any,
    selectedColIds: any,
    selectionMode: SelectionMode,
    menuOptions: MenuOption[]
  ): MenuOption[] => {
    if (selectionMode === 'row') {
      menuOptions = [
        {
          id: 'removePerson',
          label: 'Remove person',
          handler: async () => {
            await deleteDoc(doc(db, 'users', list[selectedRowIds].id));
          },
        },
      ];
    }
    return menuOptions;
  };

  const columns = getColumns();

  useEffect(() => {
    fetchData(value);
    return unsbscribe;
  }, [value]);

  useEffect(() => {
    const indexOfLast = Number(page) * numberOfPage;
    const indexOfFirst = indexOfLast - numberOfPage;
    setList(userList.slice(indexOfFirst, indexOfLast));
  }, [userList, page]);

  const rows = getRows(list);

  return (
    <div className="App">
      <h2>Maid Payslip</h2>
      <Button parentCallback={callbackFunction} />

      <ReactGrid
        rows={rows}
        onCellsChanged={handleCellChange}
        onContextMenu={handleContextMenu}
        columns={columns}
        enableRowSelection
        enableColumnSelection
        enableRangeSelection
      />
      <div className="pagination-button">
        <PaginationButton
          props={userList}
          parentCallback={callbackFunctionPagination}
        />
      </div>
    </div>
  );
}

export default App;
