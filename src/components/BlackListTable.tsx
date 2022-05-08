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
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';

const BlackListTableContainer = styled(TableContainer)({
  width: '100%',
  height: '20rem',
  marginBottom: '1rem',
  justifyContent: 'center'
});

type BlackListStorage = { [key: string]: Array<BlackListRow> };
type BlackListRow = {
  pattern?: string;
  regexp?: boolean;
};

export const BlackListTable: React.VFC = () => {
  const [blackListTable, setBlackListTable] = useState<Array<BlackListRow>>([]);
  const [blackListRow, setBlackListRow] = useState<BlackListRow>({});

  const handleSetList = () => {
    if (Object.keys(blackListRow).length === 0) {
      return;
    }
    const nextList = [...blackListTable, blackListRow];
    chrome.storage.local.set({ blackListTable: nextList }, () => {
      setBlackListTable(nextList);
      setBlackListRow({});
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
            </TableRow>
          </TableHead>
          <TableBody>
            {blackListTable.map((data, idx) => {
              return (
                <TableRow key={idx}>
                  <TableCell>{data['pattern']}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </BlackListTableContainer>
      <TextField
        size="small"
        onChange={(e) => setBlackListRow({ ...blackListRow, pattern: e.target.value })}
        value={blackListRow['pattern'] || ''}
      />
      <Button variant="contained" onClick={handleSetList}>
        追加
      </Button>
    </Container>
  );
};
