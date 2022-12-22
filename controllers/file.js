// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

const createFile = async (req, res) => {
    return res.status(200).json({
        message: 'File Created.',
    });
};

const updateFile = async (req, res) => {
    return res.status(200).json({
        message: 'File Updated.',
    });
};

const getFile = async (req, res) => {
    return res.status(200).json({
        message: 'File Fetched.',
    });
};

const deleteFile = async (req, res) => {
    return res.status(200).json({
        message: 'File Deleted.',
    });
};

module.exports = {
    createFile,
    updateFile,
    getFile,
    deleteFile,
};
