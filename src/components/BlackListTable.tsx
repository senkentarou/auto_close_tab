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
  Checkbox,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';

const BlackListTableContainer = styled(TableContainer)({
  width: '100%',
  height: '18rem',
  marginBottom: '2rem'
});

const BlackListFormControl = styled(FormControl)({
  width: '100%',
  display: 'inline-block',
  marginTop: '1rem'
});

const BlackListInput = styled(TextField)({
  width: '600px',
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
    // 空白のみは弾く
    if (blackListRow['pattern'].trim() === '') {
      return;
    }

    // 同じパターンなら弾く
    const samePatternIndex = blackListTable.findIndex((data) => data['pattern'] === blackListRow['pattern']);
    if (samePatternIndex !== -1) {
      return;
    }

    const nextList = [...blackListTable, blackListRow];
    chrome.storage.local.set({ blackListTable: nextList }, () => {
      setBlackListTable(nextList);
      setBlackListRow(initialBlackListRow);
    });
  };

  const handleDeleteRow = (data: BlackListRow) => {
    const nextList = blackListTable.filter((blackListRow) => blackListRow['pattern'] !== data['pattern']);
    chrome.storage.local.set({ blackListTable: nextList }, () => {
      setBlackListTable(nextList);
    });
  };

  useEffect(() => {
    chrome.storage.local.get('blackListTable', (data: BlackListStorage) => {
      setBlackListTable(data['blackListTable'] || []);
    });
  }, []);

  return (
    <Container style={{ marginBottom: '2rem' }}>
      <Typography variant="h5">Blacklisted sites</Typography>
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
      <BlackListTableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>pattern</TableCell>
              <TableCell>regexp</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blackListTable.map((data, idx) => {
              return (
                <TableRow key={idx} style={{ wordBreak: 'break-all' }}>
                  <TableCell>{data['pattern']}</TableCell>
                  <TableCell>{data['regexp'].toString()}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleDeleteRow(data)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </BlackListTableContainer>
    </Container>
  );
};
