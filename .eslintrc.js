module.exports = {
  globals: {
    __PATH_PREFIX__: true,
  },
  extends: [
    'eslint:recommended',
    'airbnb',
    'airbnb/hooks',
  ],
  env: {
    browser: true,
    node: true,
  },
};
