module.exports = {
  name: 'react',
  preset: '../../jest.config.js',
  transform: {
    '^.+\\.(tsx?|js|html)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  coverageDirectory: '../../coverage/libs/react',
};
