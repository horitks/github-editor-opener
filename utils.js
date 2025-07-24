// utils.js - 共通ユーティリティ関数

/**
 * エディタURL構築の設定定数
 */
const EDITOR_CONFIG = {
  DEFAULT_SCHEME: 'vscode://file',
  VSCODE_NEW_WINDOW_PARAM: 'windowId=_blank',
  SUPPORTED_EDITORS: {
    vscode: 'vscode://file',
    cursor: 'cursor://file',
    sublime: 'subl://open?url=file://'
  }
};

/**
 * GitHub URL からリポジトリ情報を抽出する
 * @param {string} url - GitHub URL
 * @returns {Object|null} リポジトリ情報 または null
 */
function extractRepoInfo(url) {
  try {
    const urlObj = new URL(url);
    
    if (!urlObj.hostname.includes('github.com')) {
      return null;
    }
    
    const pathParts = urlObj.pathname.split('/').filter(part => part);
    
    if (pathParts.length < 2) {
      return null;
    }
    
    return {
      owner: pathParts[0],
      repo: pathParts[1],
      fullName: `${pathParts[0]}/${pathParts[1]}`
    };
  } catch {
    return null;
  }
}

/**
 * エディタURL を構築する
 * @param {Object} repoInfo - リポジトリ情報
 * @param {Object} settings - 設定
 * @returns {string} エディタURL
 */
function buildEditorUrl(repoInfo, settings) {
  const { editorScheme = EDITOR_CONFIG.DEFAULT_SCHEME, basePath = '', openInNewWindow = false } = settings;
  
  let editorUrl = `${editorScheme}${basePath}${repoInfo.fullName}`;
  
  // VSCodeの場合、新しいウィンドウで開くオプションがあれば追加
  if (editorScheme.startsWith('vscode://') && openInNewWindow) {
    const separator = editorUrl.includes('?') ? '&' : '?';
    editorUrl += `${separator}${EDITOR_CONFIG.VSCODE_NEW_WINDOW_PARAM}`;
  }
  
  return editorUrl;
}

/**
 * 設定を検証する
 * @param {Object} settings - 設定
 * @returns {Object} 検証結果 { isValid: boolean, error?: string }
 */
function validateSettings(settings) {
  if (!settings.basePath) {
    return {
      isValid: false,
      error: 'ベースパスが設定されていません。設定から設定してください。'
    };
  }
  
  return { isValid: true };
}

// CommonJS形式でエクスポート（Chrome拡張用）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    EDITOR_CONFIG,
    extractRepoInfo,
    buildEditorUrl,
    validateSettings
  };
}

// グローバル関数として定義（Chrome拡張のコンテキストでは必要）
if (typeof window !== 'undefined') {
  window.EditorUtils = {
    EDITOR_CONFIG,
    extractRepoInfo,
    buildEditorUrl,
    validateSettings
  };
}