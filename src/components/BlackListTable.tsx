import React, { useState, useEffect } from 'react';
import {
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  FormControl,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { styled } from '@mui/material/styles';

const BlackListTableContainer = styled(TableContainer)({
  width: '100%',
  height: '20rem',
  marginBottom: '1rem'
});

const BlackListFormControl = styled(FormControl)({
  width: '100%',
  display: 'inline-block'
});

const BlackListInput = styled(TextField)({
  width: '300px',
  marginRight: '1rem'
});

type BlackListStorage = { [key: string]: Array<BlackListRow> };
type BlackListRow = {
  pattern: string;
  regexp: boolean;
};

const initialBlackListRow = () => {
  return {
    pattern: '',
    regexp: true
  };
};

export const BlackListTable: React.VFC = () => {
  const [blackListTable, setBlackListTable] = useState<Array<BlackListRow>>([]);
  const [blackListRow, setBlackListRow] = useState<BlackListRow>(initialBlackListRow);

  const handleSetList = () => {
    if (blackListRow['pattern'].trim() === '') {
      return;
    }
    const nextList = [...blackListTable, blackListRow];
    chrome.storage.local.set({ blackListTable: nextList }, () => {
      setBlackListTable(nextList);
      setBlackListRow(initialBlackListRow);
    });
  };

  useEffect(() => {
    chrome.storage.local.get('blackListTable', (data: BlackListStorage) => {
      setBlackListTable(data['blackListTable'] || []);
    });
  }, []);

  return (
    <Container>
      <Typography variant="h5">Blacklisted sites</Typography>
      <BlackListTableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>pattern</TableCell>
              <TableCell>regexp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blackListTable.map((data, idx) => {
              return (
                <TableRow key={idx}>
                  <TableCell>{data['pattern']}</TableCell>
                  <TableCell>{data['regexp'].toString()}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </BlackListTableContainer>
      <BlackListFormControl>
        <BlackListInput
          label="pattern"
          size="small"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setBlackListRow({ ...blackListRow, pattern: e.target.value })
          }
          value={blackListRow['pattern'] || ''}
        />
        <FormControlLabel
          label="regexp"
          control={
            <Checkbox
              checked={blackListRow['regexp']}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setBlackListRow({ ...blackListRow, regexp: e.target.checked })
              }
            />
          }
        />
        <Button variant="contained" onClick={handleSetList}>
          追加
        </Button>
      </BlackListFormControl>
    </Container>
  );
};
