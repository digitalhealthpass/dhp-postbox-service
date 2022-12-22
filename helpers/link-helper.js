// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

const dbHelper = require('./nosql-db-helper');
const constants = require('./constants');
const { getErrorInfo } = require('../utils');

const createLink = async (linkDoc) => {
    try {
        const payload = await dbHelper.getInstance().writeDoc(constants.NOSQL_CONTAINER_ID.POSTBOX, linkDoc);

        return payload;
    } catch (err) {
        const { errorStatus } = getErrorInfo(err);
        if (errorStatus === 404) {
            return false;
        }
        throw err;
    }
};

const getById = async (id, params) => {
    try {
        const payload = await dbHelper.getInstance().getDoc(constants.NOSQL_CONTAINER_ID.POSTBOX, id, params);

        return payload;
    } catch (err) {
        const { errorStatus } = getErrorInfo(err);
        if (errorStatus === 404) {
            return false;
        }
        throw err;
    }
};

const deleteLink = async (id, docRev) => {
    try {
        const payload = await dbHelper.getInstance().deleteDoc(constants.NOSQL_CONTAINER_ID.POSTBOX, id, docRev);

        return payload;
    } catch (err) {
        const { errorStatus } = getErrorInfo(err);
        if (errorStatus === 404) {
            return false;
        }
        throw err;
    }
};

module.exports = {
    createLink,
    getById,
    deleteLink,
};
