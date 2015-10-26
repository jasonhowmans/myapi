'use strict';

// The updater process operates only when triggered by a github push webhook
// TODO: make this run on a worker thread to separate it from the api
require('./updater');

// The REST service exposes data as JSON at named endpoints
require ('./api');
