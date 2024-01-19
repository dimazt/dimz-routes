const { setRoute } = require('./src/routes')
const config = require('./src/config')
const { handle } = require('./src/route-list')
module.exports = { config, setRoute, routeList: handle }