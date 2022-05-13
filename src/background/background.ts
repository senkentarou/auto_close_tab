type Data = {
  [key: string]: Array<DataHash>;
};

type DataHash = {
  [key: string]: string;
};

// タブページ更新時
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  chrome.storage.local.get(['enabled', 'blackListTable', 'whiteListTable'], (data: Data) => {
    // 有効設定していない場合 or urlが存在しないなら処理しない
    if (!data['enabled'] || !changeInfo.url) {
      return;
    }

    // 操作不能を防ぐためchromeのパスは除外する
    if (changeInfo.url.match(/chrome.*:\/\//)) {
      return;
    }

    // ホワイトリストの処理
    if (data['whiteListTable']) {
      for (const whiteListRow of data['whiteListTable']) {
        if (whiteListRow['regexp']) {
          // 正規表現によるパターン一致
          const regexp = new RegExp(whiteListRow['pattern']);
          if (changeInfo.url.match(regexp)) {
            return;
          }
        } else if (changeInfo.url === whiteListRow['pattern']) {
          // 完全一致
          return;
        }
      }
    }

    // ブラックリストの処理
    if (!data['blackListTable']) {
      // 登録していないなら処理しない
      return;
    }

    for (const blackListRow of data['blackListTable']) {
      if (blackListRow['regexp']) {
        // 正規表現によるパターン一致
        const regexp = new RegExp(blackListRow['pattern']);
        if (changeInfo.url.match(regexp)) {
          // タブを閉じる
          chrome.tabs.remove(tabId).catch((e: unknown) => console.error(e));
          break;
        }
      } else if (changeInfo.url === blackListRow['pattern']) {
        // 完全一致
        chrome.tabs.remove(tabId).catch((e: unknown) => console.error(e));
        break;
      }
    }
  });
});

// インストール時
chrome.runtime.onInstalled.addListener(() => {
  // 設定ページを開く
  const url = chrome.runtime.getURL('index.html');
  chrome.tabs.create({ url }).catch((e: unknown) => console.error(e));
  // この拡張機能を有効化
  chrome.storage.local.set({ enabled: true }).catch((e: unknown) => console.error(e));
});
