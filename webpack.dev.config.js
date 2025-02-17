const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const pkg = require('./package.json')
const alias = require('./alias');

module.exports = {
  // Entry files for our popup and background pages
  entry: {
    editor: "./src/index.js",
    player: "./src/index-player.js"    
  },
  output: {
    library: "EasylogicStudio",
    libraryTarget: "umd",
    path: __dirname + "/docs",
  },
  resolve: { alias },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [  
          {
            loader: 'string-replace-loader',
            options: {
              search: '@@VERSION@@',
              replace: pkg.version,
            },
          }, {
            loader: "babel-loader",
            options: {
              cacheDirectory: true 
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      },
      {
        // Apply rule for .sass, .scss or .css files
        test: /\.(sa|sc|c)ss$/,

        // Set loaders to transform files.
        // Loaders are applying from right to left(!)
        // The first loader will be applied after others
        use: [
          {
            // After all CSS loaders we use plugin to do his work.
            // It gets all transformed CSS and extracts it into separate
            // single bundled file
            loader: MiniCssExtractPlugin.loader
          },
          {
            // This loader resolves url() and @imports inside CSS
            loader: "css-loader"
          },
          {
            // Then we apply postCSS fixes like autoprefixer and minifying
            loader: "postcss-loader"
          },
          {
            // First we transform SASS to standard CSS
            loader: "sass-loader",
            options: {
              implementation: require("sass")
            }
          }
        ]
      },
      {
        // Now we apply rule for images
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          {
            // Using file-loader for these files
            loader: "file-loader",
          }
        ]
      },
      {
        // Apply rule for fonts files
        test: /\.(woff|woff2|ttf|otf|eot)$/,
        use: [
          {
            // Using file-loader too
            loader: "file-loader",
            options: {
              outputPath: "fonts"
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      inject: true,
      template: "./src/dev-index.html",
      filename: "./index.html",
      excludeChunks: ['player']
    }),
    new HtmlWebPackPlugin({
      inject: true,
      template: "./src/dev-index.html",
      filename: "./player.html",
      excludeChunks: ['editor']
    }),    
    new MiniCssExtractPlugin({
      filename: "bundle.css"
    })
  ]
};
