---
slug: description
title: ここは何
authors: [bonychops]
tags: []
---

ほねつき備忘録に掲載したブログもこちらに移行する予定です．Docusaurusはこんな感じに**マルチブログ**にも対応しています．
<!--truncate-->

## やり方
アドカレからきた方が多いと思いますので，やり方を記載しておきます[^1]．
`docusaurus.config.js`を次のように編集します．

```js title="docusaurus.config.js"
module.exports = {
  // ...
  plugins: [
    [
      '@docusaurus/plugin-content-blog',
      {
        /**
         * マルチインスタンスプラグインに置いて必ず必要
         */
        id: 'second-blog',
        /**
         * ブログのURL
         * 末尾のスラッシュ(/)は**含めない**
         */
        routeBasePath: 'my-second-blog',
        /**
         * ブログファイルが置かれているディレクトリパス
         */
        path: './my-second-blog',
      },
    ],
  ],
};
```

[^1]: [Multiple blogs | Docusaurus](https://docusaurus.io/docs/next/blog#multiple-blogs)