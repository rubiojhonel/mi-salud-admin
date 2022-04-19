require('dotenv').config()

const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const { env } = process

module.exports = {
  mode: env.ENVIRONMENT || 'production',
  entry: path.resolve(__dirname, 'frontend/main.js'),
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'public')
  },
  stats: {
    entrypoints: false,
    children: false,
    modules: false,
    version: false
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    hot: true,
    open: true,
    historyApiFallback: true
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['!uploads*']
    }),
    new HtmlWebpackPlugin({
      hash: true,
      title: env.SYSTEM_NAME || 'Health Assessment App',
      favicon: path.resolve(__dirname, 'frontend/favicon.png'),
      template: path.resolve(__dirname, 'frontend/index.html')
    }),
    new VueLoaderPlugin()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'frontend/')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          transformAssetUrls: {
            'v-img': 'src'
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.s(c|a)ss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            // Requires sass-loader@^7.0.0
            options: {
              implementation: require('sass'),
              fiber: require('fibers'),
              indentedSyntax: true // optional
            },
            // Requires sass-loader@^8.0.0
            options: {
              implementation: require('sass'),
              sassOptions: {
                fiber: require('fibers'),
                indentedSyntax: true // optional
              },
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              esModule: false
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader']
      }
    ]
  }
}
