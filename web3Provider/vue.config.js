const { defineConfig } = require('@vue/cli-service');
const path = require('path');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
var webpack = require('webpack');
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [new NodePolyfillPlugin()],
    optimization: {
      splitChunks: {
        chunks: "all",
      },
    },
    node: {
      __dirname: false
    },
    target: 'web',
    module: {
      rules: [
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          loader: "babel-loader",
          include: [
              // add node_modules/@walletconnect and node_modules/@web3modal to babelLoader rules  
              path.resolve(__dirname, "../../node_modules/@walletconnect"),
              path.resolve(__dirname, "../../node_modules/@web3modal"),
          ],
        }
      ],
      
    },
  },
  
})
