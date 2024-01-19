const path = require('path');
const fs = require('fs');
const { getGlobalConfig } = require('./config');
const camelToDash = (str) => str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();

const generateRoute = (version, fileName, func, middlewareMap, currentEndpoint) => {
    const paramNames = func.paramNames;
    const params = paramNames ? paramNames.map(param => `/:${param}`).join('') : '';
    const routeName = func.routeName || camelToDash(func.name.replace(/^(get|create|update|delete)/, ''));
    const route = `/${version}${currentEndpoint ? `/${currentEndpoint}` : ''}/${fileName}/${routeName}${params}`;
    const handler = func;
    const controllerMiddleware = func.controllerMiddleware || [];
    const method = getRequestMethod(func);

    const middlewareList = [
        ...middlewareMap[route] && middlewareMap[route][method] ? middlewareMap[route][method] : [getGlobalConfig().defaultAuth],
        ...controllerMiddleware
    ];

    return { route, method, middlewareList, handler };
};

const getRequestMethod = (func) => {
    const funcName = func.name.toLowerCase();
    return funcName.startsWith('get') ? 'get' :
        funcName.startsWith('create') ? 'post' :
            funcName.startsWith('update') ? 'put' :
                funcName.startsWith('delete') ? 'delete' : 'get';
};

const readDirectory = (directory) => fs.readdirSync(directory);

const isFile = (path) => fs.statSync(path).isFile();

const loadController = (filePath, loadedControllers) => {
    if (!loadedControllers.has(filePath)) {
        const controller = require(filePath);
        loadedControllers.add(filePath);
        return controller;
    }
    return null;
};

const loadControllers = (directory, version, middlewareMap, app, loadedControllers = new Set(), currentEndpoint = '') => {
    const routeList = []
    readDirectory(directory).forEach(file => {
        const filePath = path.join(directory, file);

        if (isFile(filePath)) {
            try {
                const controller = loadController(filePath, loadedControllers);

                if (controller) {
                    const fileName = file.split('.')[0].replace('_', '-');

                    Object.keys(controller).forEach(funcName => {
                        const func = controller[funcName];
                        if (typeof func === 'function') {
                            const { route, method, middlewareList, handler } = generateRoute(version, fileName, func, middlewareMap, currentEndpoint);
                            app[method](route, ...middlewareList, handler);
                            routeList.push(`Route: ${method.toUpperCase()} ${route}`);
                        }
                    });
                }
            } catch (error) {
                console.error(`Error loading controller file ${filePath}:`, error);
            }
        } else {
            const nextEndpoint = currentEndpoint ? `${currentEndpoint}/${file}` : file;
            loadControllers(filePath, version, middlewareMap, app, loadedControllers, nextEndpoint);
        }
    });
    return routeList
};

const setRoute = (version, middlewareMap, app) => {
    const controllerPath = path.resolve(getGlobalConfig().defaultControllerPath || process.cwd(), version);
    loadControllers(controllerPath, version, middlewareMap, app);
};

module.exports = { setRoute, loadControllers };
