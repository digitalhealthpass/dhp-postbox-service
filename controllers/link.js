/* eslint-disable prefer-const */
/* eslint-disable camelcase */
// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

const { v4: uuidv4 } = require('uuid');

const validator = require('../helpers/validator-helper');
const constants = require('../helpers/constants');
const helper = require('../helpers/link-helper');
const documentHelper = require('../helpers/document-helper');

const { getErrorInfo, getExpiryDateForDays, getBase64Encoded, getBase64Decoded } = require('../utils');

const logger = require('../utils/logger').getLogger('link-controller');

const createLink = async (req, res) => {
    try {
        validator.validateRequestBodyExists(req.body);

        let { password, owner, multiple, no_expiration } = req.body;

        validator.validateJsonValueExists('owner', owner);

        const id = uuidv4();
        const createdAt = new Date();
        const entity = constants.LINK.ENTITY;
        password = password || uuidv4();
        password = getBase64Encoded(password);
        multiple = multiple ?? true;

        const linkDoc = {
            id,
            password,
            owner,
            multiple,
            entity,
            createdAt,
        };

        if (no_expiration !== false) {
            linkDoc.expires_at = getExpiryDateForDays(constants.LINK.EXPIRATION_DAYS);
        }

        let payload = await helper.createLink(linkDoc);
        password = getBase64Decoded(password);

        payload = { password, ...payload };

        return res.status(201).json({
            payload,
            status: 201,
        });
    } catch (error) {
        const { errorStatus, errorMsg } = getErrorInfo(error);
        logger.error(`Failed to create link: ${errorMsg}`);
        return res.status(errorStatus).json({
            message: errorMsg,
            status: errorStatus,
        });
    }
};

const getLink = async (req, res) => {
    try {
        let payload = {};
        let attachments = [];
        const { id } = req.params;
        let inputPassword = req.headers[constants.REQUEST_HEADERS.X_POSTBOX_ACCESS_TOKEN];

        inputPassword = getBase64Encoded(inputPassword);

        const linkPayload = await helper.getById(id);
        const { password, owner, multiple, createdAt, expires_at } = linkPayload;

        if (password !== inputPassword) {
            const err = new Error(`Wrong password, link id:${id}`);
            err.status = 404;
            throw err;
        } else {
            const linkDocs = await documentHelper.getDocs({
                link: id,
                password: linkPayload.password,
            });

            attachments = linkDocs.map((doc) => {
                return {
                    id: doc._id,
                    createdAt: doc.createdAt,
                    expires_at: doc?.expires_at,
                };
            });
        }

        payload = {
            type: constants.LINK.ENTITY,
            payload: {
                id,
                owner,
                multiple,
                createdAt,
                expires_at,
                attachments,
            },
        };
        return res.status(200).json({
            ...payload,
        });
    } catch (error) {
        const { errorStatus, errorMsg } = getErrorInfo(error);
        logger.error(`Failed to get link doc: ${errorMsg}`);
        return res.status(errorStatus).json({
            message: errorMsg,
            status: errorStatus,
        });
    }
};

const getLinkAttachments = async (req, res) => {
    try {
        const { id } = req.params;
        const { from, accessed, format } = req.query;
        let attachments;
        let inputPassword = req.headers[constants.REQUEST_HEADERS.X_POSTBOX_ACCESS_TOKEN];

        inputPassword = getBase64Encoded(inputPassword);

        const matchQuery = {};
        if (format) {
            matchQuery.format = format;
        }
        if (from) {
            matchQuery.from = from;
        }
        if (accessed) {
            matchQuery.accessed = accessed;
        }

        const linkPayload = await helper.getById(id, matchQuery);

        const { password } = linkPayload;

        if (password !== inputPassword) {
            const err = new Error(`Wrong password, link id:${id}`);
            err.status = 404;
            throw err;
        } else {
            const linkDocs = await documentHelper.getDocs({
                link: id,
                password: linkPayload.password,
            });

            attachments = linkDocs.map((doc) => {
                const { id, link, type, name, content, accessed, createdAt, expires_at } = doc;
                return {
                    id,
                    link,
                    type,
                    name,
                    content,
                    accessed,
                    createdAt,
                    expires_at,
                };
            });
        }

        const payload = {
            type: constants.LINK.LINK_ATTACHMENT,
            payload: {
                id,
                attachments,
            },
        };

        return res.status(200).json({
            ...payload,
        });
    } catch (error) {
        const { errorStatus, errorMsg } = getErrorInfo(error);
        logger.error(`Failed to get link doc: ${errorMsg}`);
        return res.status(errorStatus).json({
            message: errorMsg,
            status: errorStatus,
        });
    }
};

const deleteLink = async (req, res) => {
    try {
        const { id } = req.params;
        let inputPassword = req.headers[constants.REQUEST_HEADERS.X_POSTBOX_ACCESS_TOKEN];

        inputPassword = getBase64Encoded(inputPassword);

        const payload = await helper.getById(id);
        const { password, rev } = payload;
        if (password !== inputPassword) {
            const err = new Error(`Wrong password, link id:${id}`);
            err.status = 404;
            throw err;
        }

        await helper.deleteLink(id, rev);

        const linkDocs = await documentHelper.getDocs({ link: id, password });

        if (linkDocs && Array.isArray(linkDocs)) {
            linkDocs.forEach(async (doc) => {
                await documentHelper.deleteDocById(doc._id, doc._rev);
            });
        }

        return res.status(200).json({
            status: 200,
        });
    } catch (error) {
        const { errorStatus, errorMsg } = getErrorInfo(error);
        logger.error(`Failed to delete link doc: ${errorMsg}`);
        return res.status(errorStatus).json({
            message: errorMsg,
            status: errorStatus,
        });
    }
};

module.exports = {
    createLink,
    getLink,
    getLinkAttachments,
    deleteLink,
};
