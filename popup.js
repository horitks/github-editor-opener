// popup.js - GitHub Editor Opener のポップアップ機能

// utils.js から共通関数を使用
const { extractRepoInfo, buildEditorUrl, validateSettings } = window.EditorUtils;

/**
 * GitHub のリポジトリ情報を現在のタブから取得する
 */
async function getCurrentGitHubRepo() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab.url) {
      throw new Error('有効なページが見つかりません');
    }
    
    if (!tab.url.includes('github.com')) {
      throw new Error('GitHub のページではありません');
    }
    
    const repoInfo = extractRepoInfo(tab.url);
    if (!repoInfo) {
      throw new Error('リポジトリページではありません');
    }
    
    return {
      ...repoInfo,
      url: tab.url
    };
  } catch (error) {
    throw error;
  }
}

/**
 * エディタでリポジトリを開く
 */
async function openInEditor(repoInfo) {
  try {
    const settings = await chrome.storage.sync.get({
      basePath: '',
      editorScheme: 'vscode://file',
      openInNewWindow: false
    });
    
    // 設定を検証
    const validation = validateSettings(settings);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }
    
    // エディタ URL を構築
    const editorUrl = buildEditorUrl(repoInfo, settings);
    
    // URL スキームを開く
    window.open(editorUrl, '_blank');
    
    // 成功メッセージを表示
    showMessage('エディタで開きました', 'success');
    
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

/**
 * メッセージを表示する
 */
function showMessage(message, type = 'info') {
  const messageElement = document.getElementById('error');
  messageElement.textContent = message;
  messageElement.style.display = 'block';

  if (type === 'success') {
    messageElement.style.backgroundColor = '#f0f9ff';
    messageElement.style.borderColor = '#0969da';
    messageElement.style.color = '#0969da';
  } else {
    messageElement.style.backgroundColor = '';
    messageElement.style.borderColor = '';
    messageElement.style.color = '';
  }
}

/**
 * 設定画面を開く
 */
function openSettings() {
  chrome.tabs.create({
    url: chrome.runtime.getURL('settings.html')
  });
}

/**
 * UI を初期化する
 */
async function initializeUI() {
  document.getElementById('openSettings').addEventListener('click', openSettings);

  try {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('content').style.display = 'none';

    const repoInfo = await getCurrentGitHubRepo();

    document.getElementById('repoName').textContent = repoInfo.fullName;
    document.getElementById('repoUrl').textContent = repoInfo.url;

    document.getElementById('openInEditor').addEventListener('click', () => {
      openInEditor(repoInfo);
    });
  } catch (error) {
    showMessage(error.message, 'error');
    document.getElementById('openInEditor').disabled = true;
  } finally {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('content').style.display = 'block';
  }
}

// DOM が読み込まれたら初期化を実行
document.addEventListener('DOMContentLoaded', initializeUI);