'use strict';

// The updater server operates only when triggered
// TODO: make this run on a worker
require('./updater');

// The REST service exposes data as JSON at named endpoints
require ('./api');
