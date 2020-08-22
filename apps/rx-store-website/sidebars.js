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
        'core/basic-concepts/effects',
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
        'core/guides/state-vs-events',
        'core/guides/manipulate-time',
        'core/guides/recursive-effects',
        'core/guides/combining-in-effects',
        'core/guides/network-requests',
        'core/guides/trigger-subjects',
        'core/guides/control-when-effects-run',
      ],
    },
  ],
  react: {
    ['Getting Started']: ['react/react-installation', 'react/react'],
    Tutorials: ['react/guides/counter'],
    'API Reference': [
      'react/api-reference/store',
      'react/api-reference/manager',
      'react/api-reference/use-store',
      'react/api-reference/use-subscription',
      'react/api-reference/with-subscription',
    ],
  },
  angular: {
    Angular: ['angular/angular'],
  },
};
