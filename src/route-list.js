const { loadControllers } = require('./routes');
const path = require('path');
const express = require('express');
const app = express();
const fs = require('fs');

const readDirectory = (directory) => fs.readdirSync(directory);
const isDirectory = (path) => fs.statSync(path).isDirectory();

exports.handle = (config) => {
    let routeList = []
    let version = [];
    const controllerPath = path.resolve(config.defaultControllerPath)
    readDirectory(controllerPath).forEach(file => {
        const filePath = path.join(controllerPath, file);
        if (isDirectory(filePath)) {
            version.push(file);
        }
    });
    if (version.length > 0) {
        version.forEach(version => {
            routeList = loadControllers(path.join(controllerPath, version), version, {}, app);
        });
    }
    if (routeList.length > 0) {
        routeList.map(route => {
            console.log(route);
        })
    }
};
