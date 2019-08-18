const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const pkgName = 'draggable-tree-map';

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, '.tmp'),
    filename: `${pkgName}.js`,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `${pkgName}.css`,
    })
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { hmr: process.env.NODE_ENV === 'development' },
          },
          'css-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
};