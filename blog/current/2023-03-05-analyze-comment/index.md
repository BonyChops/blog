---
title: サイト閲覧者分析ツールとコメント機能をつけた
authors: [bonychops]
tags: ['Bony-Blog 更新履歴']
---
サイト閲覧者分析ツール: Google Analyticsとコメント機能: utterancesをつけた

<!--truncate-->

## Google Analytics
[公式Docs](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-google-gtag)に書いてある通りにやればOK．

```js {6-8} title=docusaurus.config.js
module.exports = {
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        gtag: {
          trackingID: 'G-999X9XX9XX',
        },
      },
    ],
  ],
};
```

自分は環境変数で指定したい(GitHub Actionsでビルドするため)ので，次のように設定．

:::info
毎回指定するのが面倒なのでとりあえず未指定の場合は`unset`にしてるけどあんまりいいプラクティスではない気がする...
:::

```js {7} title=docusaurus.config.js
module.exports = {
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        gtag: {
          trackingID: process.env.G_TAG ?? 'unset',
        },
      },
    ],
  ],
};
```

## utterances
utterancesはGitHub Issuesの機能でサイトのコメント機能として担わせるツール．
OSSであるのと，第三者のプラットフォームに飛んでいかない点で良い(まあGitHubには頼っちゃってますが...)．


設定はhttps://jbl428.github.io/2021/10/19/utterances/ を参考．  
韓国語の文献を参考にするのは珍しいかも(普段は大体英語文献がある)．

とりあえず，書いてあるとおり`src/theme/BlogPostItem.jsx`を設定する．
一部うまく動作しない点があったので少しだけ改変済み．

:::info
`props.isBlogPostPage`が`undefined`だったので，その部分だけ省いた．ブログのみにしてるからかな？まあ，現状ブログのみで特に支障はないのでこのままで...
:::

```jsx title=src/theme/BlogPostItem.jsx
import React, { useEffect, useRef } from "react";
import OriginalBlogPostItem from "@theme-original/BlogPostItem";
import { useColorMode } from "@docusaurus/theme-common";

const utterancesSelector = "iframe.utterances-frame";

function BlogPostItem(props) {
  const utterancesTheme = useColorMode().colorMode === "dark" ? "github-dark" : "github-light";
  const containerRef = useRef(null);

  useEffect(() => {
    // if (!props.isBlogPostPage) return;

    const utterancesEl = containerRef.current.querySelector(utterancesSelector);

    const createUtterancesEl = () => {
      const script = document.createElement("script");

      script.src = "https://utteranc.es/client.js";
      script.setAttribute("repo", "BonyChops/blog");
      script.setAttribute("issue-term", "pathname");
      script.setAttribute("label", "comment");
      script.setAttribute("theme", utterancesTheme);
      script.crossOrigin = "anonymous";
      script.async = true;

      containerRef.current.appendChild(script);
    };

    const postThemeMessage = () => {
      const message = {
        type: "set-theme",
        theme: utterancesTheme,
      };

      utterancesEl.contentWindow.postMessage(message, "https://utteranc.es");
    };

    utterancesEl ? postThemeMessage() : createUtterancesEl();
  }, [utterancesTheme]);

  return (
    <>
      <OriginalBlogPostItem {...props} />
      {/* props.isBlogPostPage && */ <div ref={containerRef} />}
    </>
  );
}

export default BlogPostItem;
```

## おわりに
ということで，コメント機能が無事ついたのでお気軽にコメントをしてってください．