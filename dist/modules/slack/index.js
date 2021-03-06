'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uploadFile = exports.postChatMessage = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const slackConfig = _config2.default.get('slack');

const postChatMessage = exports.postChatMessage = message => new Promise((resolve, reject) => {
  const {
    responseUrl,
    channel = null,
    text = null,
    attachments = null,
    replaceOriginal = null
  } = message;

  const payload = {
    response_type: 'in_channel'
  };

  if (channel !== null) payload.channel = channel;
  if (text !== null) payload.text = text;
  if (attachments !== null) payload.attachments = attachments;
  if (replaceOriginal !== null) payload.replace_original = replaceOriginal;

  _request2.default.post({
    url: responseUrl,
    body: payload,
    json: true
  }, (err, response, body) => {
    if (err) {
      reject(err);
    } else if (response.statusCode !== 200) {
      reject(body);
    } else if (body.ok !== true) {
      const bodyString = JSON.stringify(body);
      reject(new Error(`Got non ok response while posting chat message. Body -> ${bodyString}`));
    } else {
      resolve(body);
    }
  });
});

const uploadFile = exports.uploadFile = options => new Promise((resolve, reject) => {
  const {
    filePath,
    fileTmpName,
    fileName,
    fileType,
    channels
  } = options;

  const payload = {
    token: slackConfig.reporterBot.botToken,
    file: _fs2.default.createReadStream(filePath),
    channels,
    filetype: fileType,
    filename: fileTmpName,
    title: fileName
  };

  _request2.default.post({
    url: slackConfig.fileUploadUrl,
    formData: payload,
    json: true
  }, (err, response, body) => {
    if (err) {
      reject(err);
    } else if (response.statusCode !== 200) {
      reject(body);
    } else if (body.ok !== true) {
      const bodyString = JSON.stringify(body);
      reject(new Error(`Got non ok response while uploading file ${fileTmpName} Body -> ${bodyString}`));
    } else {
      resolve(body);
    }
  });
});