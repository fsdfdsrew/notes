const { defineConfig } = require('@vue/cli-service');
const WebpackObfuscator = require('webpack-obfuscator');

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? '/notes/' : '/',

  productionSourceMap: false,

  configureWebpack: {
    optimization: {
      minimize: true,
    },
    plugins: [
      new WebpackObfuscator(
        {
          rotateStringArray: true,
          stringArray: true,
          stringArrayEncoding: ['base64'],
          stringArrayThreshold: 0.75,
        }
      ),
    ],
  },
});
