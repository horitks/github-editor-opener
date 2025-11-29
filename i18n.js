// i18n.js - 国際化管理機能

/**
 * サポート言語定数
 */
const LANGUAGES = {
  JA: 'ja',
  EN: 'en'
};

/**
 * 翻訳データ
 */
const TRANSLATIONS = {
  ja: {
    // ポップアップ画面
    popup: {
      title: 'GitHub Editor Opener',
      loading: '読み込み中...',
      openInEditor: 'エディタで開く',
      settings: '設定',
      openSuccess: '{editor}で開きました',
      errorNotGitHub: 'GitHub のページではありません',
      errorNotRepo: 'リポジトリページではありません',
      errorNoBasePath: 'ベースパスが設定されていません。設定から設定してください。',
      errorInvalidPage: '有効なページが見つかりません'
    },

    // 設定画面
    settings: {
      title: '設定',
      pageTitle: 'GitHub Editor Opener - 設定',
      language: '言語',
      languageHelp: '表示言語を選択してください',
      basePath: 'ベースパス',
      basePathHelp: 'GitHub リポジトリが配置されているベースパスを設定してください。<br><a href="https://github.com/x-motemen/ghq" target="_blank" rel="noopener noreferrer">ghq</a>を利用したgit管理を前提としています。<br>例: /Users/{username}/src/github.com/ の場合、リポジトリは /Users/{username}/src/github.com/owner/repository に配置されている必要があります。',
      basePathExample: '例: /Users/{username}/src/github.com/',
      editorPreset: 'エディタプリセット',
      editorPresetHelp: 'よく使われるエディタから選択できます。「カスタム設定」を選ぶと手動で設定できます。',
      customSetting: 'カスタム設定',
      editorScheme: 'エディタ URL スキーム',
      editorSchemeHelp: '使用するエディタの URL スキームを指定してください。<br>Visual Studio Code: vscode://file<br>その他のエディタでも対応している場合があります。',
      editorSchemeExample: '例: vscode://file',
      saveSettings: '設定を保存',
      reset: 'リセット',
      saveSuccess: '設定を保存しました',
      saveError: '設定の保存に失敗しました',
      loadError: '設定の読み込みに失敗しました',
      resetError: '設定のリセットに失敗しました',
      resetSuccess: '設定をリセットしました',
      resetConfirm: '設定をリセットしますか？',
      presetError: 'プリセット設定エラー',
      validationErrorBasePath: 'ベースパスを入力してください',
      validationErrorScheme: 'エディタ URL スキームを入力してください'
    },

    // エディタプリセット
    presets: {
      vscode: 'Visual Studio Code',
      cursor: 'Cursor',
      windsurf: 'Windsurf',
      antigravity: 'Antigravity',
      jetbrains_idea: 'IntelliJ IDEA'
    },

    // プリセットタイプ
    presetTypes: {
      gui: 'GUI',
      command: 'コマンド',
      toolbox: 'Toolbox'
    },

    // 言語名
    languageNames: {
      ja: '日本語',
      en: 'English'
    }
  },

  en: {
    // Popup screen
    popup: {
      title: 'GitHub Editor Opener',
      loading: 'Loading...',
      openInEditor: 'Open in Editor',
      settings: 'Settings',
      openSuccess: 'Opened in {editor}',
      errorNotGitHub: 'Not a GitHub page',
      errorNotRepo: 'Not a repository page',
      errorNoBasePath: 'Base path is not configured. Please configure it in settings.',
      errorInvalidPage: 'No valid page found'
    },

    // Settings screen
    settings: {
      title: 'Settings',
      pageTitle: 'GitHub Editor Opener - Settings',
      language: 'Language',
      languageHelp: 'Select display language',
      basePath: 'Base Path',
      basePathHelp: 'Set the base path where GitHub repositories are located.<br>This assumes git management using <a href="https://github.com/x-motemen/ghq" target="_blank" rel="noopener noreferrer">ghq</a>.<br>Example: For /Users/{username}/src/github.com/, repositories should be located at /Users/{username}/src/github.com/owner/repository.',
      basePathExample: 'Example: /Users/{username}/src/github.com/',
      editorPreset: 'Editor Preset',
      editorPresetHelp: 'Choose from commonly used editors. Select "Custom Settings" to configure manually.',
      customSetting: 'Custom Settings',
      editorScheme: 'Editor URL Scheme',
      editorSchemeHelp: 'Specify the URL scheme for your editor.<br>Visual Studio Code: vscode://file<br>Other editors may also be supported.',
      editorSchemeExample: 'Example: vscode://file',
      saveSettings: 'Save Settings',
      reset: 'Reset',
      saveSuccess: 'Settings saved',
      saveError: 'Failed to save settings',
      loadError: 'Failed to load settings',
      resetError: 'Failed to reset settings',
      resetSuccess: 'Settings reset',
      resetConfirm: 'Reset settings?',
      presetError: 'Preset configuration error',
      validationErrorBasePath: 'Please enter base path',
      validationErrorScheme: 'Please enter editor URL scheme'
    },

    // Editor presets
    presets: {
      vscode: 'Visual Studio Code',
      cursor: 'Cursor',
      windsurf: 'Windsurf',
      antigravity: 'Antigravity',
      jetbrains_idea: 'IntelliJ IDEA'
    },

    // Preset types
    presetTypes: {
      gui: 'GUI',
      command: 'Command',
      toolbox: 'Toolbox'
    },

    // Language names
    languageNames: {
      ja: '日本語',
      en: 'English'
    }
  }
};

/**
 * 国際化管理クラス
 */
class I18nManager {
  constructor() {
    this.currentLanguage = LANGUAGES.JA; // デフォルトは日本語
    this.translations = TRANSLATIONS;
  }

  /**
   * 現在の言語を取得
   * @returns {string} 言語コード
   */
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  /**
   * 言語を設定
   * @param {string} language - 言語コード
   */
  setLanguage(language) {
    if (language in this.translations) {
      this.currentLanguage = language;
    }
  }

  /**
   * ブラウザ言語から自動検出
   * @returns {string} 検出された言語コード
   */
  detectBrowserLanguage() {
    if (typeof navigator !== 'undefined') {
      const lang = navigator.language || navigator.userLanguage;
      if (lang && lang.startsWith('ja')) {
        return LANGUAGES.JA;
      }
    }
    return LANGUAGES.EN;
  }

  /**
   * 翻訳文字列を取得
   * @param {string} key - 翻訳キー (例: 'popup.title')
   * @param {Object} params - プレースホルダー用パラメータ
   * @returns {string} 翻訳された文字列
   */
  t(key, params = {}) {
    const keys = key.split('.');
    let translation = this.translations[this.currentLanguage];

    // ネストしたキーをたどる
    for (const k of keys) {
      if (translation && typeof translation === 'object' && k in translation) {
        translation = translation[k];
      } else {
        // キーが見つからない場合はキー自体を返す
        return key;
      }
    }

    // プレースホルダーを置換
    if (typeof translation === 'string' && params) {
      return this._replacePlaceholders(translation, params);
    }

    return translation || key;
  }

  /**
   * プレースホルダーを置換
   * @param {string} text - 置換対象のテキスト
   * @param {Object} params - 置換パラメータ
   * @returns {string} 置換後のテキスト
   */
  _replacePlaceholders(text, params) {
    return text.replace(/\{(\w+)\}/g, (match, key) => {
      return params[key] !== undefined ? params[key] : match;
    });
  }

  /**
   * 利用可能な言語一覧を取得
   * @returns {Array} 言語一覧
   */
  getAvailableLanguages() {
    return Object.keys(this.translations).map(code => ({
      code,
      name: this.translations[code].languageNames[code] || code
    }));
  }
}

// CommonJS形式でエクスポート（テスト用）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    I18nManager,
    LANGUAGES,
    TRANSLATIONS
  };
}

// グローバル変数として定義（Chrome拡張用）
if (typeof window !== 'undefined') {
  window.I18nManager = I18nManager;
  window.LANGUAGES = LANGUAGES;
} else if (typeof global !== 'undefined') {
  global.I18nManager = I18nManager;
  global.LANGUAGES = LANGUAGES;
}
