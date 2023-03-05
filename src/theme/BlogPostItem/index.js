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
