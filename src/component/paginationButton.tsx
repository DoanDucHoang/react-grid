import React, { useState, useEffect } from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

function PaginationButton(props: any) {
  const [page, setPage] = useState(1);
  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const sendData = (value: any) => {
    props.parentCallback(value);
  };

  useEffect(() => {
    sendData(page);
  }, [page]);

  return (
    <div className="pagination">
      <Stack spacing={2}>
        <Pagination
          count={Math.ceil(props.props.length / 12)}
          onChange={handleChangePage}
        />
      </Stack>
    </div>
  );
}

export default PaginationButton;
