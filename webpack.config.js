const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Fix asset paths for web deployment
  config.output.publicPath = '/';
  
  // Ignore the problematic HTML file from react-native-web-webview
  config.plugins.push(
    new (require('webpack')).IgnorePlugin({
      resourceRegExp: /postMock\.html$/,
      contextRegExp: /react-native-web-webview/
    })
  );

  // Ignore react-native-web-webview entirely for web builds
  config.plugins.push(
    new (require('webpack')).IgnorePlugin({
      resourceRegExp: /react-native-web-webview/
    })
  );

  // Provide polyfills for react-native-youtube-iframe web dependencies
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native-web-webview': false,
  };

  // Alternative: Add a rule to handle HTML files if needed
  config.module.rules.push({
    test: /\.html$/,
    use: {
      loader: 'html-loader',
      options: {
        minimize: false
      }
    }
  });

  return config;
};
