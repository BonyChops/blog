---
title: 俺がよく使う俺がツール
authors: [bonychops]
tags: []
---

自分用です．随時追加していきます．ここにないやつは GitHub の[Stars](https://github.com/BonyChops?tab=stars)を漁れば見つかるかもしれない．

<!--truncate-->

:::warning
本記事は旧ブログである[ほねつき備忘録](https://bonychops.hatenablog.jp)を移植したものです．
:::

## Linux

- Dconf Editor: Ubuntu 向け設定ツール(Win のレジストリエディタに当たる)
- Tweaks: Ubuntu のちょっと上級向け設定ツール
- Peek: Linux で GIF アニメ/MP4 動画作れるやつ．Wayland でうまく動かない；；
- gmrun: Mac の Spotlight 的なノリで JetBrains の Run anything をやるやつ
- [AppImageLauncher](https://github.com/TheAssassin/AppImageLauncher): AppImage をかんたんに起動できるやつ．有能すぎる．
- power10k: zsh の powerline なプロンプトをウィザード形式で設定できる
- Grub Customizer: Grub の編集はこいつに任せとけば間違いない
- [Schneegans/Burn-My-Windows](https://github.com/Schneegans/Burn-My-Windows): ウィンドウがドゥワアアアって消えるやつ
- Brasero: iso 焼くやつ
  - Win なら ImgBurn
- nmap: ポート探しはおまかせ

### Arch Linux

基本的には[Wiki](https://wiki.archlinux.jp/)を見れば OK(たまに日本語版が古いことがある)。

- pacman: パッケージマネージャ
- yay: AUR のパッケージマネージャ
- [NetworkManager](https://wiki.archlinux.jp/index.php/NetworkManager): ネットワーク自動管理
- LightDM: クロスデスクトップディスプレイマネージャ
  - Sway は desktop を`/usr/share/wayland-sessions/sway.desktop`に置くため勝手に認識する。基本的には`sudo systemctl enable lightdm`で OK
- Fira Code: かっこいいリガチャフォント
- grim: Wayland 系でスクショ
  - grimshot[AUR]: 便利になったやつ
  - wl-clipboard: スクショをクリップボードに貼り付けるときに使う
- Sway: Wayland 系タイル型ウィンドウマネージャ。i3wm の Wayland 版。config は GitHub の dotfiles にあがってる
  - Waybar: sway のステータスバーをいい感じにカスタマイズ。
    - [Waybar Examples](https://github.com/Alexays/Waybar/wiki/Examples)
      - [chaibronz/waybar_conf](https://github.com/chaibronz/waybar_conf)
  - wofi: rofi(i3wm 向け)の Sway 版。真ん中にでてくるメニュープログラム
- [マイナンバーカードで PAM 認証](https://www.osstech.co.jp/~hamano/posts/jpki-pam/)
- 認証エージェント
  - polkit-gnome
- 日本語
  - fcitx5-im
  - fcitx-mozc-ut
  - qt5-wayland
  - fcitx5-qt

## Node

- forever: 永続化
  - pm2: こっちのほうが人気
- Sequelize: SQL の ORM
- Docusaurus: Docs 作成

# Windows

- [Dependencies](https://github.com/lucasg/Dependencies): アプリケーションの依存関係(dll)を確認できる．足りないやつもすぐにわかる．

## 文章系

- CSV+: マルチプラットフォームの Excel ライクな CSV エディタ
- latexmk: こいつと VSCode を組み合わせれば最強の LaTeX 執筆環境

## Android

- Genymotion: Linux でも使える Android エミュ．デフォで root があるのが良い
- Vysor: Android スクリーンキャプチャの中で最も優秀だったやつ．今はどうなんだろう？

## ネットワーク

- Wireshark: パケットキャプチャ
- mitmproxy: Android/iOS HTTPS パケットキャプチャ
- Gvpngate: Linux 向け VPNGate の GUI 版
- Bitmeter: マルチプラットフォームで帯域使用率を確認できるやつ
- stunnel: TLS トンネリングツール
- NextDNS: Twitter に依存しすぎたときはこいつで制限する．PC 含めどのデバイスでもブロックできるから重宝．
- ZeroSSL: Let's Encrypt の次に使いたい無料 SSL 証明局

## その他

- Keepa: Amazon の価格変動を見抜く
- [bakusoku_aviutl_plugin](https://github.com/suzune25254649/bakusoku_aviutl_plugin): その名の通り AviUtl の動作を軽くするもの．機能を制限するわけではなく，既存の機能を最適化してるから好き
- 拡張編集 RAM プレビュー(AviUtl): レンダー結果をキャッシュして表示させる
- [BeUtl](https://github.com/b-editor/BeUtl): マルチプラットフォームな動画エディタ．BEditor の後続版．支援中．
- Zapier: トリガとアクションを設定してサービス感をつなぐサービス．NodeRED とかで代用できるのか？
- Integromat: Zapier よりも強力なやつ
- [labelmake.jp](https://labelmake.jp): 宛名作成サービス
