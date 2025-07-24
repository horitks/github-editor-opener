# GitHub Editor Opener

[English](#english) | [日本語](#japanese)

---

## English

A Chrome extension that allows you to open GitHub repositories in your local editor directly from GitHub repository pages.

### Features

- Open extension popup from GitHub repository pages
- Combine configured base path with repository name to open in local editor
- Configure base path and editor URL scheme in settings page

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
   - **Base Path**: Local base path where repositories are located (e.g., `/Users/{username}/src/github.com/`)
   - **Editor URL Scheme**: URL scheme for your editor (e.g., `vscode://file`)

#### Opening a Repository

1. Open a GitHub repository page
2. Click the extension icon
3. Click "Open in Editor" button
4. The local repository will open in your configured editor

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
├── icons/                 # Icon files
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md              # This file
```

### Icons

The extension icons are original designs created specifically for this project, featuring:
- GitHub-inspired design elements
- Code editor representation with syntax highlighting
- Arrow showing the connection flow from GitHub to local editor
- Available in multiple sizes (16px, 32px, 48px, 128px)

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Japanese

GitHub のリポジトリページから、ローカルエディタでリポジトリを開くことができる Chrome 拡張機能です。

### 機能

- GitHub のリポジトリページで拡張機能のポップアップを開く
- 設定したベースパスとリポジトリ名を組み合わせて、ローカルのエディタで開く
- 設定画面でベースパスとエディタの URL スキームを設定可能

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
   - **ベースパス**: リポジトリが配置されているローカルのベースパス（例: `/Users/{username}/src/github.com/`）
   - **エディタ URL スキーム**: 使用するエディタの URL スキーム（例: `vscode://file`）

#### リポジトリを開く

1. GitHub のリポジトリページを開く
2. 拡張機能のアイコンをクリック
3. 「エディタで開く」ボタンをクリック
4. 設定されたエディタでローカルのリポジトリが開かれる

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
├── icons/                 # アイコンファイル
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md              # このファイル
```

### アイコン

拡張機能のアイコンは、このプロジェクト専用に作成されたオリジナルデザインです：
- GitHubにインスパイアされたデザイン要素
- シンタックスハイライト付きのコードエディタ表現
- GitHubからローカルエディタへの接続フローを示す矢印
- 複数サイズに対応（16px、32px、48px、128px）

### ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。詳細は [LICENSE](LICENSE) ファイルを参照してください。