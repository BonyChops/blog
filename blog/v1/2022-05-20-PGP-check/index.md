---
title: PGP署名の検証方法
authors: [bonychops]
tags: []
---

PGP による署名を行う機会が増えたので、それの簡単な検証方法を載せておきます。細かい手順は調べたほうがわかりやすいかもしれません。

<!--truncate-->

:::warning
本記事は旧ブログである[ほねつき備忘録](https://bonychops.hatenablog.jp)を移植したものです．
:::

## keybase.io を使う

ブラウザで署名を入力するだけで使えます。ただ、何を思ったか、PGP は検証できますが**KEYBASE SALTPACK はなぜかできません**(？？？？？？)。  
KEYBASE SALTPACK は Keybase クライアントを使いましょう(反対に、PGP はクライアント側でできないので、ブラウザでやりましょう)。  
やり方は簡単

1. 検証したい署名メッセージをすべて選択し、コピー![](20220517230454.png)
1. [https://keybase.io/verify](https://keybase.io/verify)にアクセス
1. 貼り付けて Verify
1. 想定するユーザーが出れば成功です![](20220517230656.png)

## GPG コマンドラインツールを使う

こちらは自分で公開鍵を持ってきたり、バイナリ(画像とか)に対して検証を行いたいときに使います。書きかけ

```sh
echo "test" | gpg --clear-sign | gpg --verify
```
