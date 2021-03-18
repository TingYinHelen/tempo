const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, './dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env',
          ],
          plugins: [
            '@babel/plugin-proposal-class-properties',
          ],
        },
      },
    ]
  },
}