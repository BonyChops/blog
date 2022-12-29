// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Bony_Chops Blog',
  tagline: 'Dinosaurs are cool',
  url: 'https://blog.b7s.dev',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'BonyChops', // Usually your GitHub org/user name.
  projectName: 'blog', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'ja',
    locales: ['ja'],
  },

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false,
        blog: {
          routeBasePath: "/",
          showReadingTime: true,
          path: './blog/current',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-blog',
      {
        /**
         * Required for any multi-instance plugin
         */
        id: 'blog-v1',
        /**
         * URL route for the blog section of your site.
         * *DO NOT* include a trailing slash.
         */
        routeBasePath: '/v1',
        /**
         * Path to data on filesystem relative to site dir.
         */
        path: './blog/v1',
      },
    ]
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Blog',
        logo: {
          alt: 'Bony_Chops',
          src: 'https://github.com/bonychops.png',
        },
        items: [
          {
            href: '/v1',
            label: 'ほねつき備忘録アーカイブ',
          },
          {
            href: 'https://bonychops.hatenablog.jp/',
            label: 'ほねつき備忘録(Old Blog)',
            position: 'right',
          },
          {
            href: 'https://github.com/BonyChops/blog',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Socials',
            items: [
              {
                label: 'bonychops.com',
                href: 'https://bonychops.com',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/BonyChops',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/BonyChops',
              },
              {
                label: 'Others',
                href: 'https://bonychops.com/socials',
              },

            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Bony_Chops. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
