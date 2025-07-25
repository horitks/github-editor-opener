// editor-presets.js - エディタプリセット管理機能

/**
 * プラットフォーム定数
 */
const PLATFORMS = {
  DARWIN: 'darwin',
  WIN32: 'win32',
  LINUX: 'linux',
  UNKNOWN: 'unknown'
};

/**
 * プリセットタイプ定数
 */
const PRESET_TYPES = {
  GUI: 'gui',
  COMMAND: 'command',
  TOOLBOX: 'toolbox',
  TERMINAL: 'terminal',
  TERMINAL_EDITOR: 'terminal_editor'
};

/**
 * サポート状況定数
 */
const SUPPORT_STATUS = {
  SUPPORTED: true,
  UNCONFIRMED: 'unconfirmed',
  COMMAND_LINE: 'command_line',
  TOOLBOX_REQUIRED: 'toolbox_required'
};

/**
 * エディタプリセット管理クラス
 */
class EditorPresetManager {
  constructor() {
    // プリセット定義
    this.presets = {
      vscode: {
        name: 'Visual Studio Code',
        scheme: 'vscode://file',
        type: PRESET_TYPES.GUI,
        supported: SUPPORT_STATUS.SUPPORTED
      },
      cursor: {
        name: 'Cursor',
        scheme: 'cursor://file',
        type: PRESET_TYPES.GUI,
        supported: SUPPORT_STATUS.UNCONFIRMED
      },
      windsurf: {
        name: 'Windsurf',
        command: 'windsurf {path}',
        type: PRESET_TYPES.COMMAND,
        supported: SUPPORT_STATUS.COMMAND_LINE
      },
      jetbrains_idea: {
        name: 'IntelliJ IDEA',
        scheme: 'jetbrains://idea/navigate/reference?project={path}',
        type: PRESET_TYPES.TOOLBOX,
        supported: SUPPORT_STATUS.TOOLBOX_REQUIRED
      },
      terminal_mac: {
        name: 'Terminal (macOS)',
        command: 'osascript -e \'tell application "Terminal" to do script "cd {path}"\'',
        type: PRESET_TYPES.TERMINAL,
        platform: PLATFORMS.DARWIN
      },
      iterm2: {
        name: 'iTerm2',
        command: 'osascript -e \'tell application "iTerm" to create window with default profile command "cd {path}"\'',
        type: PRESET_TYPES.TERMINAL,
        platform: PLATFORMS.DARWIN
      },
      nvim_terminal: {
        name: 'Neovim in Terminal',
        command: 'osascript -e \'tell application "Terminal" to do script "cd {path} && nvim ."\'',
        type: PRESET_TYPES.TERMINAL_EDITOR,
        platform: PLATFORMS.DARWIN
      }
    };
  }

  /**
   * 指定されたプリセットを取得する
   * @param {string} presetId - プリセットID
   * @returns {Object} プリセット情報
   */
  getPreset(presetId) {
    const preset = this.presets[presetId];
    if (!preset) {
      throw new Error(`無効なプリセットID: ${presetId}`);
    }
    return preset;
  }

  /**
   * 利用可能なプリセット一覧を取得する
   * @returns {Array} プリセット一覧
   */
  getAvailablePresets() {
    return Object.keys(this.presets).map(id => ({
      id,
      ...this.presets[id]
    }));
  }

  /**
   * 現在のプラットフォーム向けのプリセットを取得する
   * @returns {Array} プラットフォーム向けプリセット
   */
  getPresetsForCurrentPlatform() {
    const platform = this._getCurrentPlatform();
    return this.getAvailablePresets().filter(preset => {
      // プラットフォーム指定がないか、現在のプラットフォームと一致する
      return !preset.platform || preset.platform === platform;
    });
  }

  /**
   * プリセットからエディタURLを構築する
   * @param {string} presetId - プリセットID
   * @param {Object} repoInfo - リポジトリ情報
   * @param {Object} settings - 設定
   * @returns {string} エディタURL
   */
  buildEditorUrl(presetId, repoInfo, settings) {
    const preset = this.getPreset(presetId);
    
    if (!preset.scheme) {
      throw new Error(`プリセット ${presetId} はURL schemeをサポートしていません`);
    }

    const fullPath = `${settings.basePath}${repoInfo.fullName}`;
    return `${preset.scheme}${fullPath}`;
  }

  /**
   * プリセットからコマンドを構築する
   * @param {string} presetId - プリセットID
   * @param {Object} repoInfo - リポジトリ情報
   * @param {Object} settings - 設定
   * @returns {string} コマンド
   */
  buildCommand(presetId, repoInfo, settings) {
    const preset = this.getPreset(presetId);
    
    if (!preset.command) {
      throw new Error(`プリセット ${presetId} はコマンド実行をサポートしていません`);
    }

    const fullPath = `${settings.basePath}${repoInfo.fullName}`;
    return preset.command.replace('{path}', fullPath);
  }

  /**
   * 現在のプラットフォームを取得する
   * @returns {string} プラットフォーム名
   */
  _getCurrentPlatform() {
    // Chrome拡張環境では navigator.platform を使用
    if (typeof navigator !== 'undefined') {
      return this._detectPlatformFromNavigator(navigator.platform);
    }
    
    // Node.js環境では process.platform を使用
    if (typeof process !== 'undefined') {
      return process.platform;
    }
    
    return PLATFORMS.UNKNOWN;
  }

  /**
   * navigator.platformからプラットフォームを検出する
   * @param {string} navigatorPlatform - navigator.platform の値
   * @returns {string} プラットフォーム名
   */
  _detectPlatformFromNavigator(navigatorPlatform) {
    const platform = navigatorPlatform.toLowerCase();
    if (platform.includes('mac')) return PLATFORMS.DARWIN;
    if (platform.includes('win')) return PLATFORMS.WIN32;
    if (platform.includes('linux')) return PLATFORMS.LINUX;
    return PLATFORMS.UNKNOWN;
  }
}

// CommonJS形式でエクスポート（テスト用）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    EditorPresetManager,
    PLATFORMS,
    PRESET_TYPES,
    SUPPORT_STATUS
  };
}

// グローバル変数として定義（Chrome拡張用）
if (typeof window !== 'undefined') {
  window.EditorPresetManager = EditorPresetManager;
} else if (typeof global !== 'undefined') {
  global.EditorPresetManager = EditorPresetManager;
}