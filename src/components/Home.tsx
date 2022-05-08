import React, { useState, useEffect } from 'react';

import { AppBar, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const MyAppBar = styled(AppBar)({
  width: '100%',
  height: '4rem',
  marginBottom: '1rem',
  justifyContent: 'center'
});

const AppTitle = styled(Typography)({
  marginLeft: '1rem'
});

type Hash = { [key: string]: string };

export const Home: React.VFC = () => {
  const [blackListTable, setBlackListTable] = useState<Array<Hash>>([]);
  const [blackListRow, setBlackListRow] = useState<Hash>({});

  const handleSetList = () => {
    if (Object.keys(blackListRow).length === 0) {
      return;
    }
    const nextList = [...blackListTable, blackListRow];
    chrome.storage.local.set({ 'blackListTable': nextList }, () => {
      setBlackListTable(nextList);
      setBlackListRow({});
    });
  };

  useEffect(() => {
    chrome.storage.local.get('blackListTable', (data) => {
      setBlackListTable(data['blackListTable'] || []);
    });
  }, []);

  return (
    <>
      <MyAppBar position="static">
        <AppTitle variant="h4">Auto Close Tab</AppTitle>
      </MyAppBar>
      <Typography variant="h5">
        Blacklisted sites
      </Typography>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                pattern
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blackListTable.map((data) => {
              return (
                <TableRow>
                  <TableCell>
                    {data['pattern']}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TextField onChange={(e) => setBlackListRow({ ...blackListRow, pattern: e.target.value })} value={blackListRow['pattern'] || ''} />
      <Button variant="contained" onClick={handleSetList}>追加</Button>
    </>
  );
};
