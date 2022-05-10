// タブページ更新時
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  chrome.storage.local.get(['blackListTable', 'whiteListTable'], (data) => {
    if (!changeInfo.url) {
      return;
    }

    // ホワイトリストの処理
    if (data['whiteListTable']) {
      for (const li of data['whiteListTable']) {
        if (li['regexp']) {
          const regexp = new RegExp(li['pattern']);
          if (changeInfo.url?.match(regexp)) {
            return;
          }
        } else if (changeInfo.url === li['pattern']) {
          return;
        }
      }
    }

    // ブラックリストの処理
    if (!data['blackListTable']) {
      return;
    }

    for (const li of data['blackListTable']) {
      // 正規表現の一致するURLにアクセスしていたらタブを閉じる
      if (li['regexp']) {
        const regexp = new RegExp(li['pattern']);
        if (changeInfo.url?.match(regexp)) {
          chrome.tabs.remove(tabId);
          break;
        }
      } else if (changeInfo.url === li['pattern']) {
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
