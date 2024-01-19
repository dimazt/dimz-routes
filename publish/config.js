const { config } = require('dimz-routes-beta')


/**
 * change './src/controllers' to your controller path
 * change (req, res, next) => { next() } to your auth middleware
 */

let defineConfig = {
    defaultControllerPath: './src/controllers',
    defaultAuth: (req, res, next) => { next() }
};

config.configure(defineConfig);
module.exports = { config: defineConfig };