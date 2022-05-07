import ReactDOM from "react-dom";

const handleOpenIndex = () => {
  const url = chrome.runtime.getURL("index.html");
  chrome.tabs.create({ url });
};

const Popup = () => {
  return <button onClick={handleOpenIndex}>設定</button>;
};

ReactDOM.render(<Popup />, document.getElementById("popup"));
