---
title: 公式クライアントからの通信かを判定する
authors: [bonychops]
tags: [ポエム, HMAC]
---

想定されたクライアントからのリクエストか否かを判定したい時がある(ex. 正式なゲーム機から送られたハイスコアデータか否かなど)。そういったときに使えそうな技をまとめておく。

<!--truncate-->

:::warning

**筆者は暗号技術にめっぽう疎い**ため、あくまでもメモです。気になる点はページ下部「このページを編集」、[Discussions](https://github.com/BonyChops/blog/discussions)、または[Issue](https://github.com/BonyChops/blog/issues)よりよろしくお願いします。

:::

:::warning

レポートとかではないので日本語とか文体とか体裁がかなり適当です。思ったことを書き殴るぞ。

:::

## はじめに

「？普通に Authorization ヘッダとかに適当なトークン置いとけばええんちゃう」と思われがちなこのトピックだが、今の時代 mitmproxy などを使えば TLS(SSL)通信のペイロードなども見れるので、一度トークンを除かれてしまえば任意のクライアントに偽造されてしまう。まあそこまでこだわる必要がなければよいかもしれないが、仮にペイロードが除かれても問題ないものにしたい。

## PGP の署名

経験上最初に思いついたのがこれ。適当な秘密鍵を作って、ペイロードごと署名することで公式クライアントから吐き出されたことを証明する。

```
@BonyChops ➜ /workspaces/blog (2023-01-14-official-client-auth ✗) $ gpg --list-keys
/home/codespace/.gnupg/pubring.kbx
----------------------------------
pub   rsa3072 2023-01-14 [SC]
      627DE65886C6B17ED3565FA8BB0361727D491AA0
uid           [ultimate] test_client (hello) <example@bonychops.com>
sub   rsa3072 2023-01-14 [E]

@BonyChops ➜ /workspaces/blog (2023-01-14-official-client-auth ✗) $ echo "This is sample payload" | gpg --clear-sign
-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA512

This is sample payload
-----BEGIN PGP SIGNATURE-----

iQGzBAEBCgAdFiEEYn3mWIbGsX7TVl+ouwNhcn1JGqAFAmPCihMACgkQuwNhcn1J
GqBXHwwAgyhCAxTKvrJKQInv0+NiMqkKFDGKv6Vw368lRd82RXLquWfRtTw0YRwi
R4pqXXQAhNQsJa1bpCYcQmtuZSYiCXCu49EMyqXWI8RGh/FbyQOHmNNEMaQyZLYw
4JgzKItJHBuTcBkD5ylZrEYVT7jcTGw7lutKvKfu4ayvY1zUAndhfHRIRKx6onmP
iCZnxVmOLrbswnoB1by9Sw4wG/Tb6qOdDMn0YYxo8Xu9l86PmthJW78v64FhFnzu
R7uFYux9UPjkYhFqsJijkyes7A7QDhFCHjq62a9SQvZMHN4DPjc1ny4tND0OMYSB
bSdZxDSLqDVi78qyf04H8qlTO24b6US72fwMszw2/+UPywaMh5ntPhEx94Kn+uFT
+9vK6C1byWt6ryt7aiE73Hpcl6JbtgOgX4cKUflnYz404nqUnbuX6uhT7I/y4dSx
IPjfvFo0C/l7AUFHQz6ElTAKSue1vKZFX+MMH39PlotE6RSZpAH5uEzdPf3DO8gt
1vYRLNQq
=/ZuA
-----END PGP SIGNATURE-----
@BonyChops ➜ /workspaces/blog (2023-01-14-official-client-auth ✗) $
```

ただこれ

- ペイロードがでかすぎる
- PGP の秘密鍵をどうやって管理するのか[^1]
- そもそも高級すぎる技術な気がするような...

→ どう考えても適切じゃない

<details>
<summary>どうでもいいこと: GitHub Codespacesの仕様</summary>

この記事は GitHub Codespaces を使って執筆している。インターネット環境さえあればどの PC でも開発できるうえ、**PGP によるコミット署名**もしてくれるため大変ありがたい。  
ただ、

```
@BonyChops ➜ /workspaces/blog (2023-01-14-official-client-auth ✗) $ gpg --list-keys
gpg: directory '/home/codespace/.gnupg' created
gpg: keybox '/home/codespace/.gnupg/pubring.kbx' created
gpg: /home/codespace/.gnupg/trustdb.gpg: trustdb created
@BonyChops ➜ /workspaces/blog (2023-01-14-official-client-auth ✗) $
```

`gpg --list-keys`を実行したら、`.gnupg`がないといわれた。どうやって署名してるん？？

</details>

## Nintendo Switch Online で使われた技(HMAC)

Nintendo Switch Online では、公式クライアントで行われたリクエストか否かをどのように判定しているだろうか。mitmproxy を用いてリバースエンジニアリングされた API の仕様が[ZekeSnider/NintendoSwitchRESTAPI](https://github.com/ZekeSnider/NintendoSwitchRESTAPI)リポジトリにまとめられている~~(おっと？)~~。

Nintendo Switch Online の認証には`f`と呼ばれるパラメータがあり、そこにはなにかのハッシュ値のような値が格納されている。リポジトリの[Wiki](https://github.com/frozenpandaman/splatnet2statink/wiki/api-docs#splatnet2statink-api-documentation-deprecated)によれば、

> _This hash can then be passed to the flapg API (an Android server emulating the Nintendo Switch Online Android app) – along with that same id_token, timestamp, and a UUID – to create a unique HMAC (keyed-hash message authentication code). This is done within Nintendo's app in an obfuscated manner._
>
> (flapg API は f パラメータを、公式クライアントをがエミュレートされた環境を用いて生成する Web API)

要約すると、`f`パラメータは次の項目を HMAC で計算した値らしい

- `id_token`: 対象のペイロードとみなせる
- タイムスタンプ: 現在時刻
- UUID: 識別用

<details>
<summary>HMACについて</summary>

s

</details>

これを応用して、次のようなリクエストを想定してみる。

- 適当なペイロード
- タイムスタンプ: 現在時刻
- UUID: 識別用
- hash: 上記でいう`f`パラメータ

さらにサーバー(受け取り)側で次のような制約を持たせればうまいことできそう

- タイムスタンプについて
  - あまりにも離れた値のものは受け付けない
  - 過去に受け取ったタイムスタンプのものは受け付けない(識別子があれば過去に受け取ったか否かを判定可能)
- 公式クライアントとサーバーは同じ秘密鍵を共有している

これを応用して似たものを作れそう

```javascript title=client.js
require("dotenv").config();
const crypto = require("crypto");
const axios = require("axios");

const payload = { highScore: 1024 };
const key = process.env.WRONG_SECRET ?? process.env.SECRET;
const dataToHash = {
  ...payload,
  timestamp: Number(process.env.TIMESTAMP ?? new Date()),
  uuid: crypto.randomBytes(16).toString("hex"),
};

const hash = crypto
  .createHmac("sha1", key)
  .update(JSON.stringify(dataToHash))
  .digest("hex");

(async () => {
  let result;
  try {
    result = await axios.post("http://localhost:4567/score", {
      ...dataToHash,
      hash,
    });
  } catch (e) {
    console.error(e.toString());
    if (e.response) {
      console.error(e.response.data);
    }
    return;
  }
  console.log(result.data);
})();
```

```javascript title=server.js
require("dotenv").config();
const fs = require("fs");
const crypto = require("crypto");
const fastify = require("fastify")({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
});
const dbName = "timestampDB.txt";
const key = process.env.WRONG_SECRET ?? process.env.SECRET;

fastify.post("/score", async (request, reply) => {
  const { body } = request;

  //Check param
  if (!["timestamp", "uuid", "hash"].every((key) => body[key])) {
    throw new Error("Not enough param");
  }

  // Clientを検証
  // 1. タイムスタンプをチェック
  if (Math.abs(body.timestamp - Number(new Date())) > 1000) {
    throw new Error("Too far timestamp from now.");
  }
  // 2. 過去に受け取ったか？(UUIDは面倒くさいので考慮しない)
  if (
    fs.existsSync(dbName) &&
    Number(fs.readFileSync(dbName).toString().trim()) >= body.timestamp
  ) {
    throw new Error("This request is already recieved.");
  }
  // 3. HMAC作成&検証
  const dataToHash = Object.fromEntries(
    Object.entries(body).filter((v) => v[0] !== "hash")
  );
  const hash = crypto
    .createHmac("sha1", key)
    .update(JSON.stringify(dataToHash))
    .digest("hex");

  if (hash !== body.hash) {
    throw new Error("Invalid request");
  }
  console.log("Recieved valid request!:");
  console.log(body);

  //受け取ったタイムスタンプを記録しておく
  fs.writeFileSync(dbName, String(body.timestamp));

  return { status: "success" };
});

// Run the server!
const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT ?? 4567 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
```

```shell title=.env
SECRET=I_AM_OFFICIAL_CLIENT
```

(試したい方は[BonyChops/request-from-official-client](https://github.com/BonyChops/request-from-official-client)へ)

まず，`node server.js`でサーバーを起動．その後，

- 通常実行
  ```
  node client
  ```
  すると，サーバー側で
  ```js {3}
  Recieved valid request!:
  {
    highScore: 1024,
    timestamp: 1673772979280,
    uuid: '07d561d0613631199d22bd8066b5db89',
    hash: '36e7ea20b0d7f8f616cf0bda3e1d'
  }
  ```
  ちゃんと受け取れていることがわかる．何回か実行すると，hash 値が毎回違うこともわかる[^3]．
- 秘密鍵が違うとき
  ```
  WRONG_SECRET=hehe node client
  ```
  すると，
  ```js {5}
  AxiosError: Request failed with status code 500
  {
    statusCode: 500,
    error: 'Internal Server Error',
    message: 'Invalid request'
  }
  ```
  ちゃんと弾く
- すでに送ったタイムスタンプ  
  正しいリクエストでも，すでに送られたものであれば意味がない．過去に送ったタイムスタンプで送信してみる．
  ```
  TIMESTAMP=1673772979280 node client
  ```
  ```js {5}
  AxiosError: Request failed with status code 500
  {
    statusCode: 500,
    error: 'Internal Server Error',
    message: 'Too far timestamp from now.'
  }
  ```
  ...本当はすでに送られたリクエストってことで弾いてほしかったが，実時間と離れすぎてエラーがでた．まあ弾いてくれたしいっか(適当)

## そもそも論

どうやって送るかに注力してましたが，まず**公式クライアントから秘密鍵を盗られない**ようにすることのほうが大変そうな気がする...  
例えば，C のコンパイル時に鍵をなんらかの形でバイナリに埋め込んだとして，果たしてどれぐらい読めるようになるものなのか(最適化オプションとかつければいい感じにぐちゃぐちゃにしてくれるんじゃないの，知らんけど)など，考えなければいけないことはまだまだある．

## まとめ

何も知らないでいると，「適当に PGP でいんじゃね w」となりがちですが，調べればちゃんと色んな方法があるもの．  
自分含め高級な技術から学び始めた人は，IoT なソリューションが必要なときに「とりあえずラズパイでいいか w」となりがちだが，できるのであれば適切な技術を使えるようになりたい[^2]．

[^1]: まあこれに関してはすべてに共通する問題なのですが...少なくとも PGP の秘密鍵の管理はわりと大変そうなイメージ
[^2]: そういうあなたは n 年前から暗号技術を学んでみたいとか口先だけで今に至るのですが...
[^3]: まあ，毎回違う uuid 指定してるからそれも起因してますけどね...
