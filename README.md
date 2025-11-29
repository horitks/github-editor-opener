# GitHub Editor Opener

[English](#english) | [日本語](#japanese)

---

## English

A Chrome extension that allows you to open GitHub repositories in your local editor directly from GitHub repository pages.

### Features

- Open extension popup from GitHub repository pages
- Combine configured base path with repository name to open in local editor
- Configure base path and editor URL scheme in settings page
- **Editor presets**: Quick setup for popular editors (VS Code, Cursor, Windsurf, Antigravity, IntelliJ IDEA)
- **Multi-language support**: Switch between Japanese and English in settings
- **Keyboard shortcut support**: Use `Ctrl+Shift+K` (Windows/Linux) or `Command+Shift+K` (Mac) to quickly open repository in editor

### Installation

1. Open Chrome's extension management page (chrome://extensions/)
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select this repository folder

### Usage

#### Initial Setup

1. After installing the extension, click the extension icon on any GitHub page
2. Click the "Settings" button to open the settings page
3. Configure the following settings:
   - **Language**: Choose between Japanese (日本語) and English for the interface
   - **Base Path**: Local base path where repositories are located (e.g., `/Users/{username}/src/github.com/`)
   - **Editor Preset**: Select from pre-configured popular editors or choose "Custom Settings"
   - **Editor URL Scheme**: URL scheme for your editor (e.g., `vscode://file`) - auto-filled when using presets

#### Opening a Repository

**Method 1: Using the Extension Icon**
1. Open a GitHub repository page
2. Click the extension icon
3. Click "Open in Editor" button
4. The local repository will open in your configured editor

**Method 2: Using Keyboard Shortcut**
1. Open a GitHub repository page
2. Press `Ctrl+Shift+K` (Windows/Linux) or `Command+Shift+K` (Mac)
3. The local repository will open directly in your configured editor

### Configuration Example

- **Base Path**: `/Users/{username}/src/github.com/`
- **Editor URL Scheme**: `vscode://file`
- **GitHub URL**: `https://github.com/{username}/github-editor-opener`

With the above configuration, when opening `https://github.com/{username}/github-editor-opener`,
`vscode://file/Users/{username}/src/github.com/{username}/github-editor-opener` will be executed.

### Required Permissions

- `activeTab`: To get the URL of the currently active tab
- `storage`: To save settings
- `https://github.com/*`: To work only on GitHub pages

### Development

#### Tech Stack

- Manifest V3
- HTML/CSS/JavaScript
- Chrome Extensions API

#### File Structure

```
├── manifest.json          # Extension configuration file
├── popup.html             # Popup HTML
├── popup.js               # Popup JavaScript
├── settings.html          # Settings page HTML
├── settings.js            # Settings page JavaScript
├── editor-presets.js      # Editor preset management
├── i18n.js                # Internationalization system
├── background.js          # Background service worker
├── test-*.js              # Test files
├── icons/                 # Icon files
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md              # This file
```

#### Supported Editor Presets

| Editor | Type | Status |
|--------|------|--------|
| Visual Studio Code | GUI | ✅ Supported |
| Cursor | GUI | ⚠️ Unconfirmed |
| Windsurf | Command | 🔧 Command Line |
| Antigravity | GUI | ✅ Supported |
| IntelliJ IDEA | Toolbox | 🛠️ Toolbox Required |

#### Language Support

- **🇺🇸 English**: Full support
- **🇯🇵 Japanese (日本語)**: Full support (Default)


---

## Japanese

GitHub のリポジトリページから、ローカルエディタでリポジトリを開くことができる Chrome 拡張機能です。

### 機能

- GitHub のリポジトリページで拡張機能のポップアップを開く
- 設定したベースパスとリポジトリ名を組み合わせて、ローカルのエディタで開く
- 設定画面でベースパスとエディタの URL スキームを設定可能
- **エディタプリセット**: 人気エディタ（VS Code、Cursor、Windsurf、Antigravity、IntelliJ IDEA）の素早い設定
- **多言語対応**: 設定画面で日本語と英語を切り替え可能
- **キーボードショートカット対応**: `Ctrl+Shift+K`（Windows/Linux）または `Command+Shift+K`（Mac）でリポジトリを素早くエディタで開く

### インストール方法

1. Chrome の拡張機能設定画面を開く（chrome://extensions/）
2. 「デベロッパーモード」を有効にする
3. 「パッケージ化されていない拡張機能を読み込む」をクリック
4. このリポジトリのフォルダを選択

### 使用方法

#### 初期設定

1. 拡張機能をインストール後、任意の GitHub ページで拡張機能のアイコンをクリック
2. 「設定」ボタンをクリックして設定画面を開く
3. 以下の設定を行う：
   - **言語**: インターフェース言語を日本語または English から選択
   - **ベースパス**: リポジトリが配置されているローカルのベースパス（例: `/Users/{username}/src/github.com/`）
   - **エディタプリセット**: 事前設定された人気エディタから選択、または「カスタム設定」を選択
   - **エディタ URL スキーム**: 使用するエディタの URL スキーム（例: `vscode://file`）- プリセット使用時は自動入力

#### リポジトリを開く

**方法1: 拡張機能のアイコンを使用**
1. GitHub のリポジトリページを開く
2. 拡張機能のアイコンをクリック
3. 「エディタで開く」ボタンをクリック
4. 設定されたエディタでローカルのリポジトリが開かれる

**方法2: キーボードショートカットを使用**
1. GitHub のリポジトリページを開く
2. `Ctrl+Shift+K`（Windows/Linux）または `Command+Shift+K`（Mac）を押す
3. 設定されたエディタでローカルのリポジトリが直接開かれる

### 設定例

- **ベースパス**: `/Users/{username}/src/github.com/`
- **エディタ URL スキーム**: `vscode://file`
- **GitHub URL**: `https://github.com/{username}/github-editor-opener`

上記の設定で `https://github.com/{username}/github-editor-opener` を開いている場合、
`vscode://file/Users/{username}/src/github.com/{username}/github-editor-opener` が実行されます。

### 必要な権限

- `activeTab`: 現在開いているタブの URL を取得するため
- `storage`: 設定を保存するため
- `https://github.com/*`: GitHub のページでのみ動作するため

### 開発

#### 技術スタック

- Manifest V3
- HTML/CSS/JavaScript
- Chrome Extensions API

#### ファイル構成

```
├── manifest.json          # 拡張機能の設定ファイル
├── popup.html             # ポップアップの HTML
├── popup.js               # ポップアップの JavaScript
├── settings.html          # 設定画面の HTML
├── settings.js            # 設定画面の JavaScript
├── editor-presets.js      # エディタプリセット管理
├── i18n.js                # 国際化システム
├── background.js          # バックグラウンドサービスワーカー
├── test-*.js              # テストファイル
├── icons/                 # アイコンファイル
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md              # このファイル
```

#### 対応エディタプリセット

| エディタ | タイプ | 状況 |
|---------|--------|------|
| Visual Studio Code | GUI | ✅ サポート済み |
| Cursor | GUI | ⚠️ 未確認 |
| Windsurf | コマンド | 🔧 コマンドライン |
| Antigravity | GUI | ✅ サポート済み |
| IntelliJ IDEA | Toolbox | 🛠️ Toolbox必須 |

#### 言語サポート

- **🇯🇵 日本語**: 完全対応（デフォルト）
- **🇺🇸 English**: 完全対応

