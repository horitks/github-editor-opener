// settings.js - GitHub Editor Opener の設定画面機能

/**
 * 設定をロードして UI に反映する
 */
async function loadSettings() {
  try {
    const result = await chrome.storage.sync.get(['basePath', 'editorScheme']);
    
    // ベースパスを設定
    const basePathInput = document.getElementById('basePath');
    if (result.basePath) {
      basePathInput.value = result.basePath;
    }
    
    // エディタスキームを設定
    const editorSchemeInput = document.getElementById('editorScheme');
    if (result.editorScheme) {
      editorSchemeInput.value = result.editorScheme;
    } else {
      // デフォルト値を設定
      editorSchemeInput.value = 'vscode://file';
    }
    
  } catch (error) {
    showMessage('設定の読み込みに失敗しました: ' + error.message, 'error');
  }
}

/**
 * 設定を保存する
 */
async function saveSettings(formData) {
  try {
    const basePath = formData.get('basePath').trim();
    const editorScheme = formData.get('editorScheme').trim();
    
    // 入力値の検証
    if (!basePath) {
      throw new Error('ベースパスを入力してください');
    }
    
    if (!editorScheme) {
      throw new Error('エディタ URL スキームを入力してください');
    }
    
    // ベースパスが '/' で終わっていない場合は追加
    const normalizedBasePath = basePath.endsWith('/') ? basePath : basePath + '/';
    
    // 設定を保存
    await chrome.storage.sync.set({
      basePath: normalizedBasePath,
      editorScheme: editorScheme
    });
    
    showMessage('設定を保存しました', 'success');
    
  } catch (error) {
    showMessage('設定の保存に失敗しました: ' + error.message, 'error');
  }
}

/**
 * 設定をリセットする
 */
async function resetSettings() {
  try {
    if (confirm('設定をリセットしますか？')) {
      await chrome.storage.sync.clear();
      
      // フォームをクリア
      document.getElementById('basePath').value = '';
      document.getElementById('editorScheme').value = 'vscode://file';
      
      showMessage('設定をリセットしました', 'success');
    }
  } catch (error) {
    showMessage('設定のリセットに失敗しました: ' + error.message, 'error');
  }
}

/**
 * メッセージを表示する
 */
function showMessage(message, type = 'info') {
  const messageElement = document.getElementById('message');
  messageElement.textContent = message;
  messageElement.className = `message ${type}`;
  messageElement.style.display = 'block';
  
  // 3秒後に自動で非表示にする
  setTimeout(() => {
    messageElement.style.display = 'none';
  }, 3000);
}

/**
 * フォームの送信イベントを処理する
 */
function handleFormSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  saveSettings(formData);
}

/**
 * リセットボタンのクリックイベントを処理する
 */
function handleResetClick() {
  resetSettings();
}

/**
 * 初期化処理
 */
function initialize() {
  // 設定をロード
  loadSettings();
  
  // イベントリスナーを設定
  document.getElementById('settingsForm').addEventListener('submit', handleFormSubmit);
  document.getElementById('resetBtn').addEventListener('click', handleResetClick);
}

// DOM が読み込まれたら初期化を実行
document.addEventListener('DOMContentLoaded', initialize);