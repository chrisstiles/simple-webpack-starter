const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const sassRegex = /\.(scss|sass|css)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const config = {
  entry: './src/index.js',
  devServer: {
    contentBase: './docs',
    port: 8888,
    noInfo: true,
    quiet: true,
    hot: true,
    clientLogLevel: 'none'
  },
  resolve: {
    alias: {
      styles: path.join(__dirname, 'src/styles')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: sassRegex,
        exclude: sassModuleRegex,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: false,
              sourceMap: true
            }
          },
          'sass-loader'
        ]
      },
      {
        test: sassModuleRegex,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[path][name]__[local]--[hash:base64:5]',
              getLocalIdent: (context, localIdentName) => {
                return localIdentName.toLowerCase();
              },
              sourceMap: true
            }
          },
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html'
    }),
    new MiniCssExtractPlugin()
  ]
};

module.exports = config;