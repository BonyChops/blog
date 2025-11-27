// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const { themes } = require("prism-react-renderer");
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;
const math = require("remark-math");
const katex = require("rehype-katex");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "BonyChops Blog",
  tagline: "Dinosaurs are cool",
  url: "https://blog.b7s.dev",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "BonyChops", // Usually your GitHub org/user name.
  projectName: "blog", // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "ja",
    locales: ["ja"],
  },

  future: {
    experimental_faster: {
      rspackBundler: true, // required flag
      rspackPersistentCache: true, // new flag
    },
  },

  presets: [
    [
      "@docusaurus/preset-classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false,
        blog: {
          routeBasePath: "/",
          showReadingTime: true,
          path: "./blog/current",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/BonyChops/blog/blob/main/",
          remarkPlugins: [math],
          rehypePlugins: [katex],
          showLastUpdateTime: true,
          postsPerPage: "ALL"
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        gtag: {
          trackingID: process.env.G_TAG ?? "unset",
        },
      }),
    ],
  ],

  plugins: [
    [
      "@docusaurus/plugin-content-blog",
      {
        /**
         * Required for any multi-instance plugin
         */
        id: "blog-v1",
        /**
         * URL route for the blog section of your site.
         * *DO NOT* include a trailing slash.
         */
        routeBasePath: "/v1",
        /**
         * Path to data on filesystem relative to site dir.
         */
        path: "./blog/v1",
      },
    ],
    [
      '@acid-info/docusaurus-og',
      {
        path: './preview-images', // relative to the build directory
        imageRenderers: {
          'docusaurus-plugin-content-blog': require('./lib/components/ImageRenderer').blog,
        },
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "Blog",
        logo: {
          alt: "BonyChops",
          src: "https://github.com/bonychops.png",
        },
        items: [
          {
            href: "/v1",
            label: "ほねつき備忘録アーカイブ",
          },
          {
            href: "https://bonychops.hatenablog.jp/",
            label: "ほねつき備忘録(Old Blog)",
            position: "right",
          },
          {
            href: "https://github.com/BonyChops/blog",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Socials",
            items: [
              {
                label: "bonychops.com",
                href: "https://bonychops.com",
              },
              {
                label: "Twitter",
                href: "https://twitter.com/BonyChops",
              },
              {
                label: "GitHub",
                href: "https://github.com/BonyChops",
              },
              {
                label: "Others",
                href: "https://bonychops.com/socials",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Bony_Chops. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: [
          "yaml",
          "javascript",
          "bash",
          "diff",
          "jsx",
          "markdown",
          "json",
        ],
      },
    }),

  stylesheets: [
    {
      href: "https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css",
      type: "text/css",
      integrity:
        "sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM",
      crossorigin: "anonymous",
    },
  ],
};

module.exports = config;
