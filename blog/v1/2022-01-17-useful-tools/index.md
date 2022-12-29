---
title: 俺がよく使う俺がツール
authors: [bonychops]
tags: []
---
自分用です．随時追加していきます．ここにないやつはGitHubの[Stars](https://github.com/BonyChops?tab=stars)を漁れば見つかるかもしれない．

<!--truncate-->

:::caution
本記事は旧ブログである[ほねつき備忘録](https://bonychops.hatenablog.jp)を移植したものです．
:::



# Linux
- Dconf Editor: Ubuntu向け設定ツール(Winのレジストリエディタに当たる)
- Tweaks: Ubuntuのちょっと上級向け設定ツール
- Peek: LinuxでGIFアニメ/MP4動画作れるやつ．Waylandでうまく動かない；；
- gmrun: MacのSpotlight的なノリでJetBrainsのRun anythingをやるやつ
-  [AppImageLauncher](https://github.com/TheAssassin/AppImageLauncher): AppImageをかんたんに起動できるやつ．有能すぎる．
- power10k: zshのpowerlineなプロンプトをウィザード形式で設定できる 
- Grub Customizer: Grubの編集はこいつに任せとけば間違いない
- [Schneegans/Burn-My-Windows](https://github.com/Schneegans/Burn-My-Windows): ウィンドウがドゥワアアアって消えるやつ
- Brasero: iso焼くやつ
  - WinならImgBurn
- nmap: ポート探しはおまかせ

## Arch Linux
基本的には[Wiki](https://wiki.archlinux.jp/)を見ればOK(たまに日本語版が古いことがある)。

- pacman: パッケージマネージャ
- yay: AURのパッケージマネージャ
- [NetworkManager](https://wiki.archlinux.jp/index.php/NetworkManager): ネットワーク自動管理
- LightDM: クロスデスクトップディスプレイマネージャ
  - Swayはdesktopを`/usr/share/wayland-sessions/sway.desktop`に置くため勝手に認識する。基本的には`sudo systemctl enable lightdm`でOK
- Fira Code: かっこいいリガチャフォント
- grim: Wayland系でスクショ
  - grimshot[AUR]: 便利になったやつ
  -  wl-clipboard: スクショをクリップボードに貼り付けるときに使う
- Sway: Wayland系タイル型ウィンドウマネージャ。i3wmのWayland版。configはGitHubのdotfilesにあがってる
  - Waybar: swayのステータスバーをいい感じにカスタマイズ。
    - [Waybar Examples](https://github.com/Alexays/Waybar/wiki/Examples)
      - [chaibronz/waybar_conf](https://github.com/chaibronz/waybar_conf)
  - wofi: rofi(i3wm向け)のSway版。真ん中にでてくるメニュープログラム
- [マイナンバーカードでPAM認証](https://www.osstech.co.jp/~hamano/posts/jpki-pam/) 
- 認証エージェント
  - polkit-gnome
- 日本語
  - fcitx5-im
  - fcitx-mozc-ut
  - qt5-wayland
  - fcitx5-qt

# Node
- forever: 永続化
  - pm2: こっちのほうが人気
- Sequelize: SQLのORM
- Docusaurus: Docs作成

# Windows
- [Dependencies](https://github.com/lucasg/Dependencies): アプリケーションの依存関係(dll)を確認できる．足りないやつもすぐにわかる．

# 文章系
- CSV+: マルチプラットフォームのExcelライクなCSVエディタ
- latexmk: こいつとVSCodeを組み合わせれば最強のLaTeX執筆環境

# Android
- Genymotion: Linuxでも使えるAndroidエミュ．デフォでrootがあるのが良い
- Vysor: Androidスクリーンキャプチャの中で最も優秀だったやつ．今はどうなんだろう？

# ネットワーク
- Wireshark: パケットキャプチャ
- mitmproxy: Android/iOS HTTPS パケットキャプチャ
- Gvpngate: Linux向けVPNGateのGUI版
- Bitmeter: マルチプラットフォームで帯域使用率を確認できるやつ
- stunnel: TLSトンネリングツール
- NextDNS: Twitterに依存しすぎたときはこいつで制限する．PC含めどのデバイスでもブロックできるから重宝．
- ZeroSSL: Let's Encryptの次に使いたい無料SSL証明局

# その他
- Keepa: Amazonの価格変動を見抜く
- [bakusoku_aviutl_plugin](https://github.com/suzune25254649/bakusoku_aviutl_plugin): その名の通りAviUtlの動作を軽くするもの．機能を制限するわけではなく，既存の機能を最適化してるから好き
- 拡張編集RAMプレビュー(AviUtl): レンダー結果をキャッシュして表示させる
- [BeUtl](https://github.com/b-editor/BeUtl): マルチプラットフォームな動画エディタ．BEditorの後続版．支援中．
- Zapier: トリガとアクションを設定してサービス感をつなぐサービス．NodeREDとかで代用できるのか？
- Integromat: Zapierよりも強力なやつ
- [labelmake.jp](https://labelmake.jp): 宛名作成サービス