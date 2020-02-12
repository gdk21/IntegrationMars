const webpack = require("webpack");
const path = require("path");
const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");

let config = {
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "./dist"),
      filename: "./main.js"
    },
    module: {
        rules: [{
          test: /\.js$/,
          exclude: /node_modules/,
          loader: "babel-loader"
        },
        {
            test: /\.scss$/,
            use: ['css-hot-loader'].concat(ExtractTextWebpackPlugin.extract({
              fallback: 'style-loader',
              use: ['css-loader', 'sass-loader', 'postcss-loader'],
            }))
          },
          {
            test: /\.(png|svg|jpg|gif)$/,
            use: [
            'file-loader',
            ],
          }
          ]
      },

    plugins: [
        new ExtractTextWebpackPlugin("styles.css")
    ],
    devServer: {
        contentBase: path.resolve(__dirname, "./dist"),
        historyApiFallback: true,
        inline: true,
        open: true,
        hot: true
      },
      devtool: "eval-source-map"
      
}

  module.exports = config;