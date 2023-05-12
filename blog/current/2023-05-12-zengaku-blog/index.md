---
title: 筑波大学の全学計算機でブログを書く
authors: [bonychops]
tags: ["GitHub Actions", "CI/CD", "筑波大学"]
---

筑波大学の全学計算機でブログを書く方法を www.u.tsukuba.ac.jp で限定公開していましたが，せっかくなので公開しようと思います．内容は Hugo で書いたものなので，ほぼコピペです(一部文言を変えていますが，内容としてはほぼ同じです)．

<!--truncate-->

## 概要

ここで紹介する方法は，直接 HTML を書いたり，最終的に静的な HTML が生成されるツールを用いる時に使えます．具体的には以下のツールを使う際におすすめです．

- React
- Gatsby
- Docusaurus
- Hugo

www.u.tsukuba.ac.jp でホストしている自身のブログのソースは GitHub で管理しており，デプロイは贅沢にも GitHub Actions でしています．Actions から u.tsukuba.ac.jp に SSH を用いた rsync で無理やり転送しています．ノウハウは参考になるかもしれないので，書いておきます．  
![github-to-tsukuba](github-to-tsukuba.png)

:::info
ここの内容は実際に www.u.tsukuba.ac.jp の自身のブログで公開しているものです．
:::

## 具体的な手順

今回は Hugo でブログを作成してみました．

1. Hugo プロジェクトの作成
   ```shell
    hugo new site tsukuba-blog -f yml
    cd tsukuba-blog
    git init
    # 今回はPaperMod themeを使う
    git submodule add https://github.com/adityatelange/hugo-PaperMod themes/PaperMod --depth=1
   ```
1. `config.yml`を書き換える．[PaperMod 公式サイトの Sample `config.yml`](https://adityatelange.github.io/hugo-PaperMod/posts/papermod/papermod-installation/#sample-configyml)を参考に．
   :::caution
   `baseURL`を`https://www.u.tsukuba.ac.jp/~ユーザー名/`にするのを忘れずに！
   :::
1. `hugo server`でちゃんと表示されるかを確認する．(`http://localhost:1313`)
1. `hugo new posts/hello.md`で，何か記事を書いてみる．
1. WEB コンテンツの公開申請をする．申請は[Web コンテンツの公開申請 | 全学計算機システム](https://www.u.tsukuba.ac.jp/publishing/#application)をみてください．
1. 以降はデプロイの設定です．GitHub Actions で使うフローを構成する

   - 忘れないうちに`.gitignore`を設定しておきましょう．

   ```.gitignore title=.gitignore
   # Generated files by hugo
   /public/
   /resources/_gen/
   /assets/jsconfig.json
   hugo_stats.json

   # Executable may be added to repository
   hugo.exe
   hugo.darwin
   hugo.linux

   # Temporary lock file while building
   /.hugo_build.lock

   ```

   - `.github/workflows/deploy.yml`を書く

   ```yaml title=.github/workflows/deploy.yml
   name: Deploy

   on:
   push:
       branches:
       - main # Set a branch name to trigger deployment

   jobs:
   deploy:
       runs-on: ubuntu-22.04
       steps:
       - uses: actions/checkout@v3
           with:
           submodules: true # Fetch Hugo themes (true OR recursive)
           fetch-depth: 0 # Fetch all history for .GitInfo and .Lastmod

        # Hugoをセットアップ
       - name: Setup Hugo
           uses: peaceiris/actions-hugo@v2
           with:
           hugo-version: "0.78.2"

        # ビルド
       - name: Build
           run: hugo --minify

        # SSHに関する設定を構成
       - name: Prepare SSH Secret
           run: |
           mkdir -p ~/.ssh
           chmod 700 ~/.ssh
           echo '$SSH_SECRET' | envsubst > ~/.ssh/id_ed25519
           echo '$SSH_CONFIG' | envsubst > ~/.ssh/config
           chmod 600 ~/.ssh/id_ed25519
           ssh-keyscan -t rsa github.com >> ~/.ssh/known_hosts
           env:
           SSH_SECRET: ${{ secrets.SSH_SECRET }}
           SSH_CONFIG: ${{ secrets.SSH_CONFIG }}

        # rsyncによるデプロイ
       - name: Deploy
           run: |
           rsync -e "ssh -o 'StrictHostKeyChecking no'" -avz --delete public/ u.tsukuba.ac.jp:$SSH_PATH
           env:
           SSH_PATH: ${{ secrets.SSH_PATH }}

   ```

1. GitHub Actions で使う Secrets を設定する

   - 前提条件
     - SSH 秘密鍵と公開鍵のペアを作成する
       :::caution
       今まで SSH 鍵を作ったことがある人は，今までの公開鍵・秘密鍵を上書きしないよう要注意！！！！！！
       :::
       - `ssh-keygen -t ed25519`
         - **公開鍵**(`~/.ssh/id_ed25519.pub`)**を全学計算機の**`~/.ssh/authorized_keys`**の最下部に書き込む**．秘密鍵(`~/.ssh/id_ed25519`)はこの後使う．
     - GitHub でアカウントを作る
     - リポジトリを作成
     - Secrets の設定はリポジトリ -> Settings -> Secrets and variables -> Actions -> **New repository secret**
   - | Name         | Secret                                                                                    |
     | ------------ | ----------------------------------------------------------------------------------------- |
     | `SSH_SECRET` | `~/.ssh/id_ed25519`の内容全て                                                             |
     | `SSH_CONFIG` | 後述                                                                                      |
     | `SSH_PATH`   | デプロイ先のファイルパス．`/www/ユーザー名/wwws`(このブログは`/www/ユーザー名/wwws/blog`) |
   - `SSH_CONFIG`
     - 通常`~/.ssh/config`に置かれる形式のものです．以下のようにしてください．
       ```config
       Host u.tsukuba.ac.jp # ここは識別用の名前なので実はなんでも良いです(ただしdeploy.ymlのrsyncコマンドで呼び出しているので，そちらも変更する必要があります．)．
          HostName icho01.u.tsukuba.ac.jp # SSH接続先
          User {ユーザー名} # sから始まる学籍番号です．{}は外してください
       ```
   - こんな感じになっていれば OK です  
      ![github-to-tsukuba](secret-result.png)
   - ```shell
     git add -A
     git commit -m "Init"
     git push
     ```

1. `https://www.u.tsukuba.ac.jp/~ユーザー名/`の表示が 404 でなければ成功！
   :::info
   成功したら，ローカルに作成された`~/.ssh/id_ed25519`と`~/.ssh/id_ed25519.pub`は消しておいてください
   :::
