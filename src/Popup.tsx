import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Button, Container, Switch, Typography } from '@mui/material';

const handleOpenIndex = () => {
  const url = chrome.runtime.getURL('index.html');
  chrome.tabs.create({ url }).catch((e) => console.error(e));
};

type ListStorage = { [key: string]: Array<ListRow> };
type ListRow = {
  pattern: string;
  regexp: boolean;
};

const addList = (name: string) => {
  chrome.tabs.query(
    {
      active: true,
      lastFocusedWindow: true
    },
    (tabs) => {
      const currentUrl = tabs[0]?.url || '';
      if (currentUrl.trim() === '') {
        return;
      }

      chrome.storage.local.get(name, (data: ListStorage) => {
        const list = data[name] || [];

        // 同じパターンなら弾く
        const samePatternIndex = list.findIndex((li) => li['pattern'] === currentUrl);
        if (samePatternIndex !== -1) {
          return;
        }

        const nextList = [...list, { pattern: currentUrl, regexp: false }];
        chrome.storage.local.set({ [name]: nextList }).catch((e: unknown) => console.error(e));
      });
    }
  );
};

const Popup = () => {
  const [appEnabled, setAppEnabled] = useState<boolean | null>(null);

  const handleUpdateUpEnabled = (nextEnabled: boolean) => {
    chrome.storage.local.set({ enabled: nextEnabled }, () => {
      setAppEnabled(nextEnabled);
    });
  };

  useEffect(() => {
    chrome.storage.local.get(['enabled'], (data: { [key: string]: boolean | undefined }) => {
      setAppEnabled(!!data['enabled']);
    });
  }, []);

  return (
    <Container style={{ width: '15rem', height: '13rem' }}>
      <div style={{ display: 'inline-block' }}>
        <Typography component="span" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}>
          Auto Close Tab
        </Typography>
        {appEnabled != null && (
          <Switch
            checked={appEnabled}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdateUpEnabled(e.target.checked)}
          />
        )}
      </div>
      <Button onClick={() => addList('blackListTable')}>Add current site to Blacklist</Button>
      <Button onClick={() => addList('whiteListTable')}>Add current site to Whitelist</Button>
      <Button onClick={handleOpenIndex}>Configuration Details</Button>
    </Container>
  );
};

ReactDOM.render(<Popup />, document.getElementById('popup'));
