## 開発環境
本プロジェクトの開発環境は、主に以下を使用しています。
- ファイル管理 : Github
  - リポジトリ : https://github.com/kourakukibun/bsmo.git
- Node.js : バージョン10.15.0
- パッケージマネージャー : Yarn
- タスクマネージャー : gulp
- HTMLプリプロセッサ : pug
- CSSプリプロセッサ : Sass

# 開発環境導入手順
基本的に、Node.jsとYarnがインストールされていれば開発環境は準備できます。  

## 0-1: できればGitが使用可能な環境に
GitもしくはGit管理ツール（SourceTree等）をインストールして使用可能な環境があった方がよろしいかと思います。
- Git [https://git-scm.com/]

<span style="color: yellow">※インストール後にコマンドプロンプト/PowerShell/ターミナルの再起動が必要です。</span>

Gitを使用する場合は、インストール後にコマンドプロンプト/PowerShell/ターミナルで、以下のコマンドを入力してください。

`git --version`  

`git version 2.22.0` といったバージョン情報が表示されればGitのインストールは完了です。

Git管理ツールを使用する場合は、それぞれのツールの操作方法をご確認ください。

なお、ファイル管理はGithubを使用していますので、Githubのアカウントも作成をお願いします（無い場合は）。
- Github [https://github.com/]

## 0-2: おすすめエディタ
エディタはVSCode [https://azure.microsoft.com/ja-jp/products/visual-studio-code/] をおすすめします。Gitにも対応しており、VSCodeのターミナルを使用すれば初期位置が開いたプロジェクトの場所になるので便利です。またプラグインも豊富なので、自分好みのエディタにカスタマイズ可能です。

## 1: Node.jsをバージョン管理ツールでインストール
Node.jsはバージョン管理ツールにてバージョン10.15.0をインストールし使用することをお勧めします。インストールについては下記をご参照ください。
- Windows : Nodist [https://github.com/nullivex/nodist/releases]
  - 参考 [https://qiita.com/satoyan419/items/56e0b5f35912b9374305]
- Mac : nodenv
  - 参考 [https://qiita.com/kyosuke5_20/items/eece817eb283fc9d214f]

<span style="color: yellow">※インストール後にコマンドプロンプト/ターミナルの再起動が必要です。</span>

## 2: Yarnのインストール
Yarnは以下公式ページよりダウンロードしてインストールできます。
- Windows [https://classic.yarnpkg.com/ja/docs/install#windows-stable]
- Mac [https://classic.yarnpkg.com/ja/docs/install#mac-stable]

<span style="color: yellow">※インストール後にコマンドプロンプト/ターミナルの再起動が必要です。</span>

## 3: Githubよりリポジトリをクローン、もしくはダウンロード

コマンドでクローンする場合は、コマンドプロンプト/ターミナルから任意のディレクトリへ移動し  
`git clone https://github.com/kourakukibun/bsmo.git`  
を実行してください。  
以後、以下コマンドでPullしていただければ最新状態を確認できます。  
`git pull origin master`

## 4: Yarnにより必要なパッケージをインストール
<span style="color: yellow">※基本、クローン後一度だけ実行すればOKです。</span>

コマンドプロンプト/ターミナルでクローンもしくはダウンロードしたディレクトリへ移動し  
`yarn install`  
を実行してください。必要なパッケージがインストールされます。

## 5: Yarnでgulpを実行
<span style="color: yellow">※開発環境確認時に都度実行します。</span>

コマンドプロンプト/ターミナルで  
`yarn gulp`  
を実行してください。ブラウザが起動して作成中のサイトを確認できます。
