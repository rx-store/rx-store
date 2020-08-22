module.exports = {
  core: [
    {
      type: 'category',
      label: 'Introduction',
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
      items: ['core/basics/effects'],
    },
    'core/introduction/rxjs-concepts',
    'core/basics/subjects',
    'core/basics/observables',
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
