// dimz-routes/index.js

let globalConfig = {
    defaultControllerPath: './src/controllers',
    defaultAuth: (req,res,next) => { next() }
};

const configure = (value) => {
    globalConfig = { ...globalConfig, ...value };
};

const getGlobalConfig = () => {
    return { ...globalConfig };
};

module.exports = { config: globalConfig, configure, getGlobalConfig };
