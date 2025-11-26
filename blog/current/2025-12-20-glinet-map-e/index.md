---
title: GL.iNet Flint 2 (OpenWrt 21) で MAP-E (Biglobe)
authors: [bonychops]
tags:
  [
    "GL.iNet",
    "Flint 2",
    "OpenWrt",
    "Biglobe",
    "MAP-E",
    "長野高専 Advent Calendar 2025",
    "長野高専 Advent Calendar",
    "アドベントカレンダー",
  ]
---

## これまでのあらすじ

やめて！「ルータで細かい設定ができたら面白そう」とかいう浅はかな理由で OpenWRT に手を出したら無限に時間が溶けちゃう！

お願い、死なないで IPv4！

あんたが今ここで倒れたら、**¥ 17,919- (税込)** で買った [Flint 2](https://amzn.asia/d/7pT25XP)[^1] はどうなっちゃうの？

時間はまだ残ってる。ここを耐えれば、ハッピーインターネットライフが待っているんだから！

**次回「Bony 死す」デュエルスタンバイ！** [^2]

<!--truncate-->

## はじめに

:::info 20 日目: [長野高専 Advent Calendar 2025](https://qiita.com/advent-calendar/2025/nnct)
こちらは[長野高専 Advent Calendar 2025](https://qiita.com/advent-calendar/2025/nnct) 20 日目の記事です！NNCT アドカレ、これで 5 回目の参加になります！
:::

この記事では、OpenWrt をベースとしたルータを取り扱う GL.iNet の Flint 2 で、MAP-E を確立させる方法と、それまでにあった経緯をまとめていこうと思います。

こういう記事であるあるの、**「その根拠はなんなんだよ！！」** みたいな部分は限りなく潰していきたいと思っているので、footnote すらないものは是非コメントをください。

## OpenWrt とは

[OpenWrt](https://openwrt.org/)は、ゲートウェイなどの組み込みシステム用ファームウェアとして開発されている Linux ディストリビューション[^opwnwrt-wiki]で他ファームウェアと比較してカスタマイズ性が非常に高いことが特徴として挙げられます。

基本的に既製品のルータには独自のファームウェアが導入されていることが多いので、OpenWrt を使いたい際にはどうにかこうにかねじ込む必要があるのですが、**GL.iNet 製のルータは OpenWrt をベースに開発されている**ので、前述による文鎮リスクなどがないところが良いですね。

## 日本のインターネットと IPv6 [^v6plus]

:::warning
基本的には徹底解説 v6 プラスの引用ですが、誤った解釈をしている可能性があります。  
詳しくは引用元である[徹底解説 v6 プラス – 技術書出版と販売のラムダノート](https://www.lambdanote.com/products/v6plus)をご確認ください。  
PDF 版は**無料**なので誰でも見れます！
:::

:::info
ここで記載する NAT は全て NAPT を含むものをしてください
:::

インターネットの接続方式は国や地域ごとに大きく異なります。
多くの国では、家庭用ルータを用意して LAN ケーブルを挿すだけで、DHCP によりすぐに IPv4/IPv6 の通信が始まります。  
ほぼすべての家庭回線が “そのまま IPv4 を使える前提” で設計されているため、接続方式の違いを意識する必要はほとんどありません。

日本は他国と異なり、大抵の場合インターネットに出る手前で**フレッツ網**という閉域ネットワークを経由します。この網からインターネットに出る方法として、PPPoE と IPoE の二種類から選べる様になっています。技術的な詳しい違いは[徹底解説 v6 プラス – 技術書出版と販売のラムダノート](https://www.lambdanote.com/products/v6plus)の 3.2 節を見て欲しいのですが、**PPPoE は ISP が設置する網終端装置（BNG）を必ず経由**します。これがアクセス集中で輻輳しやすいと言われています。一方で、**IPoE は PPPoE のようなセッション終端装置を通らず**、VNE の大規模なルータへ直接届けられます。この構造により、PPPoE より混雑の影響を受けにくく、通信が安定しやすいとされています。そのため、拙宅では **IPoE** を利用することにしました。

ただし、IPoE の場合仕様上そのままでは IPv4 に接続できません。IPoE を用いて v4 を扱う場合、日本では、**MAP-E**か**DS-Lite**のいずれかの IPv4 over IPv6 技術を使用するのが主流です。ルータがこの事情を知らない限り、**LAN ケーブルを挿しただけでは v4 ネットワークに接続できないのです。** 日本で主流のルータのラインナップに限りがあると感じるのはこれが原因で、**ルーター側がこの日本の特殊な事情を把握している必要があります**。

ただし、逆を返せば、ルータがこの事情を知っていれば接続ができます。まさに、OpenWrt の様なカスタマイズ性の高いルータを用意して、上記の様な事情を叩き込んであげれば、たとえ上記の様なルールセットが教えられていないモデルでも使うことができます。今回 GL.iNet の Flint 2 を買った理由として

- ハイパフォーマンス
- コスパ良い
- OpenWrt ベース
  - そもそも細かい設定ができるルータが欲しかった

が理由にあがります。まさにこの事情にピッタリですね。

:::info Biglobe について
MAP-E での BR アドレス(接続先)を決める上で、この回線はどの VNE であるかを意識することは極めて重要です。  
拙宅で使用している Biglobe について調べてみると「Biglobe は VNE 事業者である[^biglobe-vne]」とされています。
[徹底解説 v6 プラス – 技術書出版と販売のラムダノート](https://www.lambdanote.com/products/v6plus)では、VNE 事業者は 3 社であるとされ、そこには Biglobe は載っていないことから矛盾している気がするのですが、「Biglobe は VNE 事業者であり BR アドレスが存在する」という前提で設定するとうまくいくため、本記事では一旦そういうことにしてあります。
:::

## 設定

では設定に入っていきます。これを確立させるために、実に**4 週間**ぐらいかかりました 😅  
奮闘記は下記にまとめてあります。何かしらでうまくいかない場合は、以下ももしかしたら参考になるかもしれません。

[GL.iNet Flint 2 (OpenWrt 21) で Biglobe の IPv6 オプションに対応させる](https://zenn.dev/bony_chops/scraps/373f1e79ef93b3)

:::info
下記は Biglobe 光回線で検証しています
:::

### GL.iNet の管理パネル

- ネットワーク -> IPv6 で モードを Passthrough[^passthrough], DNS 取得方法を自動にする

:::warning **GL.iNet v4.8.2, v4.8.3 あたりを使用している場合**、または下記を全てやってうまくいかない場合

- ネットワーク → ネットワークアクセラレーションを無効

:::

### WAN6 の修正

以降は LuCI での設定になります。  
システム -> 詳細設定 -> LuCI へ移動する (インストールが済んでいない場合はする)

- Network -> Interfaces を開き、WAN6 を Edit, device を正しい物理インタフェース(eth1 など)にする

この時点でうまく行っている場合は IPv6 接続ができる様になっているはずです([google.com](https://www.google.com)などにアクセスして確認してください)。

:::note
System -> Administration -> SSH-keys で公開鍵を設定しておくと便利です
:::

### MAP-E に必要なパッケージのインストール

```sh title="sshで実行"
opkg update --no-check-certificate
opkg install map ca-certificates --no-check-certificate
/etc/init.d/network restart
```

:::info
特に、最後の `/etc/init.d/network restart` を実行しないと LuCI (Web インタフェース)上の Protocol に MAP / LW4over6 が出現しません。

> うまくいかない場合は `map` インストール後にルータを再起動してください。

という指示が散見されるのはこれが理由です。
:::

### IPv4, IPv6 を控える

IPv6 が接続されている場合、WAN6 インタフェースにこの様な IPv6 アドレスが表示されていると思います

TODO: スクリーンショット

https://ipv4.web.fc2.com/map-e.html

↑ 上記サイトで諸々の値(IPv4 など)を控えておいてください。

### IPv6 PD 設定[^osakana]

:::info
ここからの設定は構成ファイルでも可能です。GUI での操作が嫌いな人は [#ここまでの構成ファイル](#%E3%81%93%E3%81%93%E3%81%BE%E3%81%A7%E3%81%AE%E6%A7%8B%E6%88%90%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB) まで読み飛ばしてください
:::

<details>
<summary>このインタフェースが必要な理由</summary>

Flint 2 は 64 bit アーキテクチャで動作しています。MAP-E で使用されるアドレス計算用のモジュール mapcalc には、64bit アーキテクチャ環境でのみ発生するバグがある[^mapcalc-bug]ことがわかっているため、

> WAN6 の Custom delegated IPv6-prefix を設定する

等の設定ではうまくいきません。OpenWrt 21 の場合、WAN6PD に偽のインタフェースを設けることでこの問題を回避できます。

:::warning
OpenWrt 21 以外では現状うまくいきません。
:::

</details>

Add new interface...から

- Name: WAN6PD
- Protocol: Static Address
- デバイス: eth1

で作成。

この時、WAN6 に表示されている IPv6 が  
`wwww:xxxx:yyyy:zzzz:aaaa:bbbb:cccc:dddd/64`  
であれば、

- ネットワーク部（最上位 64 bit）：wwww:xxxx:yyyy:zzzz
- インターフェース ID（下位 64 bit）：aaaa:bbbb:cccc:dddd

という構造になっています。  
このネットワーク部を用いて下記の様に設定してください。

- IPv6 address: `wwww:xxxx:yyyy:zzzz::1001`
- IPv6 gateway: `wwww:xxxx:yyyy:zzzz::1`
- IPv6 routed prefix: `wwww:xxxx:yyyy:zzzz::/56`

### MAP-E 接続設定[^osakana]

Add new interface...から

- Protocol: MAP/LW4over6
- Type: MAP-E

あとは　[#IPv4, IPv6 を控える](#ipv4-ipv6-%E3%82%92%E6%8E%A7%E3%81%88%E3%82%8B) で控えた各設定をそのまま設定します。

TODO: 確認

- General Settings
  - BR: `peeraddr`
  - IPv4 prefix: `ipaddr`
  - IPv4 prefix len: `ip4prefixlen`
  - EA bit len: `ealen`
  - PSID len: `psidlen`
  - PSID offset: `offset`
- Advanced Settings
  - Use legacy map[^use-legacy]: ✅

:::warning BR アドレス(`peeraddr`)について
前述の通り、BR アドレス値は VNE 事業者のアドレスになります。各ブログで、

- https://ipv4.web.fc2.com/map-e.html の`peeraddr`をそのまま使って良い
- ここは`...`の固定値である

という両者の意見を見かけるのですが、https://ipv4.web.fc2.com/map-e.html の実装(JS)を確認する限り、なんらかの指標でこの値を算出してくれているっぽいのでそのまま使って良い気がします。  
拙宅の Biglobe の場合は算出されたものをそのまま使って大丈夫でした。
:::

### ここまでの構成ファイル

これまでの設定は全て下記のファイルの編集・追記でも設定できます。

```sh title="/etc/config/network"

```

```sh title="/etc/config/firewall"

```

上記で設定した場合は下記を実行する

```sh
/etc/init.d/network restart
/etc/init.d/firewall restart
```

### ニチバン対策

下記スクリプトでニチバン対策ができます。  
他サイトを諸々参考[]にして作りましたが、最終的には自分(~~と **ChatGPT**~~)が作っております。

以下に作る際で沼ったポイントを一応書いておきます。

<details>
<summary>すでに使われているmask</summary>

GL.iNet 製の場合、すでに上位ルールで使われている mark bit があります。

```sh

```

上記の通り、
TODO: 確認

- `0x8`: xxx...

あたりが使われているため、それを回避する様に mark を建ててあげる必要があります。

</details>

<details>
<summary>`nth` ルールは等確率ではない</summary>

すでにこのあたりの議論で触れていた方もいらっしゃいますが、 `nth` ルールは等確率でパケットを分けてくれるわけではない様です。

...

GPT と相談し、`random` を用いてほぼ等確率にパケットを分けてくれる様にしました。

</details>

<details>
<summary>二重実行の回避</summary>

現環境(GL.iNet 固有？)では `/etc/firewall.user` がなぜか 2 回実行されます。このままではルールセットが 2 重で追加されてしまうため、重複実行されることを前提としたルール (重複防止ガードを組むなど)にする必要がありました。

</details>

`/lib/netifd/proto/map.sh`で、下記を追記してください。

:::info diff 表記版
https://zenn.dev/link/comments/fe58ff5e5eab09
:::

```sh title="/lib/netifd/proto/map.sh"
 	      json_add_string snat_ip $(eval "echo \$RULE_${k}_IPV4ADDR")
 	    json_close_object
 	  else
# highlight-start
        local MARK_BASE=0x00100000       # ここから開始
        local MARK_MASK=0x0fff0000       # 上位 12bit だけ使用
        local mark=${MARK_BASE}
# highlight-end
        for portset in $(eval "echo \$RULE_${k}_PORTSETS"); do
            for proto in icmp tcp udp; do
                json_add_object ""
                json_add_string target SNAT
                json_add_string family inet
                json_add_string proto "$proto"
# highlight-next-line
                json_add_string mark "$(printf '0x%08x' "${mark}")/${MARK_MASK}"
                json_add_boolean connlimit_ports 1
                json_add_string snat_ip $(eval "echo \$RULE_${k}_IPV4ADDR")
                json_add_string snat_port "$portset"
                json_close_object
            done
# highlight-next-line
            mark=$((mark + 0x00010000))
 	    done
 	  fi
 	  if [ "$maptype" = "map-t" ]; then
```

Network -> Firewall -> Custom Rules に以下を設定 (`/etc/firewall.user` に設定したのちに`/etc/init.d/firewall restart` を実行するのと同義です)。

```sh title="/etc/firewall.user"
# --- 並行実行ガード（すでに誰かが実行中なら即終了） ---
LOCKDIR=/var/run/mape_nth.lock
if ! mkdir "${LOCKDIR}" 2>/dev/null; then
  # 他プロセスが実行中 or 直前に完了
  exit 0
fi
trap 'rmdir "${LOCKDIR}"' EXIT

EVERY=15
MARK_MASK=0x0fff0000
MARK_BASE=0x00100000
LANIF=br-lan

# 代表マーク（i=0 → MARK_BASE, prob=1/15）で“導入済み”を判定
check_prerouting() {
  iptables -t mangle -C PREROUTING -i "$LANIF" \
    -m conntrack --ctstate NEW \
    -m mark --mark 0x0/${MARK_MASK} \
    -m statistic --mode random --probability 0.066667 \
    -j MARK --set-xmark $(printf "0x%08x" "${MARK_BASE}")/${MARK_MASK} 2>/dev/null
}

check_output() {
  iptables -t mangle -C OUTPUT \
    -m conntrack --ctstate NEW \
    -m mark --mark 0x0/${MARK_MASK} \
    -m statistic --mode random --probability 0.066667 \
    -j MARK --set-xmark $(printf "0x%08x" "${MARK_BASE}")/${MARK_MASK} 2>/dev/null
}


add_prerouting_rules() {
  for i in $(seq 0 14); do
    # i ごとに 0x00010000 ずつ増やす
    local mark_val=$((MARK_BASE + (i << 16)))
    local hex
    hex=$(printf "0x%08x" "${mark_val}")

    # 残りバケット数 = 15 - i
    # 各バケットが最終的に 1/15 になるように、
    # 「残りに対する確率」 = 1 / (15 - i) にしておく
    local prob
    case "$i" in
      0)  prob="0.066667" ;;  # 1/15
      1)  prob="0.071428" ;;  # 1/14
      2)  prob="0.076923" ;;  # 1/13
      3)  prob="0.083333" ;;  # 1/12
      4)  prob="0.090909" ;;  # 1/11
      5)  prob="0.100000" ;;  # 1/10
      6)  prob="0.111111" ;;  # 1/9
      7)  prob="0.125000" ;;  # 1/8
      8)  prob="0.142857" ;;  # 1/7
      9)  prob="0.166667" ;;  # 1/6
      10) prob="0.200000" ;;  # 1/5
      11) prob="0.250000" ;;  # 1/4
      12) prob="0.333333" ;;  # 1/3
      13) prob="0.500000" ;;  # 1/2
      14) prob="1.000000" ;;  # 1/1（残りは全部ここ）
    esac

    iptables -t mangle -A PREROUTING -i "$LANIF" \
      -m conntrack --ctstate NEW \
      -m mark --mark 0x0/${MARK_MASK} \
      -m statistic --mode random --probability "${prob}" \
      -j MARK --set-xmark ${hex}/${MARK_MASK}
  done
}

add_output_rules() {
  for i in $(seq 0 14); do
    local mark_val=$((MARK_BASE + (i << 16)))
    local hex
    hex=$(printf "0x%08x" "${mark_val}")

    local prob
    case "$i" in
      0)  prob="0.066667" ;;
      1)  prob="0.071428" ;;
      2)  prob="0.076923" ;;
      3)  prob="0.083333" ;;
      4)  prob="0.090909" ;;
      5)  prob="0.100000" ;;
      6)  prob="0.111111" ;;
      7)  prob="0.125000" ;;
      8)  prob="0.142857" ;;
      9)  prob="0.166667" ;;
      10) prob="0.200000" ;;
      11) prob="0.250000" ;;
      12) prob="0.333333" ;;
      13) prob="0.500000" ;;
      14) prob="1.000000" ;;
    esac
  done
}

# 既存チェック→未導入なら投入
check_prerouting || add_prerouting_rules
check_output    || add_output_rules
```

最後に下記を実行。

```sh
/etc/init.d/network restart
```

## 余談

### Network Acceleration を有効にすると NAT を介さないパケットが漏れ出る

## おわりに

これで晴れて Flint 2 で快適なインターネットライフを送れる様になりました 🥳

ただ、前述した通り現状は Network Acceleration を無効にしているため真のパフォーマンスはまだ発揮できていないと思います。

今後の TODO としては

- 優先度高: GL.iNet のフォーラムで　[# Network Acceleration を有効にすると NAT を介さないパケットが漏れ出る](#network-acceleration-%E3%82%92%E6%9C%89%E5%8A%B9%E3%81%AB%E3%81%99%E3%82%8B%E3%81%A8-nat-%E3%82%92%E4%BB%8B%E3%81%95%E3%81%AA%E3%81%84%E3%83%91%E3%82%B1%E3%83%83%E3%83%88%E3%81%8C%E6%BC%8F%E3%82%8C%E5%87%BA%E3%82%8B) に関連するものを探す、なければ新しく建てる
- 優先度低: mapcalc に関する問題[^mapcalc-bug]のコントリビューション

あたりになると思います。

まとめとしては、日本で外向きに通信する L3 ルータとして GL.iNet はお勧めできません！**素直に Yamaha の RTX830 を買ってください！！！**

[^1]: 日本で買う場合は技適の都合で Amazon.co.jp を使うのをお勧めします。セール時だと前述の値段なので狙うことをお勧め。
[^2]: こちらの前置きが面白かったので真似させていただきました 😅 [自力で IPv4 over IPv6 をした（Tunnel 編） | 愚行録 the Next Generation](https://emeth.jp/diary/2018/05/ipv4-over-ipv6/)
[^nichi]: a
[^passthrough]: https://zenn.dev/link/comments/495f15d61dfa57
[^osakana]: [NanoPi R2S+OpenWRT 21.02.0 で BIGLOBE の MAP-E 接続 – OSAKANA TARO のメモ帳](https://blog.osakana.net/archives/11679)
[^opwnwrt-wiki]: [OpenWrt - Wikipedia](https://ja.wikipedia.org/wiki/OpenWrt)
[^v6plus]: [徹底解説 v6 プラス – 技術書出版と販売のラムダノート](https://www.lambdanote.com/products/v6plus)
[^biglobe-vne]: [入社 1 年目の挑戦：IPv4 over IPv6 への新たな取り組み - BIGLOBE Style ｜ BIGLOBE の「はたらく人」と「トガッた技術」](https://style.biglobe.co.jp/entry/2024/02/28/150000)
[^mapcalc-bug]: [OpenWRT の 64bit アーキテクチャで、mapcalc が適切に動かない話 \[MAP-E\] | Medium](https://kameneko.medium.com/openwrt-mapcalc-issues-on-64-bit-architecture-openwrt%E3%81%AE64bit%E3%82%A2%E3%83%BC%E3%82%AD%E3%83%86%E3%82%AF%E3%83%81%E3%83%A3%E3%81%A7-mapcalc%E3%81%8C%E9%81%A9%E5%88%87%E3%81%AB%E5%8B%95%E3%81%8B%E3%81%AA%E3%81%84%E8%A9%B1-map-e-494a39674998)
[^use-legacy]: MAP の場合の設定は、RFC 7598 で標準化されている DHCPv6 Option 95 によりプロバイダから降ってくることが前提ですが、日本の場合 ISP と VNE が違う都合、ルータ側で設定されている必要があります[^v6plus][^mapcalc-bug]。legacy map オプションを有効にして自分で設定する必要があるのはこのためです。
