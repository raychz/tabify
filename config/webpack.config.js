var webpack = require('webpack');
var path = require('path');
const defaultWebpackConfig = require('@ionic/app-scripts/config/webpack.config.js');

const devAlias = {
	"@tabify/env" : path.resolve('./src/environments/environment.ts')
};
const prodAlias = {
	"@tabify/env" : path.resolve('./src/environments/environment.prod.ts')
};

module.exports = function() {
  defaultWebpackConfig.dev.resolve.alias  = devAlias;
	defaultWebpackConfig.prod.resolve.alias = prodAlias;
  defaultWebpackConfig.prod.output['chunkFilename'] =
    '[name].[chunkhash].chunk.js';
  return defaultWebpackConfig;
};
