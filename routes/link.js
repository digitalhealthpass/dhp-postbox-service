// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

const express = require('express');

const requestLogger = require('../middleware/request-logger');
const linkController = require('../controllers/link');
const authStrategyHelper = require('../helpers/auth-strategy-helper');

const getRouter = () => {
    const authStrategy = authStrategyHelper.getInstance();

    const userRoleChecker = authStrategy.getAuthStrategy();

    const router = express.Router();
    router.use(requestLogger);

    router.post('/', ...userRoleChecker, linkController.createLink);

    router.get('/:id/attachments', ...userRoleChecker, linkController.getLinkAttachments);

    router.get('/:id', ...userRoleChecker, linkController.getLink);

    router.delete('/:id', ...userRoleChecker, linkController.deleteLink);
    return router;
};

module.exports = {
    getRouter,
};
