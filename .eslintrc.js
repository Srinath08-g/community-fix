module.exports = {
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:react-hooks/recommended'],
  plugins: ['react', 'react-hooks', 'react-native'],
  env: { browser: true, es2021: true, node: true },
  rules: {
    'no-unused-vars': 'warn',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
  },
  settings: { react: { version: 'detect' } },
};
