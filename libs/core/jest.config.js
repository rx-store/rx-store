module.exports = {
  name: 'rx-store',
  preset: '../../jest.config.js',
  transform: {
    '^.+\\.(tsx?|js|html)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  coverageDirectory: '../../coverage/libs/rx-store',
};
