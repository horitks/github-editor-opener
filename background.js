// background.js - GitHub Editor Opener のService Worker

// utils.js から共通関数をインポート
importScripts('utils.js');

const { extractRepoInfo, buildEditorUrl, validateSettings } = window.EditorUtils;

/**
 * 通知を表示する
 */
async function showNotification(message, type = 'info') {
  const iconPath = 'icons/icon48.png';
  
  await chrome.notifications.create({
    type: 'basic',
    iconUrl: iconPath,
    title: 'GitHub Editor Opener',
    message: message
  });
}

/**
 * エディタでリポジトリを開く
 */
async function openInEditor(repoInfo, settings) {
  try {
    const editorUrl = buildEditorUrl(repoInfo, settings);
    await chrome.tabs.create({ url: editorUrl });
    return true;
  } catch (error) {
    console.error('Error opening in editor:', error);
    return false;
  }
}

/**
 * 設定画面を開く
 */
async function openSettingsPage() {
  await chrome.tabs.create({
    url: chrome.runtime.getURL('settings.html')
  });
}

/**
 * キーボードショートカットのコマンドハンドラー
 */
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'open-editor') {
    try {
      // アクティブタブを取得
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab || !tab.url) {
        await showNotification('有効なページが見つかりません', 'error');
        return;
      }
      
      // GitHubページかチェック
      if (!tab.url.includes('github.com')) {
        await showNotification('GitHubページではありません', 'warning');
        return;
      }
      
      // リポジトリ情報を抽出
      const repoInfo = extractRepoInfo(tab.url);
      if (!repoInfo) {
        await showNotification('リポジトリページではありません', 'error');
        return;
      }
      
      // 設定を取得
      const settings = await chrome.storage.sync.get({
        basePath: '',
        editorScheme: 'vscode://file',
        openInNewWindow: false
      });
      
      // 設定を検証
      const validation = validateSettings(settings);
      if (!validation.isValid) {
        await showNotification('設定が不完全です。設定画面を開きます。', 'info');
        await openSettingsPage();
        return;
      }
      
      // エディタで開く
      const success = await openInEditor(repoInfo, settings);
      if (success) {
        await showNotification(`${repoInfo.fullName} をエディタで開きました`, 'success');
      } else {
        await showNotification('エディタで開けませんでした', 'error');
      }
      
    } catch (error) {
      console.error('Command handler error:', error);
      await showNotification(`エラー: ${error.message}`, 'error');
    }
  }
});

// Service Worker初期化時のログ
console.log('GitHub Editor Opener Service Worker loaded');