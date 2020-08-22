module.exports = {
  core: [
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'motivation',
        'principles',
        'introduction/installation',
        'introduction/getting-started',
      ],
    },
    {
      collapsed: false,
      type: 'category',
      label: 'Basic Concepts',
      items: ['basics/effects'],
    },
    'introduction/rxjs-concepts',
    'basics/subjects',
    'basics/observables',
    'faq',
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
