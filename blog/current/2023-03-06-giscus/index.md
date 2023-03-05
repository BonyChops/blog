---
title: Docusaurusにgiscus導入
authors: [bonychops]
tags: ['Bony-Blog 更新履歴']
---
先日(というか昨日)，コメント機能としてutterancesを導入した．
その際，IssueじゃなくてDiscussionsで同じことできないかなーと，utterancesのIssueで漁っていたら，こんなものを見つけた．

> I've built exactly this: **giscus**!
> 
> GitHub's Discussions API is very different from the Issues API, so I decided to create an entirely new project. Let me know how you like it!  
> *https://github.com/utterance/utterances/issues/324#issuecomment-841659521*

<!--truncate-->

どうやら，次の特徴があるらしい．
- utterances派生
- utterancesはGitHub Issuesを使うのに対し，giscusはDiscussionsを用いてコメントを管理する
- 複数言語対応(日本語も)
- ページそのものに対するリアクションがある
- Reactコンポーネントあり

**乗り換えますw**

:::note
元はutterancesなので，決してutterancesが劣っているというわけではないです．utterancesも，それを派生して作られたgiscusも両者に感謝．
:::

## giscus導入[^1]
こちらは参考文献が英語だった[^1]．

### Discussionsを有効化
リポジトリの設定から，Discussionsタブを有効化させる．  
このとき，コメント管理に割り当てるカテゴリを用意しておく．


### giscus有効化
[ここ](https://github.com/apps/giscus)からgiscusを有効化する．

### 各種IDの取得
[GraphQL API Explorer](https://docs.github.com/en/graphql/overview/explorer)でログインした後，次のクエリを実行して**リポジトリID**と**カテゴリID**を取得する．

:::info
`nameOfYourGitHubAccount`と`nameOfCreatedRepository`は各自変えてください
:::

```js
query { 
  repository(owner: "nameOfYourGitHubAccount", name:"nameOfCreatedRepository"){
    id
    discussionCategories(first:10) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
}
```

実行後の結果はこんな感じ．
```js
{
  "data": {
    "repository": {
      "id": "R_kgDOImGMcQ",
      "discussionCategories": {
        "edges": [
          {
            "node": {
              "id": "DIC_kwDOImGMcc4CTlp3",
              "name": "Announcements"
            }
          },
          {
            "node": {
              "id": "DIC_kwDOImGMcc4CUp3b",
              "name": "Comment"
            }
          },
          {
            "node": {
              "id": "DIC_kwDOImGMcc4CTlp4",
              "name": "General"
            }
          },
          {
            "node": {
              "id": "DIC_kwDOImGMcc4CTlp6",
              "name": "Ideas"
            }
          },
          {
            "node": {
              "id": "DIC_kwDOImGMcc4CTlp8",
              "name": "Polls"
            }
          },
          {
            "node": {
              "id": "DIC_kwDOImGMcc4CTlp5",
              "name": "Q&A"
            }
          },
          {
            "node": {
              "id": "DIC_kwDOImGMcc4CTlp7",
              "name": "Show and tell"
            }
          }
        ]
      }
    }
  }
}
```

### giscusコンポーネントを作成
giscusをインストール
```
npm i @giscus/react
```

そしたら，giscusコンポーネントを作ります．
```jsx title=src/component/GiscusComponent/index.jsx
import React from 'react';
import Giscus from "@giscus/react";
import { useColorMode } from '@docusaurus/theme-common';

export default function GiscusComponent() {
  const { colorMode } = useColorMode();

  return (
    <Giscus    
      repo="nameOfYourGitHubAccount/nameOfCreatedRepository" //要変更
      repoId="idOfCreatedRepo" //要変更
      category="General" //要変更
      categoryId="IdOfDiscussionCategory"  //要変更
      mapping="pathname"  //この場合はpathname元にマッピングされる
      term="Welcome to @giscus/react component!"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="1"
      inputPosition="top"
      theme={colorMode}
      lang="ja"
      loading="lazy"
      crossorigin="anonymous"
      async
    />
  );
}
```

### BlogPostItemのwrapper作成
:::note
元記事の`BlogPostItemWrapper`だと動かなかった．名前が変わったんだろうか？
:::


```sh
npm run swizzle @docusaurus/theme-classic BlogPostItem -- --wrap
```

そしたら`src/theme/BlogPostItem/index.js`が生成されるので，それを編集．


```jsx title=src/theme/BlogPostItem/index.js
import React from 'react';
import { useBlogPost } from '@docusaurus/theme-common/internal'
import BlogPostItem from '@theme-original/BlogPostItem';
import GiscusComponent from '@site/src/components/GiscusComponent/GiscusComponent';
import useIsBrowser from '@docusaurus/useIsBrowser';

export default function BlogPostItemWrapper(props) {
  const { metadata, isBlogPostPage } = useBlogPost()
  const isBrowser = useIsBrowser();

  const { frontMatter, slug, title } = metadata
  const { disableComments } = frontMatter

  return (
    <>
      <BlogPostItem {...props} />
      {(!disableComments && isBlogPostPage) && (
        <GiscusComponent />
      )}
    </>
  );
}
```

これですべての投稿にコメントが付く．もしコメントが必要ない投稿があれば，次のように指定．
```md {5}
---
title: "Title of blog post"
authors: author
tags: [keywordOne, keywordTwo]
disableComments: true
---
```

## おわりに
ということで，リニューアルされたコメント機能とリアクション機能が無事ついたのでお気軽にコメント/リアクションしてってください．


[^1]: [How to add Giscus comments to Docusaurus - dev.to](https://dev.to/m19v/how-to-add-giscus-comments-to-docusaurus-439h)