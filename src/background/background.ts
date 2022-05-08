// タブページ更新時
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  chrome.storage.local.get('blackListTable', (data) => {
    if (!data['blackListTable'] || !changeInfo.url) {
      return;
    }

    for (const li of data['blackListTable']) {
      // 正規表現の一致するURLにアクセスしていたらタブを閉じる
      const regexp = new RegExp(li['pattern']);
      if (changeInfo.url?.match(regexp)) {
        chrome.tabs.remove(tabId);
        break;
      }
    }
  });
});

// インストール時
chrome.runtime.onInstalled.addListener(() => {
  // 設定ページを開く
  const url = chrome.runtime.getURL("index.html");
  chrome.tabs.create({ url });
});
