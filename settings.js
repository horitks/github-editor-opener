// settings.js - GitHub Editor Opener の設定画面機能

/**
 * グローバル変数
 */
let i18n;

/**
 * 設定をロードして UI に反映する
 */
async function loadSettings() {
  try {
    const result = await chrome.storage.sync.get(['basePath', 'editorScheme', 'editorPreset', 'language']);
    
    // 言語設定をロード
    const languageSelect = document.getElementById('language');
    if (result.language) {
      languageSelect.value = result.language;
      i18n.setLanguage(result.language);
    } else {
      // デフォルト言語（日本語）を設定
      i18n.setLanguage('ja');
    }
    
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
    
    // UI言語を更新
    updateUI();
    
  } catch (error) {
    showMessage(i18n.t('settings.loadError') + ': ' + error.message, 'error');
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
    const language = formData.get('language');
    
    // 入力値の検証
    if (!basePath) {
      throw new Error(i18n.t('settings.validationErrorBasePath'));
    }
    
    if (!editorScheme) {
      throw new Error(i18n.t('settings.validationErrorScheme'));
    }
    
    // ベースパスが '/' で終わっていない場合は追加
    const normalizedBasePath = basePath.endsWith('/') ? basePath : basePath + '/';
    
    // 設定を保存
    await chrome.storage.sync.set({
      basePath: normalizedBasePath,
      editorScheme: editorScheme,
      editorPreset: editorPreset,
      language: language
    });
    
    // 言語が変更された場合はUIを更新
    if (language !== i18n.getCurrentLanguage()) {
      i18n.setLanguage(language);
      updateUI();
    }
    
    showMessage(i18n.t('settings.saveSuccess'), 'success');
    
  } catch (error) {
    showMessage(i18n.t('settings.saveError') + ': ' + error.message, 'error');
  }
}

/**
 * 設定をリセットする
 */
async function resetSettings() {
  try {
    if (confirm(i18n.t('settings.resetConfirm'))) {
      await chrome.storage.sync.clear();
      
      // フォームをクリア
      document.getElementById('language').value = 'ja';
      document.getElementById('basePath').value = '';
      document.getElementById('editorScheme').value = 'vscode://file';
      document.getElementById('editorPreset').value = 'custom';
      
      // 言語をデフォルト（日本語）に戻す
      i18n.setLanguage('ja');
      updateUI();
      
      showMessage(i18n.t('settings.resetSuccess'), 'success');
    }
  } catch (error) {
    showMessage(i18n.t('settings.resetError') + ': ' + error.message, 'error');
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
    editorSchemeInput.placeholder = 'vscode://file';
  } else {
    try {
      const presetManager = new EditorPresetManager();
      const preset = presetManager.getPreset(presetId);
      
      // プリセットの値を設定
      if (preset.scheme) {
        editorSchemeInput.value = preset.scheme;
        editorSchemeInput.placeholder = preset.scheme;
      } else if (preset.command) {
        editorSchemeInput.value = `command:${preset.command}`;
        editorSchemeInput.placeholder = 'コマンド実行';
      }
      
      // 読み取り専用にする
      editorSchemeInput.readOnly = true;
      editorSchemeInput.style.backgroundColor = '#f6f8fa';
      
    } catch (error) {
      showMessage(i18n.t('settings.presetError') + ': ' + error.message, 'error');
    }
  }
}

/**
 * UI言語を更新する
 */
function updateUI() {
  // data-i18n属性を持つすべての要素を更新
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (key) {
      const translatedText = i18n.t(key);
      
      // HTML要素のtextContentまたはinnerHTMLを更新
      if (key.includes('Help') && translatedText.includes('<')) {
        element.innerHTML = translatedText;
      } else {
        element.textContent = translatedText;
      }
    }
  });
  
  // プリセット選択肢のテキストを更新
  updatePresetOptions();
  
  // プレースホルダーテキストを更新
  updatePlaceholders();
}

/**
 * プリセット選択肢のテキストを更新
 */
function updatePresetOptions() {
  const customOption = document.querySelector('#editorPreset option[value="custom"]');
  if (customOption) {
    customOption.textContent = i18n.t('settings.customSetting');
  }
  
  // 他のプリセットオプションも更新
  const presetManager = new EditorPresetManager();
  const presets = presetManager.getPresetsForCurrentPlatform();
  
  presets.forEach(preset => {
    const option = document.querySelector(`#editorPreset option[value="${preset.id}"]`);
    if (option) {
      const presetName = i18n.t(`presets.${preset.id}`) || preset.name;
      const presetType = i18n.t(`presetTypes.${preset.type}`) || preset.type;
      option.textContent = `${presetName} (${presetType})`;
    }
  });
}

/**
 * プレースホルダーテキストを更新
 */
function updatePlaceholders() {
  const basePathInput = document.getElementById('basePath');
  if (basePathInput) {
    basePathInput.placeholder = '/Users/{username}/src/github.com/';
  }
  
  const editorSchemeInput = document.getElementById('editorScheme');
  if (editorSchemeInput) {
    editorSchemeInput.placeholder = 'vscode://file';
  }
}

/**
 * 言語変更イベントハンドラ
 */
function handleLanguageChange(event) {
  const newLanguage = event.target.value;
  i18n.setLanguage(newLanguage);
  updateUI();
}

/**
 * 初期化処理
 */
function initialize() {
  // I18nManagerを初期化
  i18n = new I18nManager();
  
  // 初期表示用にデフォルト言語で翻訳を即座に適用
  updateUI();
  
  // エディタプリセットを初期化
  initializeEditorPresets();
  
  // 設定をロード
  loadSettings();
  
  // イベントリスナーを設定
  document.getElementById('settingsForm').addEventListener('submit', handleFormSubmit);
  document.getElementById('resetBtn').addEventListener('click', handleResetClick);
  document.getElementById('language').addEventListener('change', handleLanguageChange);
}

// DOM が読み込まれたら初期化を実行
document.addEventListener('DOMContentLoaded', initialize);