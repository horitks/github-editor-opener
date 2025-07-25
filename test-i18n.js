// test-i18n.js - 国際化機能のテスト

// Node.js環境でi18nマネージャーを読み込み
if (typeof require !== 'undefined') {
  const { I18nManager } = require('./i18n.js');
  global.I18nManager = I18nManager;
}

/**
 * テスト結果を表示する関数
 */
function logTestResult(testName, passed, error = null) {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status}: ${testName}`);
  if (error) {
    console.log(`  Error: ${error.message}`);
  }
}

/**
 * テスト: I18nManagerが存在する
 */
function testI18nManagerが存在する() {
  try {
    const i18n = new I18nManager();
    logTestResult('I18nManagerが存在する', true);
  } catch (error) {
    logTestResult('I18nManagerが存在する', false, error);
  }
}

/**
 * テスト: デフォルト言語が日本語
 */
function testデフォルト言語が日本語() {
  try {
    const i18n = new I18nManager();
    const passed = i18n.getCurrentLanguage() === 'ja';
    logTestResult('デフォルト言語が日本語', passed);
  } catch (error) {
    logTestResult('デフォルト言語が日本語', false, error);
  }
}

/**
 * テスト: 日本語メッセージを取得できる
 */
function test日本語メッセージを取得できる() {
  try {
    const i18n = new I18nManager();
    const message = i18n.t('settings.title');
    const passed = message === '設定';
    logTestResult('日本語メッセージを取得できる', passed);
    if (!passed) {
      console.log(`  Expected: 設定, Actual: ${message}`);
    }
  } catch (error) {
    logTestResult('日本語メッセージを取得できる', false, error);
  }
}

/**
 * テスト: 英語に言語切り替えできる
 */
function test英語に言語切り替えできる() {
  try {
    const i18n = new I18nManager();
    i18n.setLanguage('en');
    const passed = i18n.getCurrentLanguage() === 'en';
    logTestResult('英語に言語切り替えできる', passed);
  } catch (error) {
    logTestResult('英語に言語切り替えできる', false, error);
  }
}

/**
 * テスト: 英語メッセージを取得できる
 */
function test英語メッセージを取得できる() {
  try {
    const i18n = new I18nManager();
    i18n.setLanguage('en');
    const message = i18n.t('settings.title');
    const passed = message === 'Settings';
    logTestResult('英語メッセージを取得できる', passed);
    if (!passed) {
      console.log(`  Expected: Settings, Actual: ${message}`);
    }
  } catch (error) {
    logTestResult('英語メッセージを取得できる', false, error);
  }
}

/**
 * テスト: 存在しないキーでフォールバック
 */
function test存在しないキーでフォールバック() {
  try {
    const i18n = new I18nManager();
    const message = i18n.t('nonexistent.key');
    const passed = message === 'nonexistent.key';
    logTestResult('存在しないキーでフォールバック', passed);
  } catch (error) {
    logTestResult('存在しないキーでフォールバック', false, error);
  }
}

/**
 * テスト: プレースホルダー置換が動作する
 */
function testプレースホルダー置換が動作する() {
  try {
    const i18n = new I18nManager();
    const message = i18n.t('popup.openSuccess', { editor: 'VSCode' });
    const passed = message.includes('VSCode');
    logTestResult('プレースホルダー置換が動作する', passed);
  } catch (error) {
    logTestResult('プレースホルダー置換が動作する', false, error);
  }
}

/**
 * テスト: 利用可能言語一覧を取得できる
 */
function test利用可能言語一覧を取得できる() {
  try {
    const i18n = new I18nManager();
    const languages = i18n.getAvailableLanguages();
    const passed = Array.isArray(languages) && 
                  languages.length === 2 &&
                  languages.some(lang => lang.code === 'ja') &&
                  languages.some(lang => lang.code === 'en');
    logTestResult('利用可能言語一覧を取得できる', passed);
    if (!passed) {
      console.log(`  Languages: ${JSON.stringify(languages)}`);
    }
  } catch (error) {
    logTestResult('利用可能言語一覧を取得できる', false, error);
  }
}

/**
 * テスト: ブラウザ言語検出が動作する
 */
function testブラウザ言語検出が動作する() {
  try {
    const i18n = new I18nManager();
    const detectedLang = i18n.detectBrowserLanguage();
    const passed = detectedLang === 'ja' || detectedLang === 'en';
    logTestResult('ブラウザ言語検出が動作する', passed);
    if (!passed) {
      console.log(`  Detected: ${detectedLang}`);
    }
  } catch (error) {
    logTestResult('ブラウザ言語検出が動作する', false, error);
  }
}

/**
 * すべてのテストを実行する
 */
function runAllTests() {
  console.log('=== 国際化機能テスト開始 ===');
  
  testI18nManagerが存在する();
  testデフォルト言語が日本語();
  test日本語メッセージを取得できる();
  test英語に言語切り替えできる();
  test英語メッセージを取得できる();
  test存在しないキーでフォールバック();
  testプレースホルダー置換が動作する();
  test利用可能言語一覧を取得できる();
  testブラウザ言語検出が動作する();
  
  console.log('=== テスト終了 ===');
}

// DOM読み込み後にテスト実行
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', runAllTests);
} else {
  // Node.js環境の場合
  runAllTests();
}