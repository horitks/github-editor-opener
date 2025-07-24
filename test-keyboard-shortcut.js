// test-keyboard-shortcut.js - キーボードショートカット機能のテスト

/**
 * キーボードショートカット機能のテストケース
 * TDD RED フェーズ: 失敗するテストを定義
 */

const fs = require('fs');
const path = require('path');

const testCases = [
  {
    name: 'Ctrl+Shift+Kでコマンドが登録されている',
    description: 'manifest.jsonにcommands設定が含まれている',
    expected: true,
    test: () => {
      try {
        const manifestPath = path.join(__dirname, 'manifest.json');
        const manifestContent = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        return !!(manifestContent.commands && manifestContent.commands['open-editor']);
      } catch {
        return false;
      }
    }
  },
  {
    name: 'background.jsが存在する',
    description: 'Service Workerファイルが作成されている',
    expected: true,
    test: () => {
      try {
        const backgroundPath = path.join(__dirname, 'background.js');
        return fs.existsSync(backgroundPath);
      } catch {
        return false;
      }
    }
  },
  {
    name: 'GitHubページでショートカットが動作する',
    description: 'GitHub URLからリポジトリ情報を抽出できる',
    expected: 'owner/repo',
    test: (url = 'https://github.com/owner/repo') => {
      // utils.jsから実際の関数をインポートしてテスト
      try {
        const { extractRepoInfo } = require('./utils.js');
        const repoInfo = extractRepoInfo(url);
        return repoInfo ? repoInfo.fullName : null;
      } catch {
        return null;
      }
    }
  },
  {
    name: '非GitHubページで適切なエラー処理ができる',
    description: 'GitHubページでない場合の処理',
    expected: null, 
    test: (url = 'https://example.com') => {
      try {
        const { extractRepoInfo } = require('./utils.js');
        const repoInfo = extractRepoInfo(url);
        return repoInfo ? repoInfo.fullName : null;
      } catch {
        return null;
      }
    }
  },
  {
    name: 'notifications権限が設定されている',
    description: 'manifest.jsonにnotifications権限が含まれている',
    expected: true,
    test: () => {
      try {
        const manifestPath = path.join(__dirname, 'manifest.json');
        const manifestContent = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        return manifestContent.permissions && manifestContent.permissions.includes('notifications');
      } catch {
        return false;
      }
    }
  },
  {
    name: 'エディタURL構築が正しく動作する',
    description: 'buildEditorUrl関数の動作確認',
    expected: 'vscode://file/path/to/repos/owner/repo',
    test: () => {
      try {
        const { buildEditorUrl } = require('./utils.js');
        const repoInfo = { fullName: 'owner/repo' };
        const settings = {
          editorScheme: 'vscode://file',
          basePath: '/path/to/repos/',
          openInNewWindow: false
        };
        return buildEditorUrl(repoInfo, settings);
      } catch {
        return null;
      }
    }
  },
  {
    name: '設定検証が正しく動作する',
    description: 'validateSettings関数の動作確認',
    expected: false,
    test: () => {
      try {
        const { validateSettings } = require('./utils.js');
        const emptySettings = { basePath: '' };
        const validation = validateSettings(emptySettings);
        return validation.isValid;
      } catch {
        return null;
      }
    }
  }
];

/**
 * テストを実行する関数
 */
function runTests() {
  console.log('🔴 RED: キーボードショートカット機能のテスト開始\n');
  
  let allTestsPassed = true;
  let failedTests = [];
  
  for (const testCase of testCases) {
    console.log(`テスト: ${testCase.name}`);
    console.log(`  説明: ${testCase.description}`);
    
    try {
      const result = testCase.test();
      
      if (result === testCase.expected) {
        console.log(`  ✅ 成功: ${result}`);
      } else {
        console.log(`  ❌ 失敗: 期待値 "${testCase.expected}" 、実際 "${result}"`);
        allTestsPassed = false;
        failedTests.push(testCase.name);
      }
    } catch (error) {
      console.log(`  ❌ エラー: ${error.message}`);
      allTestsPassed = false;
      failedTests.push(testCase.name);
    }
    
    console.log('');
  }
  
  if (allTestsPassed) {
    console.log('🟢 全てのテストが通りました！');
    process.exit(0);
  } else {
    console.log(`🔴 ${failedTests.length}個のテストが失敗しました:`);
    failedTests.forEach(test => console.log(`  - ${test}`));
    console.log('\n次のステップ: 実装を追加してテストを通す (GREEN フェーズ)');
    process.exit(1);
  }
}

// 必要な実装チェック
function checkImplementationRequirements() {
  console.log('📋 実装要件チェック:\n');
  
  const requirements = [
    { 
      file: 'manifest.json', 
      feature: 'commands設定', 
      implemented: checkManifestCommands() 
    },
    { 
      file: 'background.js', 
      feature: 'Service Worker', 
      implemented: fs.existsSync(path.join(__dirname, 'background.js')) 
    },
    { 
      file: 'manifest.json', 
      feature: 'notifications権限', 
      implemented: checkNotificationsPermission() 
    },
    { 
      file: 'background.js', 
      feature: 'chrome.commands.onCommand', 
      implemented: checkCommandHandler() 
    },
    { 
      file: 'background.js', 
      feature: 'リポジトリ情報抽出', 
      implemented: checkRepoExtraction() 
    },
    { 
      file: 'background.js', 
      feature: 'エラーハンドリング', 
      implemented: checkErrorHandling() 
    }
  ];
  
  requirements.forEach(req => {
    const status = req.implemented ? '✅' : '❌';
    console.log(`${status} ${req.file}: ${req.feature}`);
  });
  
  const unimplemented = requirements.filter(req => !req.implemented);
  if (unimplemented.length === 0) {
    console.log('\n🎉 全ての要件が実装されています！');
  } else {
    console.log('\n🎯 未実装の機能:');
    unimplemented.forEach(req => {
      console.log(`- ${req.file}: ${req.feature}`);
    });
  }
}

function checkManifestCommands() {
  try {
    const manifestPath = path.join(__dirname, 'manifest.json');
    const manifestContent = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    return manifestContent.commands && manifestContent.commands['open-editor'];
  } catch {
    return false;
  }
}

function checkNotificationsPermission() {
  try {
    const manifestPath = path.join(__dirname, 'manifest.json');
    const manifestContent = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    return manifestContent.permissions && manifestContent.permissions.includes('notifications');
  } catch {
    return false;
  }
}

function checkCommandHandler() {
  try {
    const backgroundPath = path.join(__dirname, 'background.js');
    const backgroundContent = fs.readFileSync(backgroundPath, 'utf8');
    return backgroundContent.includes('chrome.commands.onCommand.addListener');
  } catch {
    return false;
  }
}

function checkRepoExtraction() {
  try {
    const backgroundPath = path.join(__dirname, 'background.js');
    const backgroundContent = fs.readFileSync(backgroundPath, 'utf8');
    
    // background.jsでextractRepoInfo関数が定義されているかをチェック
    return backgroundContent.includes('function extractRepoInfo');
  } catch {
    return false;
  }
}

function checkErrorHandling() {
  try {
    const backgroundPath = path.join(__dirname, 'background.js');
    const backgroundContent = fs.readFileSync(backgroundPath, 'utf8');
    return backgroundContent.includes('showNotification') && backgroundContent.includes('try') && backgroundContent.includes('catch');
  } catch {
    return false;
  }
}

// テスト実行
if (require.main === module) {
  checkImplementationRequirements();
  console.log('\n' + '='.repeat(50) + '\n');
  runTests();
}

module.exports = { testCases, runTests };