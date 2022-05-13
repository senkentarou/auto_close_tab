import ReactDOM from 'react-dom';
import { Button, Container, Switch, Typography } from '@mui/material';

const handleOpenIndex = () => {
  const url = chrome.runtime.getURL('index.html');
  chrome.tabs.create({ url }).catch((e) => console.error(e));
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
      <Button>Add current site to Blacklist</Button>
      <Button>Add current site to Whitelist</Button>
      <Button onClick={handleOpenIndex}>Configuration Details</Button>
    </Container>
  );
};

ReactDOM.render(<Popup />, document.getElementById('popup'));
