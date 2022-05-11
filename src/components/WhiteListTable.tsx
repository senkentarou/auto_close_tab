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

const WhiteListTableContainer = styled(TableContainer)({
  width: '100%',
  height: '18rem',
  marginBottom: '2rem'
});

const WhiteListFormControl = styled(FormControl)({
  width: '100%',
  display: 'inline-block',
  marginTop: '1rem'
});

const WhiteListInput = styled(TextField)({
  width: '600px',
  marginRight: '1rem'
});

type WhiteListStorage = { [key: string]: Array<WhiteListRow> };
type WhiteListRow = {
  pattern: string;
  regexp: boolean;
};

const initialWhiteListRow = () => {
  return {
    pattern: '',
    regexp: true
  };
};

export const WhiteListTable: React.VFC = () => {
  const [whiteListTable, setWhiteListTable] = useState<Array<WhiteListRow>>([]);
  const [whiteListRow, setWhiteListRow] = useState<WhiteListRow>(initialWhiteListRow);

  const handleSetList = () => {
    // 空白のみは弾く
    if (whiteListRow['pattern'].trim() === '') {
      return;
    }

    // 同じパターンなら弾く
    const samePatternIndex = whiteListTable.findIndex((data) => data['pattern'] === whiteListRow['pattern']);
    if (samePatternIndex !== -1) {
      return;
    }

    const nextList = [...whiteListTable, whiteListRow];
    chrome.storage.local.set({ whiteListTable: nextList }, () => {
      setWhiteListTable(nextList);
      setWhiteListRow(initialWhiteListRow);
    });
  };

  const handleDeleteRow = (data: WhiteListRow) => {
    const nextList = whiteListTable.filter((whiteListRow) => whiteListRow['pattern'] !== data['pattern']);
    chrome.storage.local.set({ whiteListTable: nextList }, () => {
      setWhiteListTable(nextList);
    });
  };

  useEffect(() => {
    chrome.storage.local.get('whiteListTable', (data: WhiteListStorage) => {
      setWhiteListTable(data['whiteListTable'] || []);
    });
  }, []);

  return (
    <Container>
      <Typography variant="h5">Whitelisted sites</Typography>
      <WhiteListFormControl>
        <WhiteListInput
          label="pattern"
          size="small"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setWhiteListRow({ ...whiteListRow, pattern: e.target.value })
          }
          value={whiteListRow['pattern'] || ''}
        />
        <FormControlLabel
          label="regexp"
          control={
            <Checkbox
              checked={whiteListRow['regexp']}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setWhiteListRow({ ...whiteListRow, regexp: e.target.checked })
              }
            />
          }
        />
        <Button variant="contained" onClick={handleSetList}>
          追加
        </Button>
      </WhiteListFormControl>
      <WhiteListTableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>pattern</TableCell>
              <TableCell>regexp</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {whiteListTable.map((data, idx) => {
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
      </WhiteListTableContainer>
    </Container>
  );
};
