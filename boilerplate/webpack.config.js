const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const sassRegex = /\.(scss|sass|css)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;
const loaderUtils = require('loader-utils');

const views = [
  {
    title: 'My Application',
    template: path.join(__dirname, 'src/views/index.html'),
    filename: 'index.html'
  }
];

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';
  const isProd = argv.mode === 'production';
  const cssLoader = isDev ? 'style-loader' : {
    loader: MiniCssExtractPlugin.loader,
    options: {
      publicPath: '../'
    },
  };
  const htmlWebpackPlugins = views.map(view => new HtmlWebpackPlugin(view));
  const getLocalIdent = (context, localIdentName, localName, options) => {
    const fileNameOrFolder = context.resourcePath.match(
      /index\.module\.(css|scss|sass)$/
    )
      ? '[folder]'
      : '[name]';

    const hash = loaderUtils.getHashDigest(
      path.posix.relative(context.rootContext, context.resourcePath) + localName,
      'md5',
      'base64',
      5
    );

    const className = loaderUtils.interpolateName(
      context,
      fileNameOrFolder + '_' + localName + '__' + hash,
      options
    );

    return className.replace('.module_', '_').toLowerCase();
  }

  const config =  {
    entry: './src/index.js',
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
            cssLoader,
            {
              loader: 'css-loader',
              options: {
                modules: false,
                sourceMap: isDev
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: isDev
              }
            }
          ]
        },
        {
          test: sassModuleRegex,
          use: [
            cssLoader,
            {
              loader: 'css-loader',
              options: {
                modules: { getLocalIdent },
                sourceMap: isDev
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: isDev
              }
            }
          ]
        },
        {
          test: /\.(png|jpg|gif|woff|woff2)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                name(file) {
                  const folder = /woff/.test(file) ? 'fonts' : 'images';
                  return `${folder}/[name].[hash:20].[ext]`;
                },
                limit: 8192
              }
            }
          ]
        },
        {
          test: /\.svg$/,
          use: ['@svgr/webpack', 'url-loader'],
        }
      ]
    }
  };

  if (isDev) {
    // Development settings
    Object.assign(config, {
      devtool: 'cheap-module-source-map',
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
      plugins: [...htmlWebpackPlugins]
    });
  } else if (isProd) {
    // Production settings
    Object.assign(config, {
      output: {
        path: path.resolve(__dirname, 'docs'),
        filename: 'js/[name].js'
      },
      devtool: 'source-map',
      plugins: [
        new CleanWebpackPlugin(),
        ...htmlWebpackPlugins,
        new MiniCssExtractPlugin({
          filename: 'css/[name].css'
        })
      ],
      optimization: {
        usedExports: true,
        minimizer: [
          new TerserPlugin({
            extractComments: false
          }),
          new OptimizeCssAssetsPlugin(),
        ]
      }
    });
  }

  return config;
};