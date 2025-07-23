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
 * エディタでリポジトリを開く
 */
async function openInEditor(repoInfo) {
  try {
    const { basePath, editorScheme } = await chrome.storage.sync.get({
      basePath: '',
      editorScheme: 'vscode://file'
    });
    
    if (!basePath) {
      throw new Error('ベースパスが設定されていません。設定から設定してください。');
    }
    
    // エディタ URL スキームを構築
    const editorUrl = `${editorScheme}${basePath}${repoInfo.fullName}`;
    
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