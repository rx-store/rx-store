module.exports = {
  core: [
    {
      type: 'category',
      label: 'Overview',
      collapsed: false,
      items: [
        'core/introduction/motivation',
        'core/introduction/principles',
        'core/introduction/installation',
        'core/introduction/getting-started',
      ],
    },
    {
      collapsed: false,
      type: 'category',
      label: 'Basic Concepts',
      items: [
        'core/basic-concepts/store-value',
        'core/basic-concepts/root-effect',
        'core/basic-concepts/manager',
        'core/basic-concepts/components',
      ],
    },
    {
      collapsed: false,
      type: 'category',
      label: 'Guides',
      items: [
        'core/guides/nesting-effects',
        'core/guides/effect-creators',
        'core/guides/store-state-in-a-stream',
        'core/guides/command-streams',
        'core/guides/manipulate-time',
        'core/guides/recursive-effects',
        'core/guides/combining-in-effects',
        'core/guides/network-requests',
        'core/guides/control-when-effects-run',
      ],
    },
  ],
  react: [
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: ['react/react-installation', 'react/react'],
    },
    {
      type: 'category',
      label: 'Tutorials',
      collapsed: false,
      items: ['react/guides/counter', 'react/guides/autocomplete'],
    },
  ],
  angular: {
    Angular: ['angular/angular'],
  },
};
