module.exports = {
  plugins: ['macros'],
  presets: [
    ['@babel/preset-env', { loose: true }],
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
};
