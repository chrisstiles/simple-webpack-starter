const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const sassRegex = /\.(scss|sass|css)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const config = {
  entry: './src/index.js',
  devServer: {
    contentBase: path.join(__dirname, 'src/views'),
    port: 8888,
    noInfo: true,
    quiet: true,
    hot: true,
    inline: true,
    clientLogLevel: 'silent',
    watchContentBase: true
  },
  resolve: {
    alias: {
      styles: path.join(__dirname, 'src/styles')
    }
  },
  devtool: 'cheap-module-source-map',
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
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
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
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'My Application',
      template: path.join(__dirname, 'src/views/index.html'),
      filename: 'index.html'
    })
  ]
};

module.exports = config;