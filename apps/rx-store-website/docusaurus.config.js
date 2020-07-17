module.exports = {
  title: 'Rx Store',
  tagline: 'The stream management library',
  url: 'https://rx-store.github.io',
  baseUrl: '/rx-store/',
  favicon: 'img/favicon.ico',
  organizationName: 'rx-store', // Usually your GitHub org/user name.
  projectName: 'rx-store', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Rx Store',
      links: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Getting Started',
          position: 'left',
        },
        {
          to: 'docs/faq/',
          activeBasePath: 'docs',
          label: 'FAQ',
          position: 'left',
        },
        {
          href: 'https://github.com/rx-store/rx-store',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: 'docs/',
            },
            {
              label: 'FAQ',
              to: 'docs/faq/',
            },
          ],
        },

        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/rx-store/rx-store',
            },
            {
              label: 'Report Issue',
              href: 'https://github.com/rx-store/rx-store/issues',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Josh Ribakoff. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          // It is recommended to set document id as docs home page (`docs/` path).
          homePageId: 'introduction/getting-started',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/rx-store/rx-store/edit/master/website/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
