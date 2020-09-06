const path = require('path');

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
      items: [
        {
          to: 'docs/core/introduction/getting-started',
          activeBasePath: 'docs/core',
          label: 'Core',
          position: 'left',
        },
        {
          to: 'docs/react/react',
          activeBasePath: 'docs/react',
          label: 'React',
          position: 'left',
        },
        {
          to: 'docs/angular/angular',
          label: 'Angular',
          position: 'left',
        },
        {
          to: 'docs/devtools',
          label: 'Devtools',
          position: 'left',
        },
        {
          to: 'docs/faq/',
          label: 'FAQ',
          position: 'right',
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
              to: 'docs/core/introduction/getting-started',
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
          // homePageId: 'introduction/getting-started',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/rx-store/rx-store/tree/master/apps/rx-store-website',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  plugins: [
    [
      path.resolve(__dirname, 'plugin-typedoc.js'),
      { path: 'src/pages/api-core', include: '**/*.html' },
    ],
  ],
};
