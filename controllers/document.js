/* eslint-disable camelcase */
// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

const { v4: uuidv4 } = require('uuid');

const validator = require('../helpers/validator-helper');
const helper = require('../helpers/document-helper');
const linkHelper = require('../helpers/link-helper');
const { getErrorInfo, getBase64Encoded, getExpiryDateForDays } = require('../utils');
const constants = require('../helpers/constants');

const logger = require('../utils/logger').getLogger('document-controller');

const createDocument = async (req, res) => {
    try {
        validator.validateRequestBodyExists(req.body);

        const { content, link, name, expires_at } = req.body;
        let { password } = req.body;
        const id = uuidv4();

        password = getBase64Encoded(password);
        const poBoxDoc = { id, content, password, link, name, expires_at };

        validator.validateJsonValueExists('link', link);

        const linkPayload = await linkHelper.getById(link);

        if (!linkPayload) {
            const err = new Error(`Wrong link id:${link}`);
            err.status = 404;
            throw err;
        }

        const { password: linkPassword } = linkPayload;

        if (password !== linkPassword) {
            const err = new Error(`Wrong password, link id:${link}`);
            err.status = 404;
            throw err;
        }

        const payload = await helper.createDocument(poBoxDoc);

        return res.status(201).json({
            payload,
            status: 201,
        });
    } catch (error) {
        const { errorStatus, errorMsg } = getErrorInfo(error);
        logger.error(`Failed to create document: ${errorMsg}`);
        return res.status(errorStatus).json({
            message: errorMsg,
            status: errorStatus,
        });
    }
};

const getAndPreparePayload = async (reqBody, link, id) => {
    const { content, name, no_expiration } = reqBody;
    let { password } = reqBody;
    password = getBase64Encoded(password);

    const doc = { password, expires_at: null };
    if (no_expiration !== false) {
        doc.expires_at = getExpiryDateForDays(constants.LINK.EXPIRATION_DAYS);
    }
    const {
        rev,
        content: docContent,
        password: docPassword,
        name: docName,
        expires_at: docExpire_at,
    } = await helper.getById(id);

    if (password !== docPassword) {
        const err = new Error(`Wrong password, link id:${link}`);
        err.status = 404;
        throw err;
    }

    doc.content = content ?? docContent;
    doc.name = name ?? docName;
    doc.expires_at = doc.expires_at ?? docExpire_at;

    return { rev, ...doc };
};

const updateDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const link = req.headers[constants.REQUEST_HEADERS.X_HPASS_LINK_ID];

        if (!link) {
            const err = new Error(`LinkId required for update`);
            err.status = 404;
            throw err;
        }

        const { rev, ...restDoc } = await getAndPreparePayload(req.body, link, id);

        if (!rev) {
            const err = new Error(`Wrong id provided for update`);
            err.status = 404;
            throw err;
        }

        const payload = await helper.updateDocument({ id, rev, link, ...restDoc });
        return res.status(200).json({
            payload,
            status: 200,
        });
    } catch (error) {
        const { errorStatus, errorMsg } = getErrorInfo(error);
        logger.error(`Failed to update document: ${errorMsg}`);
        return res.status(errorStatus).json({
            message: errorMsg,
            status: errorStatus,
        });
    }
};

const getDocument = async (req, res) => {
    try {
        const { id } = req.params;
        let password = req.headers[constants.REQUEST_HEADERS.X_POSTBOX_ACCESS_TOKEN];
        const linkId = req.headers[constants.REQUEST_HEADERS.X_HPASS_LINK_ID];

        password = getBase64Encoded(password);

        const docPayload = await helper.getById(id);
        const { link, password: docPassword } = docPayload;

        if (linkId !== link) {
            const err = new Error(`Wrong link id:${link}`);
            err.status = 404;
            throw err;
        }

        if (password !== docPassword) {
            const err = new Error(`Wrong password, link id:${link}`);
            err.status = 404;
            throw err;
        }

        return res.status(200).json({
            payload: { ...docPayload, password: undefined },
            status: 200,
        });
    } catch (error) {
        const { errorStatus, errorMsg } = getErrorInfo(error);
        logger.error(`Failed to Get document: ${errorMsg}`);
        return res.status(errorStatus).json({
            message: errorMsg,
            status: errorStatus,
        });
    }
};

const deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;
        let password = req.headers[constants.REQUEST_HEADERS.X_POSTBOX_ACCESS_TOKEN];
        const linkId = req.headers[constants.REQUEST_HEADERS.X_HPASS_LINK_ID];

        password = getBase64Encoded(password);

        const docPayload = await helper.getById(id);

        const { link, password: docPassword, rev } = docPayload;

        if (linkId !== link) {
            const err = new Error(`Wrong link id:${link}`);
            err.status = 404;
            throw err;
        }

        if (password !== docPassword) {
            const err = new Error(`Wrong password, link id:${link}`);
            err.status = 404;
            throw err;
        }
        const deleteDoc = await helper.deleteDocById(id, rev);

        return res.status(200).json({
            deleteDoc,
            status: 200,
        });
    } catch (error) {
        const { errorStatus, errorMsg } = getErrorInfo(error);
        logger.error(`Failed to create document: ${errorMsg}`);
        return res.status(errorStatus).json({
            message: errorMsg,
            status: errorStatus,
        });
    }
};

module.exports = {
    createDocument,
    updateDocument,
    getDocument,
    deleteDocument,
};
