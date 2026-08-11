'use strict';

var provider = require('./provider.js');
var upload = require('./upload.js');
var imageManipulation = require('./image-manipulation.js');
var folder = require('./folder.js');
var file = require('./file.js');
var weeklyMetrics = require('./weekly-metrics.js');
var metrics = require('./metrics.js');
var apiUploadFolder = require('./api-upload-folder.js');
var index = require('./extensions/index.js');
var aiMetadata = require('./ai-metadata.js');
var aiMetadataJobs = require('./ai-metadata-jobs.js');

const services = {
    provider,
    upload,
    folder,
    file,
    weeklyMetrics,
    metrics,
    'image-manipulation': imageManipulation,
    'api-upload-folder': apiUploadFolder,
    extensions: index,
    aiMetadata: aiMetadata.createAIMetadataService,
    aiMetadataJobs: aiMetadataJobs.createAIMetadataJobsService
};

exports.services = services;
//# sourceMappingURL=index.js.map
