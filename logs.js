/**
 * This file sets up the logging system and also sets up the
 * external logs system if enabled in the config.
 *
 * The log module will be called by the whole application a lot
 * during its lifetime and is expected to implement the following methods:
 * child(), trace(), debug(), info(), warn(), error(), fatal(), flushQueue().
 */

let bunyan = require("bunyan");
let streams = [{
  level: "debug",
  stream: process.stdout,
}];
let externalSystem;

let reqSerializer = (req) => {
  var filteredReq = {
    method: req.method,
    url: req.url,
    ip: req.ip,
  };
  return filteredReq;
};

let logger = bunyan.createLogger({
  name: "prochains-trains-ratp",
  streams: streams,
  serializers: {
    req: reqSerializer,
    res: bunyan.stdSerializers.res,
    err: bunyan.stdSerializers.err,
  },
});

logger.flushQueue = () => {
  if (externalSystem) {
    externalSystem.flushQueue();
  }
};

module.exports = logger;
