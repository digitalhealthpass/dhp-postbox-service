// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

// TODO: partition containers

const nano = require('nano');

const NoSqlDB = require('./nosql-db');
const constants = require('../helpers/constants');
const { getErrorInfo } = require('../utils');
const logger = require('../utils/logger').getLogger('couchdb');

const couch = nano(process.env.COUCHDB_URL || 'http://admin:12345@127.0.0.1:5984');

const postboxDbName = constants.NOSQL_CONTAINER_ID.POSTBOX;

let postboxDB;

const removeUnderscore = (doc) => {
    const docCopy = JSON.parse(JSON.stringify(doc));
    docCopy.id = doc._id;
    docCopy.rev = doc._rev;
    delete docCopy._id;
    delete docCopy._rev;
    return docCopy;
};

const getDB = (DbName) => {
    switch (DbName) {
        case constants.NOSQL_CONTAINER_ID.POSTBOX:
            return postboxDB;
        default:
            // eslint-disable-next-line no-case-declarations
            const error = new Error(`Unknown database id ${DbName}`);
            error.status = 500;
            throw error;
    }
};

const handleError = (err, method, docID) => {
    const { errorStatus, errorMsg } = getErrorInfo(err);
    const error = new Error(`Method: ${method}; Doc ID: ${docID}; Error: ${errorMsg}`);
    error.status = errorStatus;
    throw error;
};

const addUnderscore = (doc) => {
    const docCopy = JSON.parse(JSON.stringify(doc));
    docCopy._id = doc.id;
    docCopy._rev = doc.rev;
    delete docCopy.id;
    delete docCopy.rev;
    return docCopy;
};

const verifyDoc = (doc) => {
    if (!doc.id) {
        const error = new Error('Document is missing id');
        error.status = 400;
        throw error;
    }
};

class CouchDB extends NoSqlDB {
    async init() {
        const dbList = await couch.db.list();
        postboxDB = await this.createDb(postboxDbName, dbList, false);
    }

    // eslint-disable-next-line class-methods-use-this
    async getDoc(dbID, docID, params = {}) {
        logger.info(`getDoc ${docID} from ${dbID} container`);

        const db = getDB(dbID);

        try {
            const response = await db.get(docID, params);
            return removeUnderscore(response);
        } catch (err) {
            return handleError(err, 'getDoc', docID);
        }
    }

    // eslint-disable-next-line class-methods-use-this
    async getDocs(dbName, params) {
        logger.info(`getDocs for params${JSON.stringify(params)} from ${dbName} database`);

        const db = getDB(dbName);

        try {
            const response = await db.find({ selector: { ...params } });

            return removeUnderscore(response);
        } catch (err) {
            return handleError(err, 'getDoc', JSON.stringify(params));
        }
    }

    // eslint-disable-next-line class-methods-use-this
    async writeDoc(dbID, doc) {
        logger.info(`writeDoc ${doc.id} to ${dbID} container`);
        verifyDoc(doc);

        const db = getDB(dbID);

        try {
            const response = await db.insert(addUnderscore(doc));
            return response;
        } catch (err) {
            return handleError(err, 'writeDoc', doc.id);
        }
    }

    // eslint-disable-next-line class-methods-use-this
    async putDoc(dbID, doc) {
        logger.info(`putDoc ${doc.id} from ${dbID} container`);
        verifyDoc(doc);
        if (!doc.rev) {
            const error = new Error('Document is missing rev');
            error.status = 400;
            throw error;
        }

        const db = getDB(dbID);

        try {
            const response = await db.insert(addUnderscore(doc));
            return response;
        } catch (err) {
            return handleError(err, 'putDoc', doc.id);
        }
    }

    // eslint-disable-next-line class-methods-use-this
    async deleteDoc(dbID, docID, docRev) {
        logger.info(`deleteDoc ${docID} from ${dbID} container`);

        const db = getDB(dbID);

        try {
            const response = await db.destroy(docID, docRev);
            return response;
        } catch (err) {
            return handleError(err, 'deleteDoc', docID);
        }
    }

    async deleteDocWithoutRev(dbName, docID) {
        logger.info(`deleteDoc with id ${docID} from ${dbName} database`);

        const db = getDB(dbName);

        const doc = await this.getDoc(dbName, docID);
        const docRev = doc.rev;

        const result = await db.destroy(docID, docRev);
        return result;
    }

    // eslint-disable-next-line class-methods-use-this
    async sanitizeDoc(doc) {
        return doc;
    }

    // eslint-disable-next-line class-methods-use-this
    async createDb(dbName, dbList, partitioned) {
        if (dbList.includes(dbName)) {
            logger.info(`CouchDB ${dbName} already exists`);
        } else {
            await couch.db.create(dbName, { partitioned });
            logger.info(`Successfully created CouchDB ${dbName}`);
        }
        return couch.use(dbName);
    }
}

module.exports = CouchDB;
