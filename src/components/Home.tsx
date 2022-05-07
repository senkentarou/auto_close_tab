import React, { useState, useEffect } from 'react';

import { AppBar, Typography } from '@mui/material';
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

export const Home: React.VFC = () => {
  const [list, setList] = useState<Array<string>>([]);
  const [pattern, setPattern] = useState<string>('');

  const handleSetList = () => {
    if (pattern === '') {
      return;
    }
    const nextList = [...list, pattern];
    chrome.storage.local.set({'list': nextList}, () => {
      setList(nextList);
      setPattern('');
    });
  };

  useEffect(() => {
    chrome.storage.local.get('list', (data) => {
      setList(data['list'] || []);
    });
  }, []);

  return (
    <>
      <MyAppBar position="static">
        <AppTitle variant="h4">my-react-base-app</AppTitle>
      </MyAppBar>
      {list.map((data) => {
        return <div>{data}</div>
      })}
      <input onChange={(e) => setPattern(e.target.value)} value={pattern} />
      <button onClick={handleSetList}>追加</button>
    </>
  );
};
