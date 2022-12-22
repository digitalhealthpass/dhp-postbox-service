// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

const express = require('express');

const requestLogger = require('../middleware/request-logger');
const fileController = require('../controllers/file');
const authStrategyHelper = require('../helpers/auth-strategy-helper');

const getRouter = () => {
    const authStrategy = authStrategyHelper.getInstance();

    const userRoleChecker = authStrategy.getAuthStrategy();

    const router = express.Router();
    router.use(requestLogger);

    router.post('/', ...userRoleChecker, fileController.createFile);

    router.put('/:id', ...userRoleChecker, fileController.updateFile);

    router.get('/:id', ...userRoleChecker, fileController.getFile);

    router.delete('/:id', ...userRoleChecker, fileController.deleteFile);
    return router;
};

module.exports = {
    getRouter,
};
