import ReactDOM from 'react-dom';

const handleOpenIndex = async () => {
  const url = chrome.runtime.getURL('index.html');
  await chrome.tabs.create({ url });
};

const Popup = () => {
  return <button onClick={() => handleOpenIndex}>Configuration details</button>;
};

ReactDOM.render(<Popup />, document.getElementById('popup'));
