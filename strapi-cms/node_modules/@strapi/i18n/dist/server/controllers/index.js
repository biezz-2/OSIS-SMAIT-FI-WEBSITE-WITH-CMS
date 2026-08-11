'use strict';

var locales = require('./locales.js');
var contentTypes = require('./content-types.js');
var isoLocales = require('./iso-locales.js');
var settings = require('./settings.js');
var aiLocalizationJobs = require('./ai-localization-jobs.js');

var controllers = {
    locales,
    'iso-locales': isoLocales,
    'content-types': contentTypes,
    settings,
    'ai-localization-jobs': aiLocalizationJobs
};

module.exports = controllers;
//# sourceMappingURL=index.js.map
