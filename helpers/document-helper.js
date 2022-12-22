const dbHelper = require('./nosql-db-helper');
const constants = require('./constants');
const { getErrorInfo } = require('../utils');

const createDocument = async (poBoxDoc) => {
    try {
        const payload = await dbHelper.getInstance().writeDoc(constants.NOSQL_CONTAINER_ID.POSTBOX, poBoxDoc);

        return payload;
    } catch (err) {
        const { errorStatus } = getErrorInfo(err);
        if (errorStatus === 404) {
            return false;
        }
        throw err;
    }
};

const updateDocument = async (doc) => {
    try {
        const payload = await dbHelper.getInstance().putDoc(constants.NOSQL_CONTAINER_ID.POSTBOX, doc);

        return payload;
    } catch (err) {
        const { errorStatus } = getErrorInfo(err);
        if (errorStatus === 404) {
            return false;
        }
        throw err;
    }
};

const getById = async (id) => {
    try {
        const payload = await dbHelper.getInstance().getDoc(constants.NOSQL_CONTAINER_ID.POSTBOX, id);

        return payload;
    } catch (err) {
        const { errorStatus } = getErrorInfo(err);
        if (errorStatus === 404) {
            return false;
        }
        throw err;
    }
};

const getDocs = async (params) => {
    try {
        const payload = await dbHelper.getInstance().getDocs(constants.NOSQL_CONTAINER_ID.POSTBOX, params);
        return payload.docs;
    } catch (err) {
        const { errorStatus } = getErrorInfo(err);
        if (errorStatus === 404) {
            return false;
        }
        throw err;
    }
};

const deleteDocById = async (id, rev) => {
    try {
        const payload = await dbHelper.getInstance().deleteDoc(constants.NOSQL_CONTAINER_ID.POSTBOX, id, rev);

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
    createDocument,
    updateDocument,
    getById,
    getDocs,
    deleteDocById,
};
