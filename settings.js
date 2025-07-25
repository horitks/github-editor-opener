// settings.js - GitHub Editor Opener の設定画面機能

/**
 * 設定をロードして UI に反映する
 */
async function loadSettings() {
  try {
    const result = await chrome.storage.sync.get(['basePath', 'editorScheme', 'editorPreset']);
    
    // ベースパスを設定
    const basePathInput = document.getElementById('basePath');
    if (result.basePath) {
      basePathInput.value = result.basePath;
    }
    
    // エディタプリセットを設定
    const presetSelect = document.getElementById('editorPreset');
    if (result.editorPreset) {
      presetSelect.value = result.editorPreset;
      // プリセット変更イベントを発火してUI更新
      presetSelect.dispatchEvent(new Event('change'));
    }
    
    // エディタスキームを設定（プリセットが設定されていない場合のみ）
    if (!result.editorPreset) {
      const editorSchemeInput = document.getElementById('editorScheme');
      if (result.editorScheme) {
        editorSchemeInput.value = result.editorScheme;
      } else {
        // デフォルト値を設定
        editorSchemeInput.value = 'vscode://file';
      }
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
    const editorPreset = formData.get('editorPreset');
    
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
      editorScheme: editorScheme,
      editorPreset: editorPreset
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
 * エディタプリセットの選択肢を初期化する
 */
function initializeEditorPresets() {
  try {
    const presetManager = new EditorPresetManager();
    const presets = presetManager.getPresetsForCurrentPlatform();
    const select = document.getElementById('editorPreset');
    
    // プリセットオプションを追加
    presets.forEach(preset => {
      const option = document.createElement('option');
      option.value = preset.id;
      option.textContent = `${preset.name} (${preset.type})`;
      select.appendChild(option);
    });
    
    // プリセット変更時のイベントリスナーを追加
    select.addEventListener('change', handlePresetChange);
    
  } catch (error) {
    console.error('プリセット初期化エラー:', error);
  }
}

/**
 * プリセット変更時の処理
 */
function handlePresetChange(event) {
  const presetId = event.target.value;
  const editorSchemeInput = document.getElementById('editorScheme');
  
  if (presetId === 'custom') {
    // カスタム設定の場合は入力を有効にする
    editorSchemeInput.readOnly = false;
    editorSchemeInput.style.backgroundColor = '';
  } else {
    try {
      const presetManager = new EditorPresetManager();
      const preset = presetManager.getPreset(presetId);
      
      // プリセットの値を設定
      if (preset.scheme) {
        editorSchemeInput.value = preset.scheme;
      } else if (preset.command) {
        editorSchemeInput.value = `command:${preset.command}`;
      }
      
      // 読み取り専用にする
      editorSchemeInput.readOnly = true;
      editorSchemeInput.style.backgroundColor = '#f6f8fa';
      
    } catch (error) {
      showMessage('プリセット設定エラー: ' + error.message, 'error');
    }
  }
}

/**
 * 初期化処理
 */
function initialize() {
  // エディタプリセットを初期化
  initializeEditorPresets();
  
  // 設定をロード
  loadSettings();
  
  // イベントリスナーを設定
  document.getElementById('settingsForm').addEventListener('submit', handleFormSubmit);
  document.getElementById('resetBtn').addEventListener('click', handleResetClick);
}

// DOM が読み込まれたら初期化を実行
document.addEventListener('DOMContentLoaded', initialize);