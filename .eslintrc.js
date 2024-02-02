module.exports = {
  globals: {
    __PATH_PREFIX__: true,
  },
  extends: [
    'react-app',
  ],
  env: {
    browser: true,
    node: true,
  },
  rules: {
    'react/prop-types': 'off',
  },
};
