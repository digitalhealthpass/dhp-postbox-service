// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

const logger = require('../utils/logger').getLogger('validator-helper');

const validate = (value, message) => {
    if (!value) {
        logger.error(message);
        const error = new Error(message);
        error.status = 400;
        throw error;
    }
};

const validateJsonValueExists = (valueName, value) => {
    const msg = `Missing ${valueName} from JSON body`;
    validate(value, msg);
};

const validateQueryParmaExists = (paramName, value) => {
    const msg = `Missing query param ${paramName}`;
    validate(value, msg);
};

const validateRequestHeaderExists = (headerName, value) => {
    const msg = `Missing request header ${headerName}`;
    validate(value, msg);
};

const validatePathVariable = (pathVariableName, value) => {
    const msg = `Missing ${pathVariableName} URL path variable`;
    validate(value, msg);
};

const validateIssuerIdFormat = (issuerId) => {
    if (issuerId.split('.').length === 2) {
        return;
    }
    const error = new Error(`Issuer id header value must follow the format "orgId.userId"`);
    error.status = 400;
    throw error;
};

const validateRequestBodyExists = (body) => {
    validate('Request body required', body);
};

const validateIsArray = (arrayName, array) => {
    if (Array.isArray(array)) {
        return;
    }

    const error = new Error(`${arrayName} must be an array`);
    error.status = 400;
    throw error;
};

//
module.exports = {
    validateJsonValueExists,
    validateQueryParmaExists,
    validateRequestHeaderExists,
    validatePathVariable,
    validateIssuerIdFormat,
    validateRequestBodyExists,
    validateIsArray,
};
