// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

const express = require('express');

const requestLogger = require('../middleware/request-logger');
const documentController = require('../controllers/document');
const authStrategyHelper = require('../helpers/auth-strategy-helper');

const getRouter = () => {
    const authStrategy = authStrategyHelper.getInstance();

    const userRoleChecker = authStrategy.getAuthStrategy();

    const router = express.Router();
    router.use(requestLogger);

    router.post('/', ...userRoleChecker, documentController.createDocument);

    router.put('/:id', ...userRoleChecker, documentController.updateDocument);

    router.get('/:id', ...userRoleChecker, documentController.getDocument);

    router.delete('/:id', ...userRoleChecker, documentController.deleteDocument);

    return router;
};

module.exports = {
    getRouter,
};
