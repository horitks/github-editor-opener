// test-editor-presets.js - エディタプリセット機能のテスト

// Node.js環境でプリセットマネージャーを読み込み
if (typeof require !== 'undefined') {
  const { EditorPresetManager } = require('./editor-presets.js');
  global.EditorPresetManager = EditorPresetManager;
}

/**
 * テスト用のモックデータ
 */
const testRepoInfo = {
  owner: 'testuser',
  repo: 'test-repo',
  fullName: 'testuser/test-repo'
};

const testBasePath = '/Users/test/src/github.com/';

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
 * テスト: エディタプリセットマネージャが存在する
 */
function testエディタプリセットマネージャが存在する() {
  try {
    const presetManager = new EditorPresetManager();
    logTestResult('エディタプリセットマネージャが存在する', true);
  } catch (error) {
    logTestResult('エディタプリセットマネージャが存在する', false, error);
  }
}

/**
 * テスト: VSCodeプリセットを取得できる
 */
function testVSCodeプリセットを取得できる() {
  try {
    const presetManager = new EditorPresetManager();
    const preset = presetManager.getPreset('vscode');
    
    const expected = {
      name: 'Visual Studio Code',
      scheme: 'vscode://file',
      type: 'gui',
      supported: true
    };
    
    const passed = preset && 
                  preset.name === expected.name &&
                  preset.scheme === expected.scheme &&
                  preset.type === expected.type &&
                  preset.supported === expected.supported;
    
    logTestResult('VSCodeプリセットを取得できる', passed);
  } catch (error) {
    logTestResult('VSCodeプリセットを取得できる', false, error);
  }
}

/**
 * テスト: 利用可能なプリセット一覧を取得できる
 */
function test利用可能なプリセット一覧を取得できる() {
  try {
    const presetManager = new EditorPresetManager();
    const presets = presetManager.getAvailablePresets();
    
    const passed = Array.isArray(presets) && presets.length > 0;
    logTestResult('利用可能なプリセット一覧を取得できる', passed);
  } catch (error) {
    logTestResult('利用可能なプリセット一覧を取得できる', false, error);
  }
}

/**
 * テスト: プリセットからエディタURLを構築できる
 */
function testプリセットからエディタURLを構築できる() {
  try {
    const presetManager = new EditorPresetManager();
    const url = presetManager.buildEditorUrl('vscode', testRepoInfo, { basePath: testBasePath });
    
    const expected = 'vscode://file/Users/test/src/github.com/testuser/test-repo';
    const passed = url === expected;
    
    logTestResult('プリセットからエディタURLを構築できる', passed);
    if (!passed) {
      console.log(`  Expected: ${expected}`);
      console.log(`  Actual: ${url}`);
    }
  } catch (error) {
    logTestResult('プリセットからエディタURLを構築できる', false, error);
  }
}

/**
 * テスト: Windsurfプリセットでコマンドを構築できる
 */
function testWindsurfプリセットでコマンドを構築できる() {
  try {
    const presetManager = new EditorPresetManager();
    const command = presetManager.buildCommand('windsurf', testRepoInfo, { basePath: testBasePath });
    
    const expectedPath = '/Users/test/src/github.com/testuser/test-repo';
    const passed = command && command.includes(expectedPath);
    
    logTestResult('Windsurfプリセットでコマンドを構築できる', passed);
    if (!passed) {
      console.log(`  Command: ${command}`);
    }
  } catch (error) {
    logTestResult('Windsurfプリセットでコマンドを構築できる', false, error);
  }
}

/**
 * テスト: Terminal系プリセットが無効化されている
 */
function testTerminal系プリセットが無効化されている() {
  try {
    const presetManager = new EditorPresetManager();
    let errorOccurred = false;
    
    try {
      presetManager.getPreset('terminal_mac');
    } catch (error) {
      errorOccurred = true;
    }
    
    logTestResult('Terminal系プリセットが無効化されている', errorOccurred);
  } catch (error) {
    logTestResult('Terminal系プリセットが無効化されている', false, error);
  }
}

/**
 * テスト: 現在のOS向けプリセットのみを取得できる
 */
function test現在のOS向けプリセットのみを取得できる() {
  try {
    const presetManager = new EditorPresetManager();
    const presets = presetManager.getPresetsForCurrentPlatform();
    
    const passed = Array.isArray(presets) && presets.length > 0;
    logTestResult('現在のOS向けプリセットのみを取得できる', passed);
  } catch (error) {
    logTestResult('現在のOS向けプリセットのみを取得できる', false, error);
  }
}

/**
 * テスト: 無効なプリセットIDでエラーが発生する
 */
function test無効なプリセットIDでエラーが発生する() {
  try {
    const presetManager = new EditorPresetManager();
    let errorOccurred = false;
    
    try {
      presetManager.getPreset('invalid_preset');
    } catch (error) {
      errorOccurred = true;
    }
    
    logTestResult('無効なプリセットIDでエラーが発生する', errorOccurred);
  } catch (error) {
    logTestResult('無効なプリセットIDでエラーが発生する', false, error);
  }
}

/**
 * すべてのテストを実行する
 */
function runAllTests() {
  console.log('=== エディタプリセット機能テスト開始 ===');
  
  testエディタプリセットマネージャが存在する();
  testVSCodeプリセットを取得できる();
  test利用可能なプリセット一覧を取得できる();
  testプリセットからエディタURLを構築できる();
  testWindsurfプリセットでコマンドを構築できる();
  testTerminal系プリセットが無効化されている();
  test現在のOS向けプリセットのみを取得できる();
  test無効なプリセットIDでエラーが発生する();
  
  console.log('=== テスト終了 ===');
}

// DOM読み込み後にテスト実行
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', runAllTests);
} else {
  // Node.js環境の場合
  runAllTests();
}