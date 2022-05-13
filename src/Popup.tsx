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
      const currentUrl = tabs[0].url || '';
      if (currentUrl.trim() === '') {
        return;
      }
      chrome.storage.local.get(name, (data: ListStorage) => {
        const list = data[name] || [];
        const nextList = [...list, { pattern: currentUrl, regexp: false }];
        chrome.storage.local.set({ [name]: nextList }).catch((e: unknown) => console.error(e));
      });
    }
  );
};

const Popup = () => {
  return (
    <Container style={{ width: '15rem', height: '13rem' }}>
      <div style={{ display: 'inline-block' }}>
        <Typography component="span" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}>
          Auto Close Tab
        </Typography>
        <Switch />
      </div>
      <Button onClick={() => addList('blackListTable')}>Add current site to Blacklist</Button>
      <Button onClick={() => addList('whiteListTable')}>Add current site to Whitelist</Button>
      <Button onClick={handleOpenIndex}>Configuration Details</Button>
    </Container>
  );
};

ReactDOM.render(<Popup />, document.getElementById('popup'));
