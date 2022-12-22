// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

exports.REQUEST_HEADERS = {
    X_POSTBOX_ACCESS_TOKEN: 'x-postbox-access-token',
    TRANSACTION_ID: 'x-hpass-txn-id',
    X_HPASS_LINK_ID: 'x-hpass-link-id',
};

exports.NOSQL_CONTAINER_ID = {
    POSTBOX: 'postbox',
};

exports.LINK = {
    ENTITY: 'link',
    EXPIRATION_DAYS: 30,
    LINK_ATTACHMENT: 'link-attachments',
};
exports.ROLES = {
    SCHEMA_READER: 'schema.read',
    SCHEMA_WRITER: 'schema.write',
    CREDENTIAL_VERIFY: 'verify.invoke',
    CREDENTIAL_REVOKE: 'credential.revoke',
    HEALTHPASS_ADMIN: 'healthpass.admin',
};

exports.JSON_SCHEMA_URL = 'https://w3c-ccg.github.io/vc-json-schemas/schema/1.0/schema.json';
