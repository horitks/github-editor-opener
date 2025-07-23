# GitHub GHQ Opener

GitHub のリポジトリページから、ローカルエディタでリポジトリを開くことができる Chrome 拡張機能です。

## 機能

- GitHub のリポジトリページで拡張機能のポップアップを開く
- 設定したベースパスとリポジトリ名を組み合わせて、ローカルのエディタで開く
- 設定画面でベースパスとエディタの URL スキームを設定可能

## インストール方法

1. Chrome の拡張機能設定画面を開く（chrome://extensions/）
2. 「デベロッパーモード」を有効にする
3. 「パッケージ化されていない拡張機能を読み込む」をクリック
4. このリポジトリのフォルダを選択

## 使用方法

### 初期設定

1. 拡張機能をインストール後、任意の GitHub ページで拡張機能のアイコンをクリック
2. 「設定」ボタンをクリックして設定画面を開く
3. 以下の設定を行う：
   - **ベースパス**: リポジトリが配置されているローカルのベースパス（例: `/Users/username/src/github.com/`）
   - **エディタ URL スキーム**: 使用するエディタの URL スキーム（例: `vscode://file`）

### リポジトリを開く

1. GitHub のリポジトリページを開く
2. 拡張機能のアイコンをクリック
3. 「エディタで開く」ボタンをクリック
4. 設定されたエディタでローカルのリポジトリが開かれる

## 設定例

- **ベースパス**: `/Users/thori/src/github.com/`
- **エディタ URL スキーム**: `vscode://file`
- **GitHub URL**: `https://github.com/horitks/github-ghq-opener`

上記の設定で `https://github.com/horitks/github-ghq-opener` を開いている場合、  
`vscode://file/Users/thori/src/github.com/horitks/github-ghq-opener` が実行されます。

## 必要な権限

- `activeTab`: 現在開いているタブの URL を取得するため
- `storage`: 設定を保存するため
- `https://github.com/*`: GitHub のページでのみ動作するため

## 開発

### 技術スタック

- Manifest V3
- HTML/CSS/JavaScript
- Chrome Extensions API

### ファイル構成

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