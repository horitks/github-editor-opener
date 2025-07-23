// popup.js - GitHub GHQ Opener のポップアップ機能

/**
 * GitHub のリポジトリ情報を現在のタブから取得する
 */
async function getCurrentGitHubRepo() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab.url || !tab.url.includes('github.com')) {
      throw new Error('GitHub のページではありません');
    }
    
    // GitHub URL からリポジトリ情報を抽出
    const url = new URL(tab.url);
    const pathParts = url.pathname.split('/').filter(part => part);
    
    if (pathParts.length < 2) {
      throw new Error('リポジトリページではありません');
    }
    
    const owner = pathParts[0];
    const repo = pathParts[1];
    
    return {
      owner,
      repo,
      fullName: `${owner}/${repo}`,
      url: tab.url
    };
  } catch (error) {
    throw error;
  }
}

/**
 * 設定されたベースパスを取得する
 */
async function getBasePath() {
  const result = await chrome.storage.sync.get(['basePath']);
  return result.basePath || '';
}

/**
 * エディタでリポジトリを開く
 */
async function openInEditor(repoInfo) {
  try {
    const basePath = await getBasePath();
    
    if (!basePath) {
      throw new Error('ベースパスが設定されていません。設定から設定してください。');
    }
    
    // vscode:// URL スキームを構築
    const editorUrl = `vscode://file${basePath}${repoInfo.fullName}`;
    
    // URL スキームを開く
    window.open(editorUrl, '_blank');
    
    // 成功メッセージを表示
    showMessage('エディタで開きました', 'success');
    
  } catch (error) {
    showError(error.message);
  }
}

/**
 * エラーメッセージを表示する
 */
function showError(message) {
  const errorElement = document.getElementById('error');
  errorElement.textContent = message;
  errorElement.style.display = 'block';
}

/**
 * メッセージを表示する
 */
function showMessage(message, type = 'info') {
  const errorElement = document.getElementById('error');
  errorElement.textContent = message;
  errorElement.style.display = 'block';
  
  if (type === 'success') {
    errorElement.style.backgroundColor = '#f0f9ff';
    errorElement.style.borderColor = '#0969da';
    errorElement.style.color = '#0969da';
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
  try {
    // ローディング表示
    document.getElementById('loading').style.display = 'block';
    document.getElementById('content').style.display = 'none';
    
    // GitHub リポジトリ情報を取得
    const repoInfo = await getCurrentGitHubRepo();
    
    // UI に情報を表示
    document.getElementById('repoName').textContent = repoInfo.fullName;
    document.getElementById('repoUrl').textContent = repoInfo.url;
    
    // ローディングを非表示にしてコンテンツを表示
    document.getElementById('loading').style.display = 'none';
    document.getElementById('content').style.display = 'block';
    
    // イベントリスナーを設定
    document.getElementById('openInEditor').addEventListener('click', () => {
      openInEditor(repoInfo);
    });
    
    document.getElementById('openSettings').addEventListener('click', openSettings);
    
  } catch (error) {
    // エラーが発生した場合
    document.getElementById('loading').style.display = 'none';
    document.getElementById('content').style.display = 'block';
    showError(error.message);
    
    // 設定ボタンのみ有効にする
    document.getElementById('openInEditor').disabled = true;
    document.getElementById('openSettings').addEventListener('click', openSettings);
  }
}

// DOM が読み込まれたら初期化を実行
document.addEventListener('DOMContentLoaded', initializeUI);