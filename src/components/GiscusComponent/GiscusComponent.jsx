import React from 'react';
import Giscus from "@giscus/react";
import { useColorMode } from '@docusaurus/theme-common';

export default function GiscusComponent() {
  const { colorMode } = useColorMode();

  return (
    <Giscus
      repo="BonyChops/blog"
      repoId="R_kgDOIVqhTg"
      category="Comment"
      categoryId="DIC_kwDOImGMcc4CUp3b"
      mapping="pathname"
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
