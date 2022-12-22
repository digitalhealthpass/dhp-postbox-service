
## Readme

**Merative<sup>®</sup> Digital Health Pass**

# POSTBOX Service

**Version 2.1, November 2022**   © Copyright Merative US L.P. and others 2020-2022

[↳ Introduction](#introduction)

[↳ Postman](#postman)

[↳ Installation](#installation)

[↳ General Environment Variables](#general-environment-variables)

[↳ IBM Cloud Environment Variables](#ibm-cloud-environment-variables)

[↳ Azure Environment Variables](#azure-environment-variables)

[↳ Local Environment Variables](#local-environment-variables)

[↳ Testing Environment Variables](#testing-environment-variables)

[↳ Library Licenses](#library-licenses)

## Introduction

Merative<sup>®</sup> provides this service for use by [Digital Health Pass](https://www.ibm.com/products/digital-health-pass/ "Digital Health Pass") customers that want to create link and attached documents with the link.  

[↑ Top](#readme)

## Postman

A Postman collection and environment are provided in the `/postman` folder which demonstrates all the functionality of this service, including onboarding an issuer, creating schemas, and creating/verifying/revoking credentials.  To use the collection and environment you must first import them into Postman.  More information on postman can be found [here](https://www.postman.com/) and [here](https://learning.postman.com/docs/getting-started/introduction/).

[↑ Top](#readme)

## Installation

It is recommended to use [Node.js](https://nodejs.org/) v16

To install the dependencies and run the service perform the following from a command line.
Note: Environment variables must be set, as described in following sections, before starting the service. 

```
cd dhp-postbox-service
npm i
node start
```

To execute all tests run the following from a command line.

```
npm run test
```

To execute only unit tests run the following from a command line.

```
npm run test-unit
```

To execute only integration tests run the following from a command line.

```
npm run test-integration
```

[↑ Top](#readme)

## General Environment Variables

The following environment variables must be set before starting the application regardless of the executing environment.

| Environment Variable | Value                                                                                          |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| LOG_LEVEL            | Standard log4js log levels.  debug, info, error, etc.                                          |
| CONTEXT_ROOT         | The context root for all endpoints.  e.g. /api/v1                            |
| USE_HTTPS            | true or false.  If true, then endpoints must be accessed via https, otherwise http             |
| SESSION_SECRET       | A random session secret used by [cookie-session](https://www.npmjs.com/package/cookie-session) |

[↑ Top](#readme)

## IBM Cloud Environment Variables

The following environment variables must be set to execute the service in IBM Cloud

| Environment Variable    | Value                                                                                               |
| ----------------------- | --------------------------------------------------------------------------------------------------- |
| NOSQL_DB_FILE_NAME      | cloudant.js                                                                                         |
| AUTH_STRATEGY_FILE_NAME | app-id-auth-strategy.js                                                                             |
| CLOUDANT_URL            | The Cloudant URL found in IBM Cloud service credentials url value                                   |
| CLOUDANT_IAM_KEY        | The Cloudant IAM key found in IBM Cloud service credentials apikey value                            |
| APP_ID_URL              | The App ID URL found in IBM Cloud service credentials oauthServerUrl value                          |
| APP_ID_IAM_KEY          | The App ID URL found in IBM Cloud service credentials apikey value                                  |
| APP_ID_TENANT_ID        | The App ID URL found in IBM Cloud service credentials tenantId value                                | 
| APP_ID_AUTH_SERVER_HOST | The App ID URL found in IBM Cloud service credentials appidServiceEndpoint value                    |
| APP_ID_CLIENT_ID        | TODO: How to get this                                                                               | 
| APP_ID_SECRET           | TODO: How to get this                                                                               | 
| KEY_PROTECT_URL         | Key Protect URL found in IBM Cloud service endpoints.  The URL must be post-fixed with /api/v2/keys |
| KEY_PROTECT_GUID        | TODO: How to get this                                                                               | 
| KEY_PROTECT_IAM_KEY     | TODO: How to get this                                                                               | 



[↑ Top](#readme)

## Local Environment Variables
The service can run locally and point to any of the configurable IBM Cloud or Azure services, but to run in a stand-alone local mode you must install [CouchDB](https://couchdb.apache.org/) locally.  The following environment variables for a stand-alone local configuration

| Environment Variable    | Value                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------- |
| COUCHDB_URL             | The local CouchDB URL including user id and password.  e.g. http://userid:password@127.0.0.1:5984 |
| NOSQL_DB_FILE_NAME      | couchdb.js                                                                                        |
| AUTH_STRATEGY_FILE_NAME | no-auth-strategy.js                                                                               |

[↑ Top](#readme)


## Testing Environment Variables
The following environment variables must be set to run integration tests.

IBM Cloud integration tests environment variables.

| Environment Variable              | Value                                                                     |
| --------------------------------- | ------------------------------------------------------------------------- |
| INTEGRATION_TESTS_IBM_EMAIL       | The email address of an IBM App ID user with the scope `healthpass.admin` | 
| INTEGRATION_TESTS_IBM_PASSWORD    | The user's password                                                       |


[↑ Top](#readme)



## Library Licenses

This section lists open source libraries used in this SDK. 

**Table 3: Libraries and sources for this SDK** 


| Name                        | License type | Link                                                                         |
| :-------------------------- | :----------- | :--------------------------------------------------------------------------- |
| async_hooks                 | n/a          | https://registry.npmjs.org/async_hooks/-/async_hooks-1.0.0.tgz               |
| body-parser                 | MIT          | git+https://github.com/expressjs/body-parser.git                             |
| cookie-session              | MIT          | git+https://github.com/expressjs/cookie-session.git                          |
| dotenv                      | BSD-2-Clause | git://github.com/motdotla/dotenv.git                                         |
| express                     | MIT          | git+https://github.com/expressjs/express.git                                 |
| helmet                      | MIT          | git://github.com/helmetjs/helmet.git                                         |
| ibmcloud-appid              | Apache-2.0   | git+https://github.com/ibm-cloud-security/appid-serversdk-nodejs.git         |
| log4js                      | Apache-2.0   | git+https://github.com/log4js-node/log4js-node.git                           |
| morgan                      | MIT          | git+https://github.com/expressjs/morgan.git                                  |
| nano                        | Apache-2.0   | git+ssh://git@github.com/apache/couchdb-nano.git                             |
| passport                    | MIT          | git://github.com/jaredhanson/passport.git                                    |
| passport-azure-ad           | MIT          | git+ssh://git@github.com/AzureAD/microsoft-authentication-library-for-js.git |
| uuid                        | MIT          | git+https://github.com/uuidjs/uuid.git                                       |
| @babel/eslint-parser        | MIT          | https://github.com/babel/babel.git                                           |
| babel-eslint                | MIT          | git+https://github.com/babel/babel-eslint.git                                |
| chai                        | MIT          | git+https://github.com/chaijs/chai.git                                       |
| chai-as-promised            | WTFPL        | git+https://github.com/domenic/chai-as-promised.git                          |
| chai-http                   | MIT          | git+ssh://git@github.com/chaijs/chai-http.git                                |
| eslint                      | MIT          | git+https://github.com/eslint/eslint.git                                     |
| eslint-config-airbnb        | MIT          | git+https://github.com/airbnb/javascript.git                                 |
| eslint-config-airbnb-base   | MIT          | git+https://github.com/airbnb/javascript.git                                 |
| eslint-config-node          | ISC          | git+https://github.com/kunalgolani/eslint-config.git                         |
| eslint-config-prettier      | MIT          | git+https://github.com/prettier/eslint-config-prettier.git                   |
| eslint-plugin-chai-friendly | MIT          | git+https://github.com/ihordiachenko/eslint-plugin-chai-friendly.git         |
| eslint-plugin-import        | MIT          | git+https://github.com/import-js/eslint-plugin-import.git                    |
| eslint-plugin-jsx-a11y      | MIT          | git+https://github.com/jsx-eslint/eslint-plugin-jsx-a11y.git                 |
| eslint-plugin-node          | MIT          | git+https://github.com/mysticatea/eslint-plugin-node.git                     |
| eslint-plugin-prettier      | MIT          | git+https://github.com/prettier/eslint-plugin-prettier.git                   |
| eslint-plugin-react         | MIT          | git+https://github.com/jsx-eslint/eslint-plugin-react.git                    |
| eslint-plugin-react-hooks   | MIT          | git+https://github.com/facebook/react.git                                    |
| lint-staged                 | MIT          | git+https://github.com/okonet/lint-staged.git                                |
| mocha                       | MIT          | git+https://github.com/mochajs/mocha.git                                     |
| nock                        | MIT          | git+https://github.com/nock/nock.git                                         |
| nodemon                     | MIT          | git+https://github.com/remy/nodemon.git                                      |
| nyc                         | ISC          | git+ssh://git@github.com/istanbuljs/nyc.git                                  |
| prettier                    | MIT          | git+https://github.com/prettier/prettier.git                                 |
| sinon                       | BSD-3-Clause | git+ssh://git@github.com/sinonjs/sinon.git                                   |

[↑ Top](#readme)

