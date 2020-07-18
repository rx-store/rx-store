module.exports = {
  name: 'angular-example-counter',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/angular-example-counter',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
