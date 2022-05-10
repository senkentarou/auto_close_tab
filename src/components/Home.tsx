import React from 'react';
import { AppBar, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { BlackListTable } from './BlackListTable';
import { WhiteListTable } from './WhiteListTable';

const MyAppBar = styled(AppBar)({
  width: '100%',
  height: '4rem',
  marginBottom: '1rem',
  justifyContent: 'center'
});

const AppTitle = styled(Typography)({
  marginLeft: '1rem'
});

export const Home: React.VFC = () => {
  return (
    <>
      <MyAppBar position="static">
        <AppTitle variant="h4">Auto Close Tab</AppTitle>
      </MyAppBar>
      <BlackListTable />
      <WhiteListTable />
    </>
  );
};
